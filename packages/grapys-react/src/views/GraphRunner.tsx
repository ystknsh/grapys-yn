import React, { useState, useEffect, useCallback } from "react";
import { GraphAI, GraphData } from "graphai";
import * as agents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";
// import { geminiAgent } from "@graphai/gemini_agent";
import  geminiAgent from "../agents/gemini_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import tinyswallowAgent, { modelLoad, loadEngine, CallbackReport } from "../agents/tinyswallow";
import { useTextInputEvent } from "../agents/event_react";
import Chat from "./Chat";
import { useLocalStore } from "../store";
import { useStreamData } from "../utils/react-plugin/stream";
import { useChatPlugin } from "../utils/react-plugin/chat";

import { graphConfigs } from "../graph";

const GraphRunner: React.FC<{ graphData: GraphData }> = ({ graphData }) => {
  const streamNodes = useLocalStore((state) => state.streamNodes);
  const resultNodes = useLocalStore((state) => state.resultNodes);

  useEffect(() => {
    loadEngine();
  }, []);

  const { eventAgent, userInput, setUserInput, events, submitText } = useTextInputEvent();
  const { messages, chatMessagePlugin } = useChatPlugin();
  const { streamData, streamAgentFilter, streamPlugin, isStreaming } = useStreamData();

  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilter,
    },
  ];

  const [loading, setLoading] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    modelLoad((report: CallbackReport) => {
      if (report.progress === 1) {
        setReady(true);
      }
      setLoading(report.text);
      console.log(report.text);
    });
  }, []);

  const run = useCallback(async () => {
    console.log(graphConfigs);
    const graphai = new GraphAI(
      graphData,
      {
        ...agents,
        openAIAgent,
        anthropicAgent,
        geminiAgent,
        eventAgent,
        tinyswallowAgent,
      },
      {
        agentFilters,
        config: graphConfigs,
      },
    );
    graphai.registerCallback(streamPlugin(streamNodes()));
    graphai.registerCallback(chatMessagePlugin(resultNodes()));

    await graphai.run();
  }, [eventAgent, streamPlugin, chatMessagePlugin]);

  return (
    <div>
      <div className="items-center justify-center">
        <div className="mt-2">
          <Chat messages={messages} isStreaming={isStreaming} streamData={streamData} streamNodeIds={streamNodes()} />
        </div>
        <div className="mt-2">
          <button onClick={run} className="m-1 items-center rounded-full bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-700">
            Run
          </button>
        </div>

        <div>
          <div className="m-auto my-4 w-10/12">
            {events.length > 0 && <div className="hidden font-bold text-red-600">Write message to bot!!</div>}
            <div className="flex">
              <input
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                className="flex-1 rounded-md border-2 p-2"
                disabled={events.length === 0}
              />
              <button
                className={`ml-1 flex-none items-center rounded-md px-4 py-2 font-bold text-white hover:bg-sky-700 ${
                  events.length === 0 ? "bg-sky-200" : "bg-sky-500"
                }`}
                onClick={() => {
                  if (events.length > 0) {
                    submitText(events[0]);
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {!ready ? <div>Loading web llm model</div> : <div>Ready!</div>}
        <div>{loading}</div>
      </div>
    </div>
  );
};

export default GraphRunner;
