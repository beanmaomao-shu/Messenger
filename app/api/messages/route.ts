import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { image, message, conversationId } = body;
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });
    const updateConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    //向会话推送信息
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);
    // 更新每个用户的会话列表
    const lastMessage = updateConversation.messages[updateConversation.messages.length - 1];
    updateConversation.users.map(user => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}
