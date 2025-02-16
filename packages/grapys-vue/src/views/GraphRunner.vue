<template>
  <div>
    <button @click="run">run</button>

    <div class="items-center justify-center">
      <div class="mt-2">
        <chat :messages="messages" :is-streaming="isStreaming" :stream-data="streamData" :stream-node-ids="streamNodes" />
      </div>
      <div class="mt-2">
        <button class="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700" @click="run">Run</button>
      </div>

      <div>
        <div class="m-auto my-4 w-10/12">
          <div v-if="events.length > 0" class="hidden font-bold text-red-600">Write message to bot!!</div>
          <div class="flex">
            <input v-model="userInput" class="flex-1 rounded-md border-2 p-2" :disabled="events.length == 0" />
            <button
              class="ml-1 flex-none items-center rounded-md px-4 py-2 font-bold text-white hover:bg-sky-700"
              :class="events.length == 0 ? 'bg-sky-200' : 'bg-sky-500'"
              @click="submitText(events[0])"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <div v-if="!ready">Loading web llm model</div>
      <div v-else>Ready!</div>
      <div>
        {{ loading }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { GraphAI } from "graphai";

import { useStore } from "../store";

import { useStreamData } from "../utils/vue-plugin/stream";
import { useChatPlugin } from "../utils/vue-plugin/chat";

import Chat from "../components/Chat.vue";

import * as agents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";

import tinyswallowAgent, { modelLoad, loadEngine, CallbackReport } from "../agents/tinyswallow";
import { textInputEvent } from "../agents/event";

export default defineComponent({
  components: {
    Chat,
  },
  setup() {
    const store = useStore();
    loadEngine();

    // TODO
    // const streamNodes = ["llm"];
    // const outputNodes = ["llm", "userInput"];
    const { eventAgent, userInput, events, submitText } = textInputEvent();
    const { messages, chatMessagePlugin } = useChatPlugin();
    const { streamData, streamAgentFilter, streamPlugin, isStreaming } = useStreamData();

    const agentFilters = [
      {
        name: "streamAgentFilter",
        agent: streamAgentFilter,
      },
    ];

    const run = async () => {
      const graphai = new GraphAI(
        store.graphData,
        {
          ...agents,
          openAIAgent,
          eventAgent,
          tinyswallowAgent,
        },
        {
          agentFilters,
          config: {
            openAIAgent: {
              apiKey: import.meta.env.VITE_OPEN_API_KEY,
              forWeb: true,
            },
          },
        },
      );
      // console.log(store.streamNodes);
      // console.log(store.resultNodes);
      graphai.registerCallback(streamPlugin(store.streamNodes));
      graphai.registerCallback(chatMessagePlugin(store.resultNodes));

      await graphai.run();
      // console.log(store.graphData);
    };
    const streamNodes = computed(() => {
      return store.streamNodes;
    });
    const loading = ref("");
    const ready = ref(false);
    modelLoad((report: CallbackReport) => {
      if (report.progress === 1) {
        ready.value = true;
      }
      loading.value = report.text;
      console.log(report.text);
    });

    return {
      run,

      streamData,
      isStreaming,

      submitText,
      userInput,
      messages,
      events,
      streamNodes,

      loading,
      ready,
    };
  },
});
</script>
