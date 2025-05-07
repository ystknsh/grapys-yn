# Grapys - GraphAI GUI tool

This is a tool for creating GraphAI workflows via a GUI. It is available in both Vue and React versions, both of which support the same features.

## Quick start 🚀
  - `cd packages/grapys-react` or `cd packages/grapys-vue`
  - `yarn install`
  - `yarn run dev`

<img width="1078" alt="grapys" src="https://github.com/user-attachments/assets/54f2083e-4c6a-4ea3-9f41-788ef607eefa" />

### Supported Features  
- Adding nodes and inputs (edges) via GUI  
- Inputting and configuring values for `params/static` nodes  
- Configuring loops  
- Generating `GraphData` for GraphAI  
- Managing updates with history, supporting undo/redo  
- Saving data to local storage  
- Executing chat using the created graph data  

## Using LLM APIs 🤖
To use various LLM APIs with this tool, you need to set up API keys as environment variables in the respective package directory you're working with.

### OpenAI LLM

To use OpenAI's LLM:

1. Navigate to your chosen implementation directory:
```bash
cd packages/grapys-vue
# or
cd packages/grapys-react
```

2. Create a .env file in that directory with your API key:
```bash
VITE_OPEN_API_KEY=xxxx yarn run dev
```

3. Start the development server:
```bash
yarn run dev
```

Alternatively, you can set the environment variable directly when running the dev server:
```bash
VITE_OPEN_API_KEY=your_openai_api_key_here yarn run dev
```

### Other Supported LLM APIs
The following environment variables are also supported for their respective services:

```
VITE_ANTHROPIC_API_KEY
VITE_GOOGLE_GENAI_API_KEY
VITE_BROWSERLESS_API_TOKEN
```

Note: All API interactions run entirely within your browser - your API keys are never stored on a server or sent elsewhere.

## Web llm 🌐

This repository provides an agent using a web LLM.
For using this, you can chat entirely within the browser without relying on LLMs like OpenAI.
Currently, it only works on Chrome, so please use Chrome when using this feature.

## Agent profiles 👤
In this repository, you can execute the created graph data directly.
This feature support general GraphAI agents support.

However, [the agent profiles](https://github.com/receptron/grapys/blob/main/packages/grapys-vue/src/utils/gui/data.ts)  are not yet fully developed (contributions via PRs are welcome!).
Agent profiles manage the mapping information between GraphAI and GUI agents.

## Contributions 🤝

Both React and Vue versions support the same features, with some TypeScript files shared between them.
If you contribute to the development of this tool and submit a PR to the repository, please test and verify that it works in both React and Vue.

