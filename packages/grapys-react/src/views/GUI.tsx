import { FC, useEffect } from 'react';
// import { useRef, useState } from 'react';
import { useLocalStore } from '../store/index';

import { EdgeData, NodePosition, UpdateStaticValue } from "../utils/gui/type";

import { graphChat } from "../graph/chat_tinyswallow";

import { graphToGUIData, guiEdgeData2edgeData } from "../utils/gui/utils";
import { GraphData } from "graphai";

import Node from "./Node";

const GUI: FC = () => {
  const nodes = useLocalStore((state) => state.currentData.nodes);
  const initData = useLocalStore((state) => state.initData);
  const updateNodePosition = useLocalStore((state) => state.updateNodePosition);
  const saveNodePosition = useLocalStore((state) => state.saveNodePositionData);

  const updateGraph = (graph: GraphData) => {

    const { rawEdge, rawNode, loop } = graphToGUIData(graph);
    initData(rawNode, rawEdge, loop);
  };
  useEffect(() => {
    updateGraph(graphChat);
  }, []);

  
  return (
  <div>
    <div className="flex h-screen w-full">
      <aside className="w-48 p-4">
        <h2 className="text-lg font-bold">Menu</h2>
      
      </aside>
      <main className="flex-1">
      <div className="relative h-[100vh] overflow-hidden rounded-md border-4">
      <svg x="0" y="0" className="pointer-events-none absolute h-[100%] w-full">
      </svg>
      {nodes.map((node, index) => (
        <Node
        key={`${node.nodeId}-${index}`}
        nodeIndex={index}
        nodeData={node}

        onUpdatePosition={(pos) => updateNodePosition(index, pos)}
        onSavePosition={saveNodePosition}
        
          />

      ))}
      </div>
      <pre>{JSON.stringify(nodes, null, 2)}</pre>
      </main>
    </div>
   </div>);

};

export default GUI;
