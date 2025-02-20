import { create } from "zustand";
import { GUINodeData, GUIEdgeData, GUINodeDataRecord, UpdateStaticValue, HistoryData, HistoryPayload, LoopData } from "../utils/gui/type";
import { edges2inputs, store2graphData } from "../utils/gui/utils";

export interface LocalState {
  histories: HistoryData[];
  currentData: HistoryPayload;
  index: number;

  // react
  updateData: (nodeData: GUINodeData[], edgeData: GUIEdgeData[], name: string, saveHistory: boolean) => void;

  // methods
  initData: (nodeData: GUINodeData[], edgeData: GUIEdgeData[], loopData: LoopData) => void;
  pushNode: (nodeData: GUINodeData) => void;
  pushEdge: (edgeData: GUIEdgeData) => void;
  deleteEdge: (edgeIndex: number) => void;
  deleteNode: (nodeIndex: number) => void;

  updateNodePosition: (positionIndex: number, pos: { x: number; y: number; width: number; height: number }) => void;
  updateNodeParam: (positionIndex: number, key: string, value: unknown) => void;
  pushDataToHistory: (name: string, data: HistoryPayload) => void;
  saveNodePositionData: () => void;

  loadData: (data: HistoryPayload) => void;

  updateStaticNodeValue: (nodeIndex: number, value: UpdateStaticValue, saveHistory: boolean) => void;
  updateLoop: (loopData: LoopData) => void;

  undo: () => void;
  redo: () => void;

  reset: () => void;

  // computed
  nodes: () => GUINodeData[];
  edges: () => GUIEdgeData[];
  loop: () => LoopData;
  // nodeRecords,
  streamNodes: () => string[];
  resultNodes: () => string[];

  undoable: () => boolean;
  redoable: () => boolean;
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

  loop: () => {
    return get().currentData.loop;
  },

  streamNodes: () => {
    const nodes = get().currentData.nodes;
    return nodes
      .filter((node) => {
        return node.data?.params?.stream ?? false;
      })
      .map((node) => node.nodeId);
  },

  resultNodes: () => {
    const nodes = get().currentData.nodes;
    return nodes
      .filter((node) => {
        return node.data?.params?.isResult ?? false;
      })
      .map((node) => node.nodeId);
  },

  reset: () =>
    set((state) => ({
      ...state,
      currentData: { nodes: [], edges: [], loop: { loopType: "none" } },
      histories: [],
      index: 0,
    })),

  loadData: (data: HistoryPayload) => {
    set((state) => {
      state.pushDataToHistory("load", data);
      return { currentData: data };
    });
  },

  initData: (nodeData: GUINodeData[], edgeData: GUIEdgeData[], loopData: LoopData) =>
    set(() => ({
      currentData: { nodes: nodeData, edges: edgeData, loop: loopData },
    })),

  pushNode: (nodeData: GUINodeData) => {
    const { updateData, currentData } = get();
    updateData([...currentData.nodes, nodeData], [...currentData.edges], "addNode", true);
  },

  updateNodePosition: (positionIndex: number, pos: { x: number; y: number; width: number; height: number }) => {
    set((state) => {
      const newNodes = [...state.currentData.nodes];

      newNodes[positionIndex] = {
        ...newNodes[positionIndex],
        position: { ...newNodes[positionIndex].position, ...pos },
      };

      return { currentData: { ...state.currentData, nodes: newNodes } };
    });
  },

  updateNodeParam: (positionIndex: number, key: string, value: unknown) => {
    const { updateData, currentData } = get();
    const oldNode = currentData.nodes[positionIndex];
    const newNode = {
      ...oldNode,
      data: {
        ...oldNode.data,
        params: oldNode.data.params ? { ...oldNode.data.params } : {},
      },
    };

    if (value === "" || value === undefined || (value === null && newNode.data.params && newNode.data.params[key] !== undefined)) {
      // delete operation
      const { [key]: __, ...updatedParams } = newNode.data.params || {};
      newNode.data.params = updatedParams;
    } else {
      // upsert
      newNode.data.params = { ...(newNode.data.params || {}), [key]: value };
    }
    const newNodes = [...currentData.nodes];
    newNodes[positionIndex] = newNode;
    updateData(newNodes, [...currentData.edges], "updateParams", true);
  },

  updateStaticNodeValue: (nodeIndex: number, value: UpdateStaticValue, saveHistory: boolean) => {
    const { updateData, currentData } = get();
    const newNode = { ...currentData.nodes[nodeIndex] };
    newNode.data = { ...newNode.data, ...value };
    const newNodes = [...currentData.nodes];
    newNodes[nodeIndex] = newNode;
    updateData(newNodes, [...currentData.edges], "updateStaticValue", saveHistory);
  },

  updateData: (nodeData: GUINodeData[], edgeData: GUIEdgeData[], name: string, saveHistory: boolean) =>
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
      const newHistories = [...state.histories.slice(0, state.index), { data, name }];
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

  updateLoop: (loopData: LoopData) => {
    const { currentData, pushDataToHistory } = get();
    const data = {
      nodes: currentData.nodes,
      edges: currentData.edges,
      loop: loopData,
    };
    pushDataToHistory("loopUpdate", data);
    set({ currentData: data });
  },

  pushEdge: (edgeData: GUIEdgeData) => {
    const { currentData, updateData } = get();
    updateData([...currentData.nodes], [...currentData.edges, edgeData], "addEdge", true);
  },
  deleteEdge: (edgeIndex: number) => {
    const { currentData, updateData } = get();
    updateData([...currentData.nodes], [...currentData.edges.filter((__, idx) => idx !== edgeIndex)], "deleteEdge", true);
  },
  deleteNode: (nodeIndex: number) => {
    const { currentData, updateData } = get();
    console.log(currentData.nodes, nodeIndex);
    const node = currentData.nodes[nodeIndex];
    updateData(
      [...currentData.nodes.filter((__, idx) => idx !== nodeIndex)],
      [
        ...currentData.edges.filter((edge) => {
          const { source, target } = edge;
          return source.nodeId !== node.nodeId && target.nodeId !== node.nodeId;
        }),
      ],
      "deleteNode",
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
      set(() => ({
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
      set(() => ({
        currentData: histories[index].data,
        index: index + 1,
      }));
    }
  },
}));

export const node2Record = (nodes: GUINodeData[]): GUINodeDataRecord => {
  return nodes.reduce((tmp: GUINodeDataRecord, current) => {
    tmp[current.nodeId] = current;
    return tmp;
  }, {});
};

const loop2LoopObj = (loop: LoopData) => {
  if (loop.loopType === "while") {
    return {
      while: loop.while,
    };
  }
  if (loop.loopType === "count") {
    return {
      count: loop.count,
    };
  }
  return {};
};

export const toGraph = (nodeRecords: GUINodeDataRecord, edges: GUIEdgeData[], loop: LoopData, currentData: HistoryPayload) => {
  const edgeObject = edges2inputs(edges ?? [], nodeRecords);
  const loopObject = loop2LoopObj(loop);

  return store2graphData(nodeRecords, edgeObject, loopObject, currentData);
};
