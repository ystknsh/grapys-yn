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

  nodes: () => {
    return get().currentData.nodes;
  },

  edges: () => {
    return get().currentData.edges;
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

  pushNode: (nodeData: GUINodeData) => {
    const { updateData, currentData } = get();
    updateData(
      [...currentData.nodes, nodeData],
      [...currentData.edges],
      "addNode",
      true,
    );
  },

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

  pushEdge: (edgeData: GUIEdgeData) => {
    const { currentData, updateData } = get();
    updateData(
      [...currentData.nodes],
      [...currentData.edges, edgeData],
      "addEdge",
      true,
    );
  },

  // history api
  undoable: () => {
    return get().index > 1;
  },

  undo: () => {
    const { index, histories } = get();
    if (get().index > 1) {
      set((state) => ({
        currentData: histories[index - 2].data,
        index: index - 1,
      }));
    }
  },
  redoable: () => {
    const { index, histories } = get();
    return index < histories.length;
  },

  redo: () => {
    const { index, histories } = get();
    if (index < histories.length) {
      set((state) => ({
        currentData: histories[index].data,
        index: index + 1,
      }));
    }
  },
}));

export const node2Record = (nodes: GUINodeData[]) => {
  return nodes.reduce((tmp: GUINodeDataRecord, current) => {
    tmp[current.nodeId] = current;
    return tmp;
  }, {});
};
