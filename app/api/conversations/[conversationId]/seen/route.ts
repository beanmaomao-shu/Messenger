import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { last } from 'lodash';
interface IParams {
  conversationId: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    //获取当前用户
    const currentUser = await getCurrentUser();
    const { conversationId } = params;
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // 获取当前对话
    const conversation = await prisma?.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });
    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }
    // 获取最新信息
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(conversation); //代码会直接返回整个对话数据，不会进行任何已读状态的更新。
    }
    // 更新已读消息
    const updateMessage = await prisma?.message.update({
      where: {
        //指定要更新哪条记录
        id: lastMessage.id,
      },
      include: {
        //指定在返回结果中包含哪些关联数据
        sender: true,
        seen: true,
      },
      data: {
        //指定要更新的数据
        seen: {
          connect: {
            id: currentUser.id, //标记当前用户已读了这条消息
          },
        },
      },
    });
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updateMessage],
    });
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(updateMessage);
    }
    await pusherServer.trigger(conversationId!, 'messages:update', updateMessage);
    return NextResponse.json(updateMessage);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGE_SEEN');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
