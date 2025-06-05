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
  },
  setup() {
    const store = useStore();
    const contextEdgeMenu = ref();
    const contextNodeMenu = ref();
    const mainContainer = ref();
    store.initFromGraphData(graphChat);

    // パン（掴んで動かす）とスクロール機能のセットアップ
    const setupPanAndScroll = () => {
      const container = mainContainer.value;
      if (!container) return;

      let isPanning = false;
      let startX = 0;
      let startY = 0;
      let scrollLeftStart = 0;
      let scrollTopStart = 0;

      // マウスでのパン操作
      const handleMouseDown = (e: MouseEvent) => {
        // ノードやエッジ以外の場所でのみパンを開始
        const target = e.target as Element;
        const isClickableElement = target.closest('.node') || target.closest('.edge') || target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'SELECT';
        
        if (!isClickableElement) {
          isPanning = true;
          startX = e.clientX;
          startY = e.clientY;
          scrollLeftStart = container.scrollLeft;
          scrollTopStart = container.scrollTop;
          container.style.cursor = 'grabbing';
          e.preventDefault();
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        container.scrollLeft = scrollLeftStart - deltaX;
        container.scrollTop = scrollTopStart - deltaY;
        e.preventDefault();
      };

      const handleMouseUp = () => {
        isPanning = false;
        container.style.cursor = 'grab';
      };

      // タッチでのパン操作
      const handleTouchStart = (e: TouchEvent) => {
        const target = e.target as Element;
        const isClickableElement = target.closest('.node') || target.closest('.edge') || target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'SELECT';
        
        if (!isClickableElement) {
          isPanning = true;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          scrollLeftStart = container.scrollLeft;
          scrollTopStart = container.scrollTop;
          e.preventDefault();
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isPanning) return;
        
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        
        container.scrollLeft = scrollLeftStart - deltaX;
        container.scrollTop = scrollTopStart - deltaY;
        e.preventDefault();
      };

      const handleTouchEnd = () => {
        isPanning = false;
      };

      // ホイールイベントでのスクロール制御
      const handleWheel = (e: WheelEvent) => {
        const { deltaX, deltaY } = e;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = container;
        
        // 水平スクロールが可能な場合のみ、デフォルト動作を防ぐ
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 左端で左スクロール、または右端で右スクロールの場合はブラウザの動作を許可
          if ((scrollLeft <= 0 && deltaX < 0) || (scrollLeft >= scrollWidth - clientWidth && deltaX > 0)) {
            return;
          }
          e.preventDefault();
          container.scrollLeft += deltaX;
        } else {
          // 垂直スクロールが可能な場合のみ、デフォルト動作を防ぐ
          if ((scrollTop <= 0 && deltaY < 0) || (scrollTop >= scrollHeight - clientHeight && deltaY > 0)) {
            return;
          }
          e.preventDefault();
          container.scrollTop += deltaY;
        }
      };

      // イベントリスナーの追加
      container.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      
      container.addEventListener('wheel', handleWheel, { passive: false });

      // 初期カーソルスタイル
      container.style.cursor = 'grab';
    };

    onMounted(() => {
      saveNodePosition();
      setupPanAndScroll();
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
      mainContainer,
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
        <div ref="mainContainer" class="relative overflow-auto rounded-md border-4 border-gray-200" style="width: calc(100vw - 192px); height: calc(100vh - 40px);" @click="closeMenu">
          <div class="relative" style="width: 2000px; height: 1500px;">
            <Loop />
            <svg x="0" y="0" class="pointer-events-none absolute h-full w-full" ref="svgRef">
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
        </div>
        <div class="h-100vh pointer-events-none absolute top-0 right-0 z-10 flex max-h-screen flex-col items-end space-y-4 pt-4 pr-4 pb-4">
          <div class="flex flex-row items-start space-x-4">
            <button
              class="pointer-events-auto m-1 cursor-pointer items-center rounded-full border-1 border-gray-300 bg-gray-100 px-4 py-2 text-black"
              @click="showJsonView = !showJsonView"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
            </button>
            <button
              class="pointer-events-auto m-1 cursor-pointer items-center rounded-full border-1 border-gray-300 bg-gray-100 px-4 py-2 text-black"
              @click="showChat = !showChat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </button>
          </div>
          <div class="flex flex-row items-start space-x-4">
            <JsonViewer v-if="showJsonView" :json-data="store.graphData" :is-open="showJsonView" @close="showJsonView = false" />
            <GraphRunner :class="{ hidden: !showChat }" :graph-data="store.graphData" :is-open="showChat" @close="showChat = false" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
