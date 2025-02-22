<template>
  <div class="absolute flex w-36 cursor-grab flex-col rounded-md bg-green-400 text-center text-white select-none">
    <div class="w-full rounded-t-md bg-green-500 py-1 text-center leading-none">Loop</div>
    <div class="my-4 p-2">
      <select class="w-full resize-none rounded-md border border-gray-300 p-1 text-black" @change="updateType" :value="loopType">
        <option value="none">None</option>
        <option value="while">While</option>
        <option value="count">Count</option>
      </select>

      <div v-if="loopType === 'while'" class="mt-2">
        <select class="w-full resize-none rounded-md border border-gray-300 p-1 text-black" @change="updateWhile" :value="whileValue">
          <option v-for="item in whileSources" :key="item">{{ item }}</option>
        </select>
      </div>
      <div v-show="loopType === 'count'" class="mt-2">
        <input type="number" class="w-full rounded-md border border-gray-300 p-1 text-black" ref="countRef" v-model="countValue" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "../store";
import { agentProfiles } from "../utils/gui/data";

export default defineComponent({
  setup() {
    const store = useStore();

    const whileSources = computed(() => {
      const sources: string[] = [];
      store.nodes.forEach((node) => {
        const agent = node.data.guiAgentId;
        if (agent) {
          const profile = agentProfiles[agent];
          profile.outputs.forEach((prop) => {
            sources.push(`:${node.nodeId}.${prop.name}`);
          });
        } else {
          // static node
          sources.push(`:${node.nodeId}`);
        }
      });
      return sources;
    });

    const storeLoopData = computed(() => {
      if (loopType.value === "while") {
        return {
          loopType: "while",
          while: whileValue.value,
        };
      }
      if (loopType.value === "count") {
        return {
          loopType: "count",
          count: Number(countValue.value),
        };
      }
      return {
        loopType: "none",
      };
    });
    watch(
      () => store.loop,
      (value) => {
        loopType.value = value.loopType;
        if (value.loopType === "while") {
          whileValue.value = value.while ?? "";
        }
        if (value.loopType === "count") {
          countValue.value = String(value.count ?? 1);
        }
      },
    );

    const updateLoop = () => {
      store.updateLoop(storeLoopData.value);
    };

    const loopType = ref(store.loop.loopType);
    const countValue = ref("1");
    const whileValue = ref(whileSources.value[0]);
    const countRef = ref();

    const updateType = (event: Event) => {
      if (event.target instanceof HTMLSelectElement) {
        loopType.value = event?.target?.value ?? "";
        updateLoop();
      }
    };
    const updateWhile = (event: Event) => {
      if (event.target instanceof HTMLSelectElement) {
        whileValue.value = event?.target?.value ?? "";
        updateLoop();
      }
    };
    const blurUpdateEvent = () => {
      updateLoop();
    };
    onMounted(() => {
      if (countRef.value) {
        countRef.value.addEventListener("blur", blurUpdateEvent);
      }
    });
    onBeforeUnmount(() => {
      if (countRef.value) {
        countRef.value.removeEventListener("blur", blurUpdateEvent);
      }
    });

    return {
      loopType,
      countValue,
      whileValue,

      whileSources,

      updateType,
      updateWhile,

      countRef,
      store,
    };
  },
});
</script>
