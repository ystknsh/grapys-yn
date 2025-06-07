import { GraphData } from "graphai";
export const graphChat: GraphData = {
  version: 0.5,
  nodes: {},
  metadata: {
    data: {
      nodes: [
        {
          type: "static",
          nodeId: "messages",
          position: {
            x: 27,
            y: 161,
            width: 144,
            height: 267,
            inputCenters: [56],
            outputCenters: [36],
          },
          data: {
            value: [],
            staticNodeType: "data",
          },
        },
        {
          type: "computed",
          nodeId: "userInput",
          position: {
            x: 220,
            y: 15,
            width: 144,
            height: 184,
            inputCenters: [92],
            outputCenters: [56, 72],
          },
          data: {
            params: {
              message: "You:",
              isResult: true,
            },
            guiAgentId: "eventAgent",
          },
        },
        {
          type: "computed",
          nodeId: "llm",
          position: {
            x: 215,
            y: 242,
            width: 144,
            height: 636,
            inputCenters: [156, 172, 188, 204],
            outputCenters: [56, 72, 88, 104, 120, 136],
          },
          data: {
            params: {
              forWeb: true,
              stream: true,
              isResult: true,
            },
            guiAgentId: "openAIAgent",
          },
        },
        {
          type: "computed",
          nodeId: "reducer",
          position: {
            x: 472,
            y: 238,
            width: 144,
            height: 152,
            inputCenters: [76, 92, 108],
            outputCenters: [56],
          },
          data: {
            guiAgentId: "pushAgent",
          },
        },
        {
          data: {
            agent: "copyAgent",
            guiAgentId: "itemToArrayAgent",
            params: {},
          },
          nodeId: "toArray",
          type: "computed",
          position: {
            x: 471.20882624422705,
            y: 457.62614014409723,
            width: 144,
            height: 168,
            inputCenters: [76, 92, 108, 124],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "copyAgent",
            guiAgentId: "dataToChatBotAgent",
            params: {
              isResult: true,
            },
          },
          nodeId: "meta",
          type: "computed",
          position: {
            x: 469.5818393746695,
            y: 17.108064763174355,
            width: 144,
            height: 168,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
      ],
      edges: [
        {
          source: {
            nodeId: "reducer",
            index: 0,
          },
          target: {
            nodeId: "messages",
            index: 0,
          },
          type: "edge",
        },
        {
          source: {
            nodeId: "messages",
            index: 0,
          },
          target: {
            nodeId: "llm",
            index: 0,
          },
          type: "edge",
        },
        {
          source: {
            nodeId: "userInput",
            index: 0,
          },
          target: {
            nodeId: "llm",
            index: 1,
          },
          type: "edge",
        },
        {
          source: {
            nodeId: "messages",
            index: 0,
          },
          target: {
            nodeId: "reducer",
            index: 0,
          },
          type: "edge",
        },
        {
          type: "edge",
          source: {
            nodeId: "userInput",
            index: 1,
          },
          target: {
            nodeId: "toArray",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "llm",
            index: 0,
          },
          target: {
            nodeId: "toArray",
            index: 1,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "toArray",
            index: 0,
          },
          target: {
            nodeId: "reducer",
            index: 2,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "llm",
            index: 5,
          },
          target: {
            nodeId: "meta",
            index: 0,
            direction: "outbound",
          },
        },
      ],
      loop: {
        loopType: "while",
        while: true,
      },
    },
    forNested: {
      output: {
        userInput_text: ".userInput.text",
        userInput_message: ".userInput.message",
        llm_message: ".llm.message",
        llm_messages: ".llm.messages",
        llm_text: ".llm.text",
        llm_tool: ".llm.tool",
        llm_tool_calls: ".llm.tool_calls",
        llm_metadata: ".llm.metadata",
        meta_message: ".meta.message",
      },
      outputs: [
        {
          name: "userInput_text",
        },
        {
          name: "userInput_message",
        },
        {
          name: "llm_message",
          type: "message",
        },
        {
          name: "llm_messages",
        },
        {
          name: "llm_text",
          type: "text",
        },
        {
          name: "llm_tool",
          type: "data",
        },
        {
          name: "llm_tool_calls",
          type: "array",
        },
        {
          name: "llm_metadata",
          type: "data",
        },
        {
          name: "meta_message",
        },
      ],
    },
  },
};
