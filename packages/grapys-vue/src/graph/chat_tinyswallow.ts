export const graphChat = {
  version: 0.5,
  loop: {
    while: true,
  },
  nodes: {
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
      agent: "tinyswallowAgent",
      isResult: true,
      params: {
        forWeb: true,
        stream: true,
        isResult: true,
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
