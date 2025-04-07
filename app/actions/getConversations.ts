import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getConversations() {
  const currentUser = await getCurrentUser(); //经过关联查询后的数据类型
  if (!currentUser?.id) {
    return [];
  }
  try {
    const conversation = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return conversation;
  } catch {
    return [];
  }
}
