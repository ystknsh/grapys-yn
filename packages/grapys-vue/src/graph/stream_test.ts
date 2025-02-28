export const graphData = {
  nodes: {},
  metadata: {
    data: {
      nodes: [
        {
          data: {
            value: "this is streaming test",
            staticNodeType: "text",
          },
          nodeId: "test",
          type: "static",
          position: {
            x: 30.664060347566476,
            y: 113.92399307959997,
            width: 143.99305725097656,
            height: 224.29689025878906,
            inputCenters: [55.95485591888428],
            outputCenters: [35.97221279144287],
          },
        },
        {
          data: {
            agent: "streamMockAgent",
            guiAgentId: "streamMockAgent",
            params: {
              stream: true,
              isResult: true,
            },
          },
          nodeId: "stream",
          type: "computed",
          position: {
            x: 370.25693835672416,
            y: 19.570546630608703,
            width: 143.99302673339844,
            height: 314.0538330078125,
            inputCenters: [75.93751049041748],
            outputCenters: [55.954874992370605],
          },
        },
        {
          data: {
            value: "hello world.",
            staticNodeType: "text",
          },
          nodeId: "test2",
          type: "static",
          position: {
            x: 30.805477466806792,
            y: 365.58810297237505,
            width: 143.9930419921875,
            height: 224.29689025878906,
            inputCenters: [55.95485973358154],
            outputCenters: [35.97222423553467],
          },
        },
        {
          data: {
            value: "pen pineapple apple pen.",
            staticNodeType: "text",
          },
          nodeId: "test3",
          type: "static",
          position: {
            x: 46.20569295832968,
            y: 647.2047178164688,
            width: 143.99305725097656,
            height: 224.29689025878906,
            inputCenters: [55.954874992370605],
            outputCenters: [35.97223949432373],
          },
        },
        {
          data: {
            agent: "streamMockAgent",
            guiAgentId: "streamMockAgent",
            params: {
              stream: true,
              isResult: true,
            },
          },
          nodeId: "stream2",
          type: "computed",
          position: {
            x: 392.6919781212091,
            y: 363.4295405050342,
            width: 143.99305725097656,
            height: 314.0538024902344,
            inputCenters: [75.93749523162842],
            outputCenters: [55.95485973358154],
          },
        },
        {
          data: {
            agent: "streamMockAgent",
            guiAgentId: "streamMockAgent",
            params: {
              stream: true,
              isResult: true,
            },
          },
          nodeId: "stream3",
          type: "computed",
          position: {
            x: 426.5374377798934,
            y: 690.6786483375371,
            width: 143.99305725097656,
            height: 314.0538330078125,
            inputCenters: [75.93751049041748],
            outputCenters: [55.95484447479248],
          },
        },
      ],
      edges: [
        {
          type: "edge",
          source: {
            nodeId: "test",
            index: 0,
          },
          target: {
            nodeId: "stream",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "test2",
            index: 0,
          },
          target: {
            nodeId: "stream2",
            index: 0,
            direction: "outbound",
          },
        },
        {
          type: "edge",
          source: {
            nodeId: "test3",
            index: 0,
          },
          target: {
            nodeId: "stream3",
            index: 0,
            direction: "outbound",
          },
        },
      ],
      loop: {
        loopType: "none",
      },
    },
  },
};
