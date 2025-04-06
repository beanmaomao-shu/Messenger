import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    //根据邮箱在数据库中查找用户
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch {
    // 如果发生错误，返回 null而不是抛出异常不然会破坏应用
    // 因为这是服务器操作，而不是API路由
    return null;
  }
};

export default getCurrentUser;
