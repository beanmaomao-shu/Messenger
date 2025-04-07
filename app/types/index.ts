// 专门解决数据类型不匹配的问题
import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
// (未经查询)@prisma/client 中的基础类型，不包含关联数据
// type SimpleConversationType = {
//     id: string;
//!     ... 其他基础字段
//     userIds: string[];      // 只有ID，没有具体用户数据
//     messageIds: string[];   // 只有ID，没有具体消息数据
//   }

// (经查询)实际返回的数据结构包含了所有关联数据
// type PrismaReturnType = {
//     id: string;
//! ... 其他 Conversation 基础字段
//     users: User[];           // 包含完整的用户数据
//     messages: {
//       id: string;
//! ... 其他 Message 基础字段
//       sender: User;         // 包含发送者数据
//       seen: User[];        // 包含已读用户数据
//     }[];
//   }
