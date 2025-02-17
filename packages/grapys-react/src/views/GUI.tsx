import { FC, useEffect } from 'react';
// import { useRef, useState } from 'react';
import { useLocalStore } from '../store/index';

import { EdgeData, NodePosition, UpdateStaticValue } from "../utils/gui/type";

import { graphChat } from "../graph/chat_tinyswallow";

import { graphToGUIData, guiEdgeData2edgeData } from "../utils/gui/utils";
import { GraphData } from "graphai";

const GUI: FC = () => {
  const nodes = useLocalStore((state) => state.currentData.nodes);
  const initData = useLocalStore((state) => state.initData);

  const updateGraph = (graph: GraphData) => {

    const { rawEdge, rawNode, loop } = graphToGUIData(graph);
    initData(rawEdge, rawNode, loop);
  };
  useEffect(() => {
    updateGraph(graphChat);
  }, []);
  
  return (
  <div>
    <div className="flex h-screen">
      <aside className="w-48 p-4">
        <h2 className="text-lg font-bold">Menu</h2>

      </aside>
      <main className="flex-1">
      <div className="relative h-[100vh] overflow-hidden rounded-md border-4"></div>
      <pre>{JSON.stringify(nodes, null, 2)}</pre>
      </main>
    </div>
   </div>);

};

export default GUI;
