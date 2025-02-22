import { FC, useEffect, useMemo, useRef } from "react";

import Node from "./Node";
import Edge from "./Edge";
import Loop from "./Loop";

import AddNode from "./AddNode";
import ContextEdgeMenu from "./ContextEdgeMenu";
import ContextNodeMenu from "./ContextNodeMenu";

import GraphRunner from "./GraphRunner";
import TemplateGraph from "./TemplateGraph";

// import { EdgeData, NodePosition, UpdateStaticValue } from "../utils/gui/type";

import { graphChat } from "../graph/chat_tinyswallow";

import { useNewEdge } from "../composable/gui";
import { graphToGUIData, guiEdgeData2edgeData } from "../utils/gui/utils";
import { GraphData, sleep } from "graphai";
import { useLocalStore, node2Record, toGraph } from "../store/index";

const GUI: FC = () => {
  const nodes = useLocalStore((state) => state.nodes());
  const edges = useLocalStore((state) => state.edges());
  const loop = useLocalStore((state) => state.loop());
  const currentData = useLocalStore((state) => state.currentData);
  const nodeRecords = useMemo(() => node2Record(nodes), [nodes]);
  const edgeDataList = useMemo(() => guiEdgeData2edgeData(edges, nodeRecords), [edges, nodeRecords]);

  const undo = useLocalStore((state) => state.undo);
  const redo = useLocalStore((state) => state.redo);
  const undoable = useLocalStore((state) => state.undoable());
  const redoable = useLocalStore((state) => state.redoable());

  const loadData = useLocalStore((state) => state.loadData);

  const contextNodeMenuRef = useRef<{ openMenu: (event: MouseEvent, rect: DOMRect, nodeIndex: number) => void; closeMenu: () => void } | null>(null);
  const contextEdgeMenuRef = useRef<{ openMenu: (event: MouseEvent, rect: DOMRect, edgeIndex: number) => void; closeMenu: () => void } | null>(null);

  const resetGraph = useLocalStore((state) => state.reset);
  const newGraphData = toGraph(nodeRecords, edges, loop, currentData);

  const initData = useLocalStore((state) => state.initData);
  const updateNodePosition = useLocalStore((state) => state.updateNodePosition);
  const onSavePosition = useLocalStore((state) => state.saveNodePositionData);

  const updateGraph = (graph: GraphData) => {
    const { rawEdge, rawNode, loop } = graphToGUIData(graph);
    initData(rawNode, rawEdge, loop);
  };
  useEffect(() => {
    (async () => {
      updateGraph(graphChat);
      await sleep(1);
      onSavePosition();
    })();
  }, []);

  const { svgRef, newEdgeData, onNewEdgeStart, onNewEdge, onNewEdgeEnd, nearestData, edgeConnectable } = useNewEdge();

  const openEdgeMenu = (event: React.MouseEvent, edgeIndex: number) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      contextEdgeMenuRef.current?.openMenu(event.nativeEvent, rect, edgeIndex);
    }
  };

  const closeMenu = () => {
    contextNodeMenuRef.current?.closeMenu();
    contextEdgeMenuRef.current?.closeMenu();
  };

  const openNodeMenu = (event: React.MouseEvent, nodeIndex: number) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      contextNodeMenuRef.current?.openMenu(event.nativeEvent, rect, nodeIndex);
    }
  };

  const save = () => {
    const dataStr = JSON.stringify(newGraphData);
    window.localStorage.setItem("GRAPHAIGUI", dataStr);
  };

  const load = () => {
    const data = window.localStorage.getItem("GRAPHAIGUI");
    try {
      if (data) {
        const graphData = JSON.parse(data);
        loadData(graphData.metadata.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setGraph = async (graph: GraphData) => {
    resetGraph();
    await sleep(1);
    updateGraph(graph);
    await sleep(1);
    onSavePosition();
  };

  return (
    <div>
      <div className="flex h-screen w-full">
        <aside className="w-48 p-4">
          <h2 className="text-lg font-bold">Menu</h2>
          <AddNode />
          <hr />
          <button
            onClick={undo}
            className={`m-1 items-center rounded-full px-4 py-2 font-bold text-white ${undoable ? "bg-sky-500 hover:bg-sky-700" : "bg-sky-200"}`}
          >
            Undo
          </button>
          <button
            onClick={redo}
            className={`m-1 items-center rounded-full px-4 py-2 font-bold text-white ${redoable ? "bg-sky-500 hover:bg-sky-700" : "bg-sky-200"}`}
          >
            Redo
          </button>
          <hr />
          <div>
            <button onClick={resetGraph} className="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
              Clear Graph
            </button>
          </div>
          <hr />
          <div>
            <button onClick={save} className="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
              Save Graph
            </button>
          </div>
          <div>
            <button onClick={load} className="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white">
              Load Graph
            </button>
          </div>
          <hr />
          <TemplateGraph onSetGraph={setGraph} />
        </aside>
        <main className="flex-1">
          <div className="relative h-[100vh] overflow-hidden rounded-md border-4" onClick={closeMenu}>
            <Loop />
            <svg x="0" y="0" className="absolute h-[100%] w-full" ref={svgRef}>
              {edgeDataList.map((edge, index) => (
                <Edge
                  key={`edge-${edge.source}-${edge.target}-${index}`}
                  sourceData={edge.source}
                  targetData={edge.target}
                  index={index}
                  openEdgeMenu={openEdgeMenu}
                />
              ))}
              {newEdgeData && <Edge sourceData={newEdgeData.source} targetData={newEdgeData.target} isConnectable={edgeConnectable} />}{" "}
            </svg>
            {nodes.map((node, index) => (
              <Node
                key={`${node.nodeId}-${index}`}
                nodeIndex={index}
                nodeData={node}
                nearestData={nearestData}
                onUpdatePosition={(pos) => updateNodePosition(index, pos)}
                onSavePosition={onSavePosition}
                onNewEdgeStart={onNewEdgeStart}
                onNewEdge={onNewEdge}
                onNewEdgeEnd={onNewEdgeEnd}
                onOpenNodeMenu={(e) => openNodeMenu(e, index)}
              />
            ))}
            <ContextNodeMenu ref={contextNodeMenuRef} />
            <ContextEdgeMenu ref={contextEdgeMenuRef} />
          </div>
        </main>
      </div>
      <div>
        <GraphRunner graphData={newGraphData} />
      </div>
      {JSON.stringify(newGraphData, null, 2)}
    </div>
  );
};

export default GUI;
