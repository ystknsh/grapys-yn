## AgentProfiles

## About AgentProfiles
- Grapys maps and converts GraphAI agents to GUI agents using **AgentProfiles**.
  - GUI-manageable agents are defined in `grapys-{vue/react}/src/utils/gui/data.ts` (AgentProfiles).
  - They are independent of GraphAI agents (not using `AgentFunctionInfo` in GUI).
  - A single GraphAI agent can be mapped to multiple agents in the GUI.
  - For example, `openAIAgent` can be extended into `openAIProgrammerAgent` (pre-configured with a programming system prompt) or `openAIDocumentWriterAgent`, assigning different roles.
  - **AgentProfiles** settings include:
    - GUI agent name
    - Corresponding GraphAI agent name
    - Inputs/outputs (GUI input and output)
    - Params (form-based inputs in the GUI)
    - `inputSchema` (template-based mapping for inputs)
    - **(TODO: `defaultParams` needs to be implemented)**

## examples

```
openAIAgent: {
    agent: "openAIAgent",
    inputs: [
      { name: "message", type: "string" },
      { name: "messages", type: "string" },
      { name: "prompt", type: "string" },
      { name: "model", type: "string" },
    ],
    outputs: [{ name: "message" }, { name: "messages" }, { name: "text", type: "string" }],
    params: [
      { name: "system", type: "text" },
      { name: "prompt", type: "text" },
      { name: "model", type: "string" },
      { name: "stream", type: "boolean" },
      { name: "isResult", type: "boolean" },
      { name: "temperature", type: "float", defaultValue: 0.7, max: 1, min: 0 },
    ],
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
```

### **Restrictions on inputs/outputs**
Due to UI constraints, **inputs only support simple `namedInputs` (key-value pairs), where the value is a `source (GOD format)`**.  
Similarly, **outputs only support `record (object)` format**.  

As a result, **agents that return a raw number or string directly will not work properly**.  
*(Exception: `Static node` can directly return strings and numbers as results.)*

#### **Valid `input` example**
```json
{
  "text": "string",
  "message": "Record",
  "messages": "Array"
}
```

#### **Invalid `input` example**
Nested inputs or template-based inputs (`${}` syntax) are **not supported**:
```json
{
  "nestedData": {
    "message": "string"
  },
  "message": "this is ${some.string}"
}
```
For such cases, use **`inputSchema`** (described later) to transform inputs through an intermediate layer.

---

#### **Valid `output` example (inside an agent)**
```javascript
return {
  test: message,
};
```

#### **Invalid `output` example**
```javascript
return message;
```
**Returning `message` directly will not work.**  
You must **return it in an object (`record`) format**.

---

### **Important Considerations for Implementing Agents**
These restrictions must also be considered when implementing agents.  
**Both `input` and `result` must be handled as `record` objects.**