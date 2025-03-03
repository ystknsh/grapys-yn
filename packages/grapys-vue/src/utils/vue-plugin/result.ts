import { ref } from "vue";
import { TransactionLog, isObject } from "graphai";
import { GUIMessage } from "../gui/type";

export const useGraphAIResult = () => {
  const graphAIResultPlugin = (setResult: (nodeId: string, result: unknown) => void) => {
    return (log: TransactionLog) => {
      const { nodeId, state, result } = log;
      if (state === "completed" && result) {
        setResult(nodeId, result);
      }
    };
  };
  return {
    graphAIResultPlugin,
  };
};
