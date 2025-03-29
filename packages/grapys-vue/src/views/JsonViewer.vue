<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    jsonData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);

    return {
      isOpen,
    };
  },
});
</script>

<template>
  <div class="pointer-events-auto flex w-100 flex-col">
    <!-- header -->
    <div class="flex cursor-pointer items-center justify-between rounded-t-lg border border-gray-300 bg-gray-100 p-3" @click="isOpen = !isOpen">
      <div class="flex items-center font-bold">
        <span>JSON Data</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- content -->
    <div
      class="overflow-hidden overflow-y-scroll border border-gray-300 bg-white shadow-lg transition-all duration-300 ease-in-out"
      :class="{ 'max-h-[calc(100vh-90px)]': isOpen, 'max-h-0': !isOpen }"
      :style="{ 'pointer-events': isOpen ? 'auto' : 'none' }"
    >
      <pre class="p-6 font-mono text-xs break-words whitespace-pre-wrap">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>
