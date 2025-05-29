'use client';

import { useRef, useState, useEffect } from 'react';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';

import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);
  useEffect(() => {
    // 订阅特定会话的消息通道
    pusherClient.subscribe(conversationId);

    // 自动滚动到底部
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    const messageHandler = (message: FullMessageType) => {
      setMessages(current => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages(current =>
        current.map(currentMessage => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };
    // 监听新消息事件
    pusherClient.bind('message:new', messageHandler);
    // 监听更新消息事件
    pusherClient.bind('message:update', messageHandler);
    // 清理函数
    return () => {
      // 取消订阅会话
      pusherClient.unsubscribe(conversationId);
      // 解绑新消息事件
      pusherClient.unbind('message:new', messageHandler);
      // 解绑更新事件
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]); //会话ID变化时重新执行
  return (
    <div className="flex-1 overflow-y-auto">
      {messages && messages.length > 0 ? (
        messages.map((message, i) => (
          <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
        ))
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">暂无消息</p>
        </div>
      )}
      <div ref={bottomRef} className="pt-24"></div>
    </div>
  );
};

export default Body;
