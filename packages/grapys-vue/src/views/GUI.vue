<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "vue";
import Node from "./Node.vue";
import Edge from "./Edge.vue";
import Loop from "./Loop.vue";

import ContextEdgeMenu from "./ContextEdgeMenu.vue";
import ContextNodeMenu from "./ContextNodeMenu.vue";

import GraphRunner from "./GraphRunner.vue";
import JsonViewer from "./JsonViewer.vue";

import SideMenu from "./SideMenu.vue";

import { EdgeData, NodePosition, UpdateStaticValue } from "../utils/gui/type";

import { graphChat } from "../graph/chat_tinyswallow";

import { useNewEdge } from "../composable/gui";
import { guiEdgeData2edgeData } from "../utils/gui/utils";
import { useStore } from "../store";

import { CodeBracketSquareIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/vue/24/outline";

export default defineComponent({
  components: {
    SideMenu,
    Node,
    Edge,
    Loop,
    ContextEdgeMenu,
    ContextNodeMenu,
    GraphRunner,
    JsonViewer,
    CodeBracketSquareIcon,
    ChatBubbleBottomCenterTextIcon,
  },
  setup() {
    const store = useStore();
    const contextEdgeMenu = ref();
    const contextNodeMenu = ref();

    store.initFromGraphData(graphChat);

    onMounted(() => {
      saveNodePosition();
    });

    const updateNodePosition = (index: number, pos: NodePosition) => {
      store.updateNodePosition(index, pos);
    };
    const saveNodePosition = () => {
      store.saveNodePositionData();
    };
    const updateStaticNodeValue = (index: number, value: UpdateStaticValue, saveHistory: boolean) => {
      store.updateStaticNodeValue(index, value, saveHistory);
    };
    const updateNestedGraph = (index: number, value: UpdateStaticValue) => {
      store.updateNestedGraph(index, value);
    };

    const edgeDataList = computed<EdgeData[]>(() => {
      return guiEdgeData2edgeData(store.edges, store.nodeRecords);
    });

    const { svgRef, newEdgeData, onNewEdgeStart, onNewEdge, onNewEdgeEnd, nearestData, edgeConnectable } = useNewEdge();

    const openEdgeMenu = (event: MouseEvent, edgeIndex: number) => {
      const rect = svgRef.value.getBoundingClientRect();
      contextEdgeMenu.value.openMenu(event, rect, edgeIndex);
    };
    const closeMenu = () => {
      contextEdgeMenu.value.closeMenu();
      contextNodeMenu.value.closeMenu();
    };
    const openNodeMenu = (event: MouseEvent, nodeIndex: number) => {
      const rect = svgRef.value.getBoundingClientRect();
      contextNodeMenu.value.openMenu(event, rect, nodeIndex);
    };

    const showJsonView = ref(false);
    const showChat = ref(false);

    return {
      updateNodePosition,
      saveNodePosition,
      updateStaticNodeValue,
      updateNestedGraph,

      store,

      edgeDataList,
      onNewEdgeStart,
      onNewEdge,
      onNewEdgeEnd,
      newEdgeData,
      svgRef,
      nearestData,

      contextEdgeMenu,
      contextNodeMenu,
      openEdgeMenu,
      openNodeMenu,
      closeMenu,

      edgeConnectable,

      showJsonView,
      showChat,
    };
  },
});
</script>

<template>
  <div>
    <div class="flex h-screen">
      <aside class="w-48 p-4 text-center">
        <SideMenu />
      </aside>
      <main class="flex-1">
        <div class="relative h-[100vh] overflow-hidden rounded-md border-4 border-gray-200" @click="closeMenu">
          <Loop />
          <svg x="0" y="0" class="pointer-events-none absolute h-[100%] w-full" ref="svgRef">
            <Edge
              v-for="(edge, index) in edgeDataList"
              :key="['edge', edge.source, edge.target, index].join('-')"
              :source-data="edge.source"
              :target-data="edge.target"
              class="pointer-events-auto"
              @dblclick="(e) => openEdgeMenu(e, index)"
            />
            <Edge
              v-if="newEdgeData"
              :source-data="newEdgeData.source"
              :target-data="newEdgeData.target"
              class="pointer-events-auto"
              :is-connectable="edgeConnectable"
            />
          </svg>
          <Node
            v-for="(node, index) in store.nodes"
            :key="[node.nodeId, index].join('-')"
            :node-index="index"
            :node-data="node"
            :nearest-data="nearestData"
            :is-connectable="edgeConnectable"
            @update-position="(pos) => updateNodePosition(index, pos)"
            @update-static-node-value="(value) => updateStaticNodeValue(index, value, true)"
            @update-nested-graph="(value) => updateNestedGraph(index, value)"
            @save-position="saveNodePosition"
            @new-edge-start="onNewEdgeStart"
            @new-edge="onNewEdge"
            @new-edge-end="onNewEdgeEnd"
            @open-node-menu="(event) => openNodeMenu(event, index)"
          />
          <ContextEdgeMenu ref="contextEdgeMenu" />
          <ContextNodeMenu ref="contextNodeMenu" />
        </div>
        <div class="h-100vh pointer-events-none absolute top-0 right-0 z-10 flex max-h-screen flex-col items-end space-y-4 pt-4 pr-4 pb-4">
          <div class="flex flex-row items-start space-x-4">
            <button
              class="pointer-events-auto m-1 cursor-pointer items-center rounded-full border-1 border-gray-300 bg-gray-100 px-4 py-2 text-black"
              @click="showJsonView = !showJsonView"
            >
              <CodeBracketSquareIcon class="size-6" />
            </button>
            <button
              class="pointer-events-auto m-1 cursor-pointer items-center rounded-full border-1 border-gray-300 bg-gray-100 px-4 py-2 text-black"
              @click="showChat = !showChat"
            >
              <ChatBubbleBottomCenterTextIcon class="size-6" />
            </button>
          </div>
          <div class="flex flex-row items-start space-x-4">
            <JsonViewer v-if="showJsonView" :json-data="store.graphData" :on-click="() => (showJsonView = false)" />
            <GraphRunner :class="{ hidden: !showChat }" :graph-data="store.graphData" :on-click="() => (showChat = false)" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
