import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  // 获取url中的params参数
  const params = useParams();
  //提取记忆对话id
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }
    return params.conversationId as string;
  }, [params?.conversationId]);
  // 双感叹号！！转conversation字符串类型为boolean
  //判断对话状态
  const isOpen = useMemo(() => !!conversationId, [conversationId]);
  //返回记忆化的对象
  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};
export default useConversation;
