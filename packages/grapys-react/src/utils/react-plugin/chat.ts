import { useState, useCallback } from "react";
import { TransactionLog } from "graphai";

interface Message {
  role: string;
  content: string;
}

export const useChatPlugin = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const chatMessagePlugin = useCallback((targetNodeId: string[]) => {
    return (log: TransactionLog) => {
      const { nodeId, state, result } = log;
      if (targetNodeId.includes(nodeId) && state === "completed" && result) {
        const newMessage = (result as { message: Message }).message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
  }, []);

  return {
    messages,
    chatMessagePlugin,
  };
};
