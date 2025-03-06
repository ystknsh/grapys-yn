import { GraphData } from "graphai";
export const graphChat: GraphData = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      value: true,
    },
    messages: {
      value: [],
      update: ":reducer.array",
    },
    userInput: {
      agent: "eventAgent",
      params: {
        message: "You:",
        isResult: true,
      },
    },
    llm: {
      agent: "openAIAgent",
      isResult: true,
      params: {
        forWeb: true,
        stream: true,
        isResult: true,
        model: "llama3",
        baseURL: "http://127.0.0.1:11434/v1",
      },
      inputs: { messages: ":messages", prompt: ":userInput.text" },
    },
    reducer: {
      agent: "pushAgent",
      inputs: {
        array: ":messages",
        items: [":userInput.message", ":llm.message"],
      },
    },
  },
};
