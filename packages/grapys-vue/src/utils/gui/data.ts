import { AgentProfile } from "./type";

// data type
//  - string
//    - string, form = input text
//  - text
//    - string, form = textarea (both string and text is string. the diff is form type on UI which is input or textarea)
//  - boolean
//  - float
//    - number, form = input number
//  - int
//    - number, form = input number
//  - data
//    - json formated data(array, object)
//  - message
//  - messages
//  - array

const llmAgentProfile: AgentProfile = {
  inputs: [
    { name: "messages", type: "array" },
    { name: "prompt", type: "text" },
    { name: "model", type: "text" },
    { name: "tools", type: "data" },
  ],
  outputs: [
    { name: "message", type: "message" },
    { name: "messages" },
    { name: "text", type: "text" },
    { name: "tool", type: "data" },
    { name: "tool_calls", type: "array" },
  ],
  params: [
    { name: "system", type: "text" },
    { name: "prompt", type: "text" },
    { name: "model", type: "string" },
    { name: "stream", type: "boolean", defaultValue: true },
    { name: "isResult", type: "boolean", defaultValue: true },
    { name: "temperature", type: "float", defaultValue: 0.7, max: 1, min: 0 },
  ],
};

export const llmAgentProfiles: Record<string, AgentProfile> = {
  tinyswallowAgent: {
    agent: "tinyswallowAgent",
    ...llmAgentProfile,
  },
  openAIAgent: {
    agent: "openAIAgent",
    ...llmAgentProfile,
  },
  anthropicAgent: {
    agent: "anthropicAgent",
    ...llmAgentProfile,
  },
  geminiAgent: {
    agent: "geminiAgent",
    ...llmAgentProfile,
  },
};

export const arrayAgentProfiles: Record<string, AgentProfile> = {
  arrayFlatAgent: {
    agent: "arrayFlatAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "array" }],
    params: [],
  },
  arrayJoinAgent: {
    agent: "arrayJoinAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "text" }],
    params: [],
  },
  popAgent: {
    agent: "popAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "item" }, { name: "array" }],
    params: [],
  },
  pushAgent: {
    agent: "pushAgent",
    inputs: [{ name: "array" }, { name: "item" }, { name: "items" }],
    outputs: [{ name: "array" }],
    params: [],
  },
  shiftAgent: {
    agent: "shiftAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "item" }, { name: "array" }],
    params: [],
  },
};

export const stringAgentProfiles: Record<string, AgentProfile> = {
  stringCaseVariantsAgent: {
    agent: "stringCaseVariantsAgent",
    inputs: [{ name: "text" }],
    outputs: [
      {
        name: "kebabCase",
      },
      {
        name: "lowerCamelCase",
      },
      {
        name: "normalized",
      },
      {
        name: "snakeCase",
      },
    ],
    params: [],
  },
  /*
  stringEmbeddingsAgent: {
    agent: "stringEmbeddingsAgent",
    inputs: [],
    outputs: [],
    params: [],
  },
  */
  stringSplitterAgent: {
    agent: "stringSplitterAgent",
    inputs: [{ name: "text" }],
    outputs: [
      {
        name: "contents",
      },
      {
        name: "count",
      },
      {
        name: "chunkSize",
      },
      {
        name: "overlap",
      },
    ],
    params: [{ name: "chunkSize", type: "int", defaultValue: 64 }],
  },
  stringTemplateAgent: {
    agent: "stringTemplateAgent",
    inputs: [{ name: "text" }, { name: "message1" }, { name: "message2" }],
    outputs: [{ name: "text" }],
    params: [],
  },
  stringUpdateTextAgent: {
    agent: "stringUpdateTextAgent",
    inputs: [{ name: "oldText" }, { name: "newText" }],
    outputs: [{ name: "text" }],
    params: [],
  },
};

