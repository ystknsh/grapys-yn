<template>
  <div>
    <div v-if="nodeData.data.guiAgentId === 'openAIImageAgent' && result?.data[0]?.url">
      <img :src="result?.data[0].url" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, computed, PropType, onMounted, watch } from "vue";

import { useStore } from "../store";

export default defineComponent({
  props: {
    nodeData: {
      type: Object as PropType<GUINodeData>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    // console.log(props.nodeData.nodeId);
    const result = computed(() => {
      console.log("AA", store.graphAIResults, store.graphAIResults[props.nodeData.nodeId]);
      return store.graphAIResults[props.nodeData.nodeId];
    });
    return {
      result,
    };
  },
});
</script>
