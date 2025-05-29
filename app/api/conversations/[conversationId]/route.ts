import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string;
}
export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    //获取当前用户
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    //找到当前对话
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }
    //删除当前对话
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId, // 匹配指定的对话ID
        userIds: {
          hasSome: [currentUser.id], // 确保当前用户是对话的参与者
        },
      },
    });

    existingConversation.users.forEach(user => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
