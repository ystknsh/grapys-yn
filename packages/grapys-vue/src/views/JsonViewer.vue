<script lang="ts">
import { defineComponent } from "vue";
import { XMarkIcon, CodeBracketSquareIcon } from "@heroicons/vue/24/outline";

export default defineComponent({
  name: "JsonViewer",
  components: {
    XMarkIcon,
    CodeBracketSquareIcon,
  },
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
        <CodeBracketSquareIcon class="size-6" />
        <span>JSON Data</span>
      </div>
      <XMarkIcon class="size-6" @click="handleClick" />
    </div>

    <!-- content -->
    <div class="overflow-hidden overflow-y-scroll border border-gray-300 bg-white shadow-lg transition-all duration-300 ease-in-out">
      <pre class="p-6 font-mono text-xs break-words whitespace-pre-wrap">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>
