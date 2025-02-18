import { FC, useEffect, useMemo, componentDidMount } from "react";

import Node from "./Node";
import Edge from "./Edge";
//import Loop from "./Loop.vue";

import AddNode from "./AddNode";
// import ContextEdgeMenu from "./ContextEdgeMenu.vue";
//import ContextNodeMenu from "./ContextNodeMenu.vue";

// import GraphRunner from "./GraphRunner.vue";
// import TemplateGraph from "./TemplateGraph.vue";

import { EdgeData, NodePosition, UpdateStaticValue } from "../utils/gui/type";

import { graphChat } from "../graph/chat_tinyswallow";

import { useNewEdge } from "../composable/gui";
import { graphToGUIData, guiEdgeData2edgeData } from "../utils/gui/utils";
import { GraphData } from "graphai";
import { useLocalStore, node2Record } from "../store/index";

const GUI: FC = () => {
  const nodes = useLocalStore((state) => state.nodes());
  const edges = useLocalStore((state) => state.edges());
  const nodeRecords = useMemo(() => node2Record(nodes), [nodes]);
  const edgeDataList = useMemo(
    () => guiEdgeData2edgeData(edges, nodeRecords),
    [edges, nodeRecords],
  );

  const undo = useLocalStore((state) => state.undo);
  const redo = useLocalStore((state) => state.redo);
  const undoable = useLocalStore((state) => state.undoable());
  const redoable = useLocalStore((state) => state.redoable());

  const resetGraph = useLocalStore((state) => state.reset);

  const initData = useLocalStore((state) => state.initData);
  const updateNodePosition = useLocalStore((state) => state.updateNodePosition);
  const saveNodePosition = useLocalStore((state) => state.saveNodePositionData);

  const updateGraph = (graph: GraphData) => {
    const { rawEdge, rawNode, loop } = graphToGUIData(graph);
    initData(rawNode, rawEdge, loop);
  };
  useEffect(() => {
    updateGraph(graphChat);
    saveNodePosition();
  }, []);

  const {
    svgRef,
    newEdgeData,
    newEdgeStartEvent,
    newEdgeEvent,
    newEdgeEndEvent,
    nearestData,
    edgeConnectable,
  } = useNewEdge();

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
            <button
              onClick={resetGraph}
              className="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white"
            >
              Clear Graph
            </button>
          </div>
          <hr />
        </aside>
        <main className="flex-1">
          <div className="relative h-[100vh] overflow-hidden rounded-md border-4">
            <svg
              x="0"
              y="0"
              className="pointer-events-none absolute h-[100%] w-full"
              ref={svgRef}
            >
              {edgeDataList.map((edge, index) => (
                <Edge
                  key={`edge-${edge.source}-${edge.target}-${index}`}
                  sourceData={edge.source}
                  targetData={edge.target}
                  className="pointer-events-auto"
                  onDoubleClick={(e) => openEdgeMenu(e, index)}
                />
              ))}
              {newEdgeData && (
                <Edge
                  sourceData={newEdgeData.source}
                  targetData={newEdgeData.target}
                  className="pointer-events-auto"
                  isConnectable={edgeConnectable}
                />
              )}{" "}
            </svg>
            {nodes.map((node, index) => (
              <Node
                key={`${node.nodeId}-${index}`}
                nodeIndex={index}
                nodeData={node}
                nearestData={nearestData}
                onUpdatePosition={(pos) => updateNodePosition(index, pos)}
                onSavePosition={saveNodePosition}
                onNewEdgeStart={newEdgeStartEvent}
                onNewEdge={newEdgeEvent}
                onNewEdgeEnd={newEdgeEndEvent}
              />
            ))}
          </div>
          <pre>{JSON.stringify(nodes, null, 2)}</pre>
        </main>
      </div>
    </div>
  );
};

export default GUI;
