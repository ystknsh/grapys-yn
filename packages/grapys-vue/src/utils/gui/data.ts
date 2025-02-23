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
    { name: "message", type: "text" },
    { name: "messages", type: "text" },
    { name: "prompt", type: "text" },
    { name: "model", type: "text" },
  ],
  outputs: [{ name: "message" }, { name: "messages" }, { name: "text", type: "text" }],
  params: [
    { name: "system", type: "text" },
    { name: "prompt", type: "text" },
    { name: "model", type: "string" },
    { name: "stream", type: "boolean" },
    { name: "isResult", type: "boolean" },
    { name: "temperature", type: "float", defaultValue: 0.7, max: 1, min: 0 },
  ],
};

export const agentProfiles: Record<string, AgentProfile> = {
  eventAgent: {
    agent: "eventAgent",
    inputs: [{ name: "wait", type: "array" }],
    outputs: [{ name: "text" }, { name: "message" }],
    params: [{ name: "isResult", type: "boolean" }],
  },
  tinyswallowAgent: {
    agent: "tinyswallowAgent",
    ...llmAgentProfile,
  },
  openAIAgent: {
    agent: "openAIAgent",
    ...llmAgentProfile,
  },
  stringTemplateAgent: {
    agent: "stringTemplateAgent",
    inputs: [{ name: "text" }, { name: "message1" }, { name: "message2" }],
    outputs: [{ name: "text" }],
    params: [],
  },
  pushAgent: {
    agent: "pushAgent",
    inputs: [{ name: "array" }, { name: "item" }, { name: "items" }],
    outputs: [{ name: "array" }],
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
};

export const staticNodeParams: AgentProfile = {
  inputs: [{ name: "update" }],
  outputs: [{ name: "date" }],
};