export const dataAgentProfiles: Record<string, AgentProfile> = {
  dataObjectMergeAgent: {
    agent: "dataObjectMergeTemplateAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "data" }],
    params: [],
  },
  dataSumTemplateAgent: {
    agent: "dataSumTemplateAgentInfo",
    inputs: [{ name: "array" }],
    outputs: [{ name: "data" }],
    params: [],
  },
  totalAgent: {
    agent: "totalAgent",
    inputs: [{ name: "array" }],
    outputs: [{ name: "result" }],
    params: [],
  },
  convertAgent: {
    agent: "copyAgent",
    inputSchema: {
      context: {
        inputs: {
          person0: {
            name: "interviewer",
            system: ":interviewer",
          },
          person1: {
            name: ":name",
            system: "You are ${:name}.",
            greeting: "Hi, I'm ${:name}",
          },
        },
      },
    },
    inputs: [
      { name: "interviewer", type: "text" },
      { name: "name", type: "text" },
    ],
    outputs: [{ name: "array" }],
    params: [],
  },
  messageAggregatorAgent: {
    agent: "copyAgent",
    inputSchema: {
      array: [":message1", ":message2", ":message3", ":message4"],
    },
    inputs: [
      { name: "message1", type: "message" },
      { name: "message2", type: "message" },
      { name: "message3", type: "message" },
      { name: "message4", type: "message" },
    ],
    outputs: [{ name: "array" }],
    params: [],
  },
  // To output userInput (event) data to chat
  resultAgent: {
    agent: "copyAgent",
    inputSchema: {
      message: ":message",
    },
    inputs: [{ name: "message", type: "message" }],
    outputs: [{ name: "result" }],
    params: [{ name: "isResult", type: "boolean", defaultValue: true }],
  },
  dataToChatBotAgent: {
    agent: "copyAgent",
    inputSchema: {
      message: {
        role: "bot",
        content: ":data",
      },
    },
    inputs: [{ name: "data", type: "data" }],
    outputs: [],
    params: [{ name: "isResult", type: "boolean", defaultValue: true }],
  },
};

export const compareAgentProfiles: Record<string, AgentProfile> = {
  compareAgent: {
    agent: "compareAgent",
    inputs: [],
    outputs: [],
    params: [],
  },
};

// copyAgent,

//  copyMessageAgent,
//  countingAgent,
//  dotProductAgent,
//  echoAgent,
//  images2messageAgent,
//  jsonParserAgent,
//  mapAgent,
//  mergeNodeIdAgent,
//  nestedAgent,
//  propertyFilterAgent,
//  sleeperAgent,
//  sortByValuesAgent,
//  streamMockAgent,
//??  totalAgent,
//  vanillaFetchAgent
export const eventAgentProfiles: Record<string, AgentProfile> = {
  eventAgent: {
    agent: "eventAgent",
    inputs: [{ name: "wait", type: "array" }],
    outputs: [{ name: "text" }, { name: "message" }],
    params: [{ name: "isResult", type: "boolean" }],
  },
};

export const testAgentProfiles: Record<string, AgentProfile> = {
  streamMockAgent: {
    agent: "streamMockAgent",
    inputs: [{ name: "message", type: "text" }],
    outputs: [{ name: "message" }],
    params: [
      { name: "message", type: "string" },
      { name: "sleep", type: "int" },
      { name: "stream", type: "boolean", defaultValue: true },
      { name: "isResult", type: "boolean", defaultValue: true },
    ],
    // presetParams: { isResult: true, stream: true },
  },
};

export const agentProfilesCategory: Record<string, Record<string, AgentProfile>> = {
  event: eventAgentProfiles,
  llm: llmAgentProfiles,
  array: arrayAgentProfiles,
  string: stringAgentProfiles,
  data: dataAgentProfiles,
  test: testAgentProfiles,
  compare: compareAgentProfiles,
};

export const agentProfiles: Record<string, AgentProfile> = Object.values(agentProfilesCategory).reduce((tmp, current) => {
  return { ...tmp, ...current };
}, {});

export const staticNodeParams: AgentProfile = {
  inputs: [{ name: "update" }],
  outputs: [{ name: "date" }],
};
