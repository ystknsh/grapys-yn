<template>
  <div>
    <div v-for="(message, k) in messages" :key="k" class="mb-4" :class="boxPosition(message)">
      <div class="inline-block max-w-[80%] rounded-lg px-4 py-2" :class="boxColor(message)">
        <div class="mb-1 text-sm font-semibold">
          {{ userName(message) }}
        </div>
        <div class="break-words whitespace-pre-wrap">{{ message.content }}</div>
      </div>
    </div>
    <div v-for="(nodeId, k) in streamNodeIds" :key="`stream-${k}`" class="mb-4 text-left">
      <div v-if="isStreaming[nodeId]" class="inline-block max-w-[80%] rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
        <div class="mb-1 text-sm font-semibold">AI ({{ nodeId }})</div>
        <div class="break-words whitespace-pre-wrap">{{ streamData[nodeId] }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GUIMessage } from "../utils/gui/type";

export default defineComponent({
  props: {
    messages: {
      type: Array<GUIMessage>,
      default: () => [],
    },
    isStreaming: {
      type: Object as PropType<Record<string, boolean>>,
      default: () => {
        return {};
      },
    },
    streamData: {
      type: Object as PropType<Record<string, string>>,
      default: () => {
        return {};
      },
    },
    streamNodeIds: {
      type: Array<string>,
      default: () => [],
    },
  },
  setup() {
    const userName = (message: GUIMessage) => {
      if (message.role === "user") {
        return "You";
      }
      if (message.role === "error") {
        return `Error (${message.nodeId})`;
      }
      return `AI (${message.nodeId})`;
    };
    const boxPosition = (message: GUIMessage) => {
      if (message.role === "user") {
        return "text-right";
      }
      if (message.role === "user") {
        return "text-center";
      }
      return "text-left";
    };
    const boxColor = (message: GUIMessage) => {
      if (message.role === "user") {
        return "bg-blue-500 text-white";
      }
      if (message.role === "error") {
        return "bg-red-400 text-white";
      }
      return "bg-gray-200 text-gray-800";
    };
    return {
      userName,
      boxPosition,
      boxColor,
    };
  },
});
</script>
