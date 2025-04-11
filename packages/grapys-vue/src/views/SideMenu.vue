<template>
  <h2 class="text-lg font-bold">Menu</h2>

  <AddNode />

  <hr />
  <button
    @click="store.undo"
    class="m-1 cursor-pointer items-center rounded-full px-4 py-2 font-bold text-white"
    :class="store.undoable ? 'bg-sky-500 hover:bg-sky-700' : 'bg-sky-200'"
  >
    Undo
  </button>
  <button
    @click="store.redo"
    class="m-1 cursor-pointer items-center rounded-full px-4 py-2 font-bold text-white"
    :class="store.redoable ? 'bg-sky-500 hover:bg-sky-700' : 'bg-sky-200'"
  >
    Redo
  </button>
  <hr />

  <div>
    <button @click="store.reset()" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Clear Graph</button>
  </div>
  <hr />

  <div>
    <button @click="save" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Save Graph</button>
  </div>
  <div>
    <button @click="load" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Load Graph</button>
  </div>

  <div>
    <button @click="() => handleDownload(store.graphData)" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
      Download
    </button>
  </div>
  <hr />

  <TemplateGraph @set-graph="setGraph" />
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import { useStore } from "../store";

import AddNode from "./AddNode.vue";
import TemplateGraph from "./TemplateGraph.vue";

import { handleDownload } from "../utils/gui/utils";

export default defineComponent({
  components: {
    AddNode,
    TemplateGraph,
  },
  setup() {
    const store = useStore();

    const save = () => {
      const dataStr = JSON.stringify(store.graphData);
      window.localStorage.setItem("GRAPHAIGUI", dataStr);
    };

    const load = () => {
      const data = window.localStorage.getItem("GRAPHAIGUI");
      try {
        if (data) {
          const graphData = JSON.parse(data);
          store.loadData(graphData.metadata.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const setGraph = async (graph: GraphData) => {
      store.reset();
      await nextTick(); // to reset edge position. Due to duplicate edge keys, the position will be incorrect.
      store.initFromGraphData(graph);
    };

    return {
      store,
      save,
      load,
      handleDownload,
      setGraph,
    };
  },
});
</script>
