import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;
    // 未认证
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // 群聊但不合格
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }
    //群聊合格
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              // 修复 members 的映射语法
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      newConversation.users.forEach(user => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });
      return NextResponse.json(newConversation);
    }
    // 检查两个用户之间是否已经存在对话
    // 因为用户ID的存储顺序可能不固定，所以需要检查两种顺序
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    newConversation.users.map(user => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });
    return NextResponse.json(newConversation);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
