import { ref } from "vue";
import { TransactionLog } from "graphai";

export const useChatPlugin = () => {
  const messages = ref<{ role: string; content: string }[]>([]);
  const chatMessagePlugin = (targetNodeId: string[]) => {
    return (log: TransactionLog) => {
      const { nodeId, state, result } = log;
      if (targetNodeId.includes(nodeId) && state === "completed" && result) {
        messages.value.push((result as { message: { role: string; content: string } }).message);
      }
    };
  };
  return {
    messages,
    chatMessagePlugin,
  };
};
