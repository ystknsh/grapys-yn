import { create } from "zustand";
import {
  GUINodeData,
  GUIEdgeData,
  GUINodeDataRecord,
  UpdateStaticValue,
  HistoryData,
  HistoryPayload,
  LoopData,
} from "../utils/gui/type";

export interface LocalState {
  histories: HistoryData[];
  currentData: HistoryPayload;
  index: number;
}

export const useLocalStore = create<LocalState>((set, get) => ({
  histories: [],
  currentData: {
    nodes: [],
    edges: [],
    loop: { loopType: "none" },
  },
  index: 0,

  get nodes() {
    console.log("RRR");
    console.log(get().currentData.nodes);
    return get().currentData.nodes;
  },

  reset: () =>
    set((state) => ({
      ...state,
      currentData: { nodes: [], edges: [], loop: { loopType: "none" } },
      histories: [],
      index: 0,
    })),

  initData: (
    nodeData: GUINodeData[],
    edgeData: GUIEdgeData[],
    loopData: LoopData,
  ) =>
    set(() => ({
      currentData: { nodes: nodeData, edges: edgeData, loop: loopData },
    })),

  updateNodePosition: (
    positionIndex: number,
    pos: { x: number; y: number; width: number; height: number },
  ) => {
    set((state) => {
      const newNodes = [...state.currentData.nodes];

      newNodes[positionIndex] = {
        ...newNodes[positionIndex],
        position: { ...newNodes[positionIndex].position, ...pos },
      };

      return { currentData: { ...state.currentData, nodes: newNodes } };
    });
  },

  updateData: (
    nodeData: GUINodeData[],
    edgeData: GUIEdgeData[],
    name: string,
    saveHistory: boolean,
  ) =>
    set((state) => {
      const newData = {
        nodes: nodeData,
        edges: edgeData,
        loop: state.currentData.loop,
      };

      if (saveHistory) {
        state.pushDataToHistory(name, newData);
      }

      return { currentData: newData };
    }),

  pushDataToHistory: (name: string, data: HistoryPayload) =>
    set((state) => {
      const newHistories = [
        ...state.histories.slice(0, state.index),
        { data, name },
      ];
      return {
        histories: newHistories,
        index: state.index + 1,
      };
    }),

  saveNodePositionData: () =>
    set((state) => {
      state.pushDataToHistory("position", state.currentData);
      return {};
    }),
}));
