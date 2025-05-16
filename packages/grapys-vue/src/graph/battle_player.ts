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
        },
      },
      isResult: true,
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
        tools: ":tools",
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
      value: "あなたはredチームです。\n与えられたヒントからcode namesの次の候補を出して！！",
    },
    json: {
      agent: "jsonParserAgent",
      params: {},
      inputs: {
        data: ":gameState.board",
      },
      isResult: false,
    },
    gameState: {
      agent: "vanillaFetchAgent",
      params: {},
      inputs: {
        url: "https://dev.aq-world.singularitybattlequest.club/api/${:gameid}/game_state",
      },
      isResult: false,
    },
    tools: {
      value: [
        {
          type: "function",
          function: {
            name: "ChoiceCell",
            description: "post cell ",
            parameters: {
              type: "object",
              required: ["row", "col"],
              properties: {
                row: {
                  type: "integer",
                },
                col: {
                  type: "integer",
                },
              },
            },
          },
        },
      ],
    },
    toolsBot: {
      agent: "copyAgent",
      params: {
        isResult: true,
      },
      inputs: {
        message: {
          role: "bot",
          content: ":llm.tool",
        },
      },
      isResult: true,
    },
    cell: {
      agent: "vanillaFetchAgent",
      params: {
        method: "POST",
      },
      inputs: {
        url: "https://dev.aq-world.singularitybattlequest.club/api/${:gameid}/reveal_cell",
        body: {
          row: ":args.row",
          col: ":args.col",
        },
      },
      isResult: false,
    },
    args: {
      agent: "copyAgent",
      params: {
        namedKey: "arguments",
      },
      inputs: {
        arguments: ":llm.tool.arguments",
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
            x: 533.9245138430258,
            y: 117.53342756634777,
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
            x: 347.34420354120834,
            y: 272.63439085065426,
            width: 144,
            height: 168,
            inputCenters: [76, 92, 108, 124],
            outputCenters: [56],
          },
        },
        {
          data: {
            value: "あなたはredチームです。\n与えられたヒントからcode namesの次の候補を出して！！",
            staticNodeType: "text",
          },
          nodeId: "prompt",
          type: "static",
          position: {
            x: 22.796574596396226,
            y: 405.25551654363744,
            width: 144,
            height: 243,
            inputCenters: [56],
            outputCenters: [36],
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
            x: 182.57405458719063,
            y: 414.3930946463338,
            width: 144,
            height: 120,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "vanillaFetchAgent",
            guiAgentId: "gameStateAgent",
            params: {},
          },
          nodeId: "gameState",
          type: "computed",
          position: {
            x: 177.94025812699277,
            y: 119.99229268257207,
            width: 144,
            height: 216,
            inputCenters: [172],
            outputCenters: [56, 72, 88, 104, 120, 136, 152],
          },
        },
        {
          data: {
            value: [
              {
                type: "function",
                function: {
                  name: "ChoiceCell",
                  description: "post cell ",
                  parameters: {
                    type: "object",
                    required: ["row", "col"],
                    properties: {
                      row: {
                        type: "integer",
                      },
                      col: {
                        type: "integer",
                      },
                    },
                  },
                },
              },
            ],
            staticNodeType: "data",
          },
          nodeId: "tools",
          type: "static",
          position: {
            x: 330.5870995025862,
            y: 494.846697280352,
            width: 144,
            height: 267,
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
          nodeId: "toolsBot",
          type: "computed",
          position: {
            x: 778.4810309542365,
            y: 93.2704454733153,
            width: 144,
            height: 168,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
        {
          data: {
            agent: "vanillaFetchAgent",
            guiAgentId: "revealCell",
            params: {
              method: "POST",
            },
          },
          nodeId: "cell",
          type: "computed",
          position: {
            x: 988.8233867837166,
            y: 253.04566659853708,
            width: 144,
            height: 200,
            inputCenters: [124, 140, 156],
            outputCenters: [56, 72, 88, 104],
          },
        },
        {
          data: {
            agent: "copyAgent",
            guiAgentId: "arguments2cellPost",
            params: {
              namedKey: "arguments",
            },
          },
          nodeId: "args",
          type: "computed",
          position: {
            x: 758.5593537049091,
            y: 342.7611982874075,
            width: 144,
            height: 136,
            inputCenters: [92],
            outputCenters: [56, 72],
          },
        },
      ],
      edges: [
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
            nodeId: "merge",
            index: 0,
          },
          target: {
            nodeId: "llm",
            index: 1,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "gameid",
            index: 0,
          },
          target: {
            nodeId: "gameState",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "gameState",
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
            nodeId: "tools",
            index: 0,
            direction: "inbound",
          },
          target: {
            nodeId: "llm",
            index: 3,
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "llm",
            index: 3,
          },
          target: {
            nodeId: "toolsBot",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "llm",
            index: 3,
          },
          target: {
            nodeId: "args",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "args",
            index: 0,
          },
          target: {
            nodeId: "cell",
            index: 1,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "args",
            index: 1,
          },
          target: {
            nodeId: "cell",
            index: 2,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "gameid",
            index: 0,
          },
          target: {
            nodeId: "cell",
            index: 0,
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
        toolsBot_message: ".toolsBot.message",
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
          name: "toolsBot_message",
        },
      ],
    },
  },
};
