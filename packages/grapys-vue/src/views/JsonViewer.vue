<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "JsonViewer",
  props: {
    jsonData: {
      type: Object,
      required: true,
    },
    onClick: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const handleClick = () => {
      if (props.onClick) {
        props.onClick();
      }
    };

    return {
      handleClick,
    };
  },
});
</script>

<template>
  <div class="pointer-events-auto flex max-h-[calc(100vh-90px)] w-100 flex-col">
    <!-- header -->
    <div class="flex cursor-pointer items-center justify-between rounded-t-lg border border-gray-300 bg-gray-100 p-3 text-black">
      <div class="flex items-center font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
        </svg>
        <span>JSON Data</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" @click="handleClick">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </div>

    <!-- content -->
    <div class="overflow-hidden overflow-y-scroll border border-gray-300 bg-white shadow-lg transition-all duration-300 ease-in-out">
      <pre class="p-6 font-mono text-xs break-words whitespace-pre-wrap">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>
