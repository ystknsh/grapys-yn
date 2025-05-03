import { GraphData } from "graphai";
export const graphChat: GraphData = {
  version: 0.5,
  nodes: {
    register: {
      agent: "vanillaFetchAgent",
      params: {
        url: "https://dev.aq-world.singularitybattlequest.club/api/register",
        method: "POST",
      },
      inputs: {
        body: {
          game_id: ":gameid",
          team: ":team",
        },
      },
      isResult: false,
    },
    gameid: {
      value: "123aaa",
    },
    team: {
      value: "red",
    },
    bot: {
      agent: "copyAgent",
      params: {
        isResult: true,
      },
      inputs: {
        message: {
          role: "bot",
          content: ":register.status",
        },
      },
      isResult: true,
    },
  },
  metadata: {
    data: {
      nodes: [
        {
          data: {
            agent: "vanillaFetchAgent",
            guiAgentId: "gameRegister",
            params: {
              url: "https://dev.aq-world.singularitybattlequest.club/api/register",
              method: "POST",
            },
          },
          nodeId: "register",
          type: "computed",
          position: {
            x: 225.40842059070985,
            y: 242.36026804684178,
            width: 144,
            height: 136,
            inputCenters: [76, 92],
            outputCenters: [56],
          },
        },
        {
          data: {
            value: "123aaa",
            staticNodeType: "text",
          },
          nodeId: "gameid",
          type: "static",
          position: {
            x: 47.983502015446106,
            y: 120.29806604095974,
            width: 144,
            height: 243,
            inputCenters: [56],
            outputCenters: [36],
          },
        },
        {
          data: {
            value: "red",
            staticNodeType: "text",
          },
          nodeId: "team",
          type: "static",
          position: {
            x: 40.00856458618915,
            y: 379.5002510361081,
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
            x: 419.81203211878244,
            y: 400.92018742484504,
            width: 144,
            height: 168,
            inputCenters: [76],
            outputCenters: [56],
          },
        },
      ],
      edges: [
        {
          type: "edge",
          source: {
            nodeId: "team",
            index: 0,
          },
          target: {
            nodeId: "register",
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
            nodeId: "register",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "register",
            index: 0,
          },
          target: {
            nodeId: "bot",
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
      },
      outputs: [
        {
          name: "bot_message",
        },
      ],
    },
  },
};
