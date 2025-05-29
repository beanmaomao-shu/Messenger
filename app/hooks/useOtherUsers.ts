import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUsers = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession(); //用来获取当前登录用户的邮箱
  const otherUser = useMemo(() => {
    const currentUserEamil = session?.data?.user?.email;
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEamil
    );
    return otherUser[0]; //一对一聊天返回对方用户
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUsers;
