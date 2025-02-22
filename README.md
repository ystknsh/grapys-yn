# Grapys - GraphAI GUI tool

This is a tool for creating GraphAI workflows via a GUI. It is available in both Vue and React versions, both of which support the same features.

## Quick start 🚀
  - cd packages/grapys-react or packages/grapys-vue
  - yarn install
  - yarn run dev

<img width="1078" alt="grapys" src="https://github.com/user-attachments/assets/54f2083e-4c6a-4ea3-9f41-788ef607eefa" />


## OpenAI llm

To use OpenAI's LLM in the browser, please set your OpenAI key in the following environment variable.
This runs entirely within your browser, so your API key is never stored or sent anywhere else.

```
VITE_OPEN_API_KEY=xxxx yarn run dev
```

## Web llm

This repository provides an agent using a web LLM.
For using this, you can chat entirely within the browser without relying on LLMs like OpenAI.
Currently, it only works on Chrome, so please use Chrome when using this feature.

## Agent profiles
In this repository, you can execute the created graph data directly.
This feature support general GraphAI agents support.

However, [the agent profiles](https://github.com/receptron/grapys/blob/main/packages/grapys-vue/src/utils/gui/data.ts)  are not yet fully developed (contributions via PRs are welcome!).
Agent profiles manage the mapping information between GraphAI and GUI agents.
