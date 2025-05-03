import { GraphData } from "graphai";
export const graphChat: GraphData = {
  version: 0.5,
  nodes: {
    gameid: {
      value: "123aaa",
    },
    bot: {
      agent: "copyAgent",
      params: {
        isResult: true,
      },
      inputs: {
        message: {
          role: "bot",
          content: ":spy.board",
        },
      },
      isResult: true,
    },
    spy: {
      agent: "vanillaFetchAgent",
      params: {},
      inputs: {
        url: "https://dev.aq-world.singularitybattlequest.club/api/${:gameid}/spymaster_state",
      },
      isResult: false,
    },
    llm: {
      agent: "openAIAgent",
      params: {
        stream: true,
        isResult: true,
        temperature: 0.7,
      },
      inputs: {
        prompt: ":merge.array",
      },
      isResult: true,
    },
    merge: {
      agent: "copyAgent",
      params: {},
      inputs: {
        array: [":json.text", ":prompt"],
      },
      isResult: false,
    },
    prompt: {
      value: "あなたはredチームです。\n与えられたjsonデータからcode namesのヒントを出して！！",
    },
    message: {
      agent: "copyAgent",
      params: {
        isResult: true,
      },
      inputs: {
        message: {
          role: "bot",
          content: ":llm.text",
        },
      },
      isResult: true,
    },
    json: {
      agent: "jsonParserAgent",
      params: {},
      inputs: {
        data: ":spy.board",
      },
      isResult: false,
    },
  },
  metadata: {
    data: {
      nodes: [
        {
          data: {
            value: "123aaa",
            staticNodeType: "text",
          },
          nodeId: "gameid",
          type: "static",
          position: {
            x: 11.983502015446106,
            y: 124.29806604095974,
            width: 144,
            height: 243,
            inputCenters: [56],
            outputCenters: [36],
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
          nodeId: "bot",
          type: "computed",
          position: {
            x: 349.81203211878244,
            y: 80.92018742484504,
            width: 144,
            height: 168,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "vanillaFetchAgent",
            guiAgentId: "spyMasterAgent",
            params: {},
          },
          nodeId: "spy",
          type: "computed",
          position: {
            x: 174.01068422496144,
            y: 216.70678865781457,
            width: 144,
            height: 120,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "openAIAgent",
            guiAgentId: "openAIAgent",
            params: {
              stream: true,
              isResult: true,
              temperature: 0.7,
            },
          },
          nodeId: "llm",
          type: "computed",
          position: {
            x: 569.9245138430258,
            y: 146.53342756634777,
            width: 144,
            height: 620,
            inputCenters: [140, 156, 172, 188],
            outputCenters: [56, 72, 88, 104, 120],
          },
        },
        {
          data: {
            agent: "copyAgent",
            guiAgentId: "itemToArrayAgent",
            params: {},
          },
          nodeId: "merge",
          type: "computed",
          position: {
            x: 352.34420354120834,
            y: 306.63439085065426,
            width: 144,
            height: 168,
            inputCenters: [76, 92, 108, 124],
            outputCenters: [56],
          },
        },
        {
          data: {
            value: "あなたはredチームです。\n与えられたjsonデータからcode namesのヒントを出して！！",
            staticNodeType: "text",
          },
          nodeId: "prompt",
          type: "static",
          position: {
            x: 8.796574596396226,
            y: 398.25551654363744,
            width: 144,
            height: 243,
            inputCenters: [56],
            outputCenters: [36],
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
          nodeId: "message",
          type: "computed",
          position: {
            x: 730.231353036833,
            y: 169.07262572529368,
            width: 144,
            height: 168,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "jsonParserAgent",
            guiAgentId: "dataToJsonString",
            params: {},
          },
          nodeId: "json",
          type: "computed",
          position: {
            x: 187.57405458719063,
            y: 466.3930946463338,
            width: 144,
            height: 120,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
      ],
      edges: [
        {
          type: "edge",
          source: {
            nodeId: "gameid",
            index: 0,
          },
          target: {
            nodeId: "spy",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "spy",
            index: 0,
          },
          target: {
            nodeId: "bot",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "prompt",
            index: 0,
          },
          target: {
            nodeId: "merge",
            index: 1,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "llm",
            index: 2,
          },
          target: {
            nodeId: "message",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "json",
            index: 0,
            direction: "inbound",
          },
          target: {
            nodeId: "merge",
            index: 0,
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "spy",
            index: 0,
          },
          target: {
            nodeId: "json",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "merge",
            index: 0,
          },
          target: {
            nodeId: "llm",
            index: 1,
            direction: "outbound",
          },
        },
      ],
      loop: {
        loopType: "none",
      },
    },
    forNested: {
      output: {
        bot_message: ".bot.message",
        llm_message: ".llm.message",
        llm_messages: ".llm.messages",
        llm_text: ".llm.text",
        llm_tool: ".llm.tool",
        llm_tool_calls: ".llm.tool_calls",
        message_message: ".message.message",
      },
      outputs: [
        {
          name: "bot_message",
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
          name: "message_message",
        },
      ],
    },
  },
};
