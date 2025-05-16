<template>
  <h2 class="text-left font-bold">Save to LocalStorage</h2>
  <div>
    <button @click="save" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Save Graph</button>
  </div>
  <div>
    <button @click="load" class="m-1 cursor-pointer items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">Load Graph</button>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "../store";

export default defineComponent({
  components: {},
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

    return {
      save,
      load,
    };
  },
});
</script>
