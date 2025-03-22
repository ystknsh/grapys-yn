import React, { useState, useEffect, useCallback, useRef } from "react";
import { GraphAI, GraphData } from "graphai";
import * as agents from "@graphai/vanilla";
import { openAIAgent } from "@graphai/openai_agent";
import { geminiAgent } from "@graphai/gemini_agent";
import { anthropicAgent } from "@graphai/anthropic_agent";
import { browserlessAgent } from "@graphai/browserless_agent";

import tinyswallowAgent, { modelLoad, loadEngine, CallbackReport } from "../agents/tinyswallow";
import { useTextInputEvent } from "../agents/event_react";
import { useLocalStore } from "../store";
import { useStreamData } from "../utils/react-plugin/stream";
import { useChatPlugin } from "../utils/react-plugin/chat";

import { graphConfigs } from "../graph";
import { GUIMessage } from "../utils/gui/type";

const GraphRunner: React.FC<{ graphData: GraphData }> = ({ graphData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const streamNodes = useLocalStore((state) => state.streamNodes);
  const resultNodes = useLocalStore((state) => state.resultNodes);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // チャットUIの開閉状態を管理
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamData]);

  const [graphai, setGraphai] = useState<GraphAI | null>(null);
  const run = useCallback(async () => {
    setIsRunning(true);
    // チャットを開始したら自動的にUIを開く
    setIsChatOpen(true);
    const graph = new GraphAI(
      graphData,
      {
        ...agents,
        openAIAgent,
        anthropicAgent,
        geminiAgent,
        eventAgent,
        tinyswallowAgent,
        browserlessAgent,
      },
      {
        agentFilters,
        config: graphConfigs,
      },
    );
    graph.registerCallback(streamPlugin(streamNodes()));
    graph.registerCallback(chatMessagePlugin(resultNodes()));
    setGraphai(graph);
    try {
      await graph.run();
      setIsRunning(false);
    } catch (error) {
      console.log(error);
    }
  }, [eventAgent, streamPlugin, chatMessagePlugin, graphData, streamNodes]);

  const abort = useCallback(() => {
    try {
      if (isRunning && graphai) {
        graphai.abort();
        setGraphai(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRunning(false);
    }
  }, [graphai, isRunning]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && events.length > 0) {
      submitText(events[0]);
    }
  };

  const renderChatMessages = () => {
    const streamNodeIds = streamNodes();
    return (
      <>
        {messages.map((m: GUIMessage, k: number) => (
          <div key={k} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {m.role === "user" ? "あなた" : `AI (${m.nodeId})`}
              </div>
              <div className="whitespace-pre-wrap break-words">{m.content}</div>
            </div>
          </div>
        ))}
        {streamNodeIds.map((nodeId, k) => (
          <div key={`stream-${k}`} className="text-left mb-4">
            {isStreaming[nodeId] && (
              <div className="inline-block max-w-[80%] rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
                <div className="text-sm font-semibold mb-1">AI ({nodeId})</div>
                <div className="whitespace-pre-wrap break-words">{streamData[nodeId]}</div>
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="pointer-events-none">
      <div 
        className={`w-[400px] flex flex-col transition-all duration-300 ease-in-out pointer-events-auto`}
      >
        {/* Chat header */}
        <div 
          className="flex items-center justify-between bg-gray-100 p-3 border border-gray-300 rounded-t-lg cursor-pointer"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <div className="font-bold flex items-center">
            <span>チャット</span>
            {messages.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          <div className="flex space-x-2 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                run();
              }}
              className={`px-3 py-1 rounded-md font-medium text-white ${
                isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={isRunning}
            >
              {ready ? "開始" : "読み込み中..."}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                abort();
              }}
              className={`px-3 py-1 rounded-md font-medium text-white ${
                !isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={!isRunning}
            >
              停止
            </button>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isChatOpen ? "rotate-180" : ""}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* チャットコンテンツ */}
        <div 
          className={`bg-white border border-gray-300 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isChatOpen ? "max-h-[calc(100vh-100px)]" : "max-h-0"
          }`}
        >
          <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Chat messages container */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {!ready && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="animate-pulse mb-2">モデルを読み込み中...</div>
                  <div className="text-sm">{loading}</div>
                </div>
              )}
              {ready && messages.length === 0 && !isRunning && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="mb-2 text-lg">チャットの準備ができました</div>
                    <div className="text-sm">「開始」ボタンをクリックして会話を始めてください</div>
                  </div>
                </div>
              )}
              {renderChatMessages()}
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-300 p-3 bg-gray-50">
              <div className="flex items-center">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={events.length > 0 ? "メッセージを入力..." : "チャットを開始してください"}
                  className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={events.length === 0}
                />
                <button
                  className={`rounded-r-lg px-4 py-3 font-medium text-white ${
                    events.length === 0 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={() => {
                    if (events.length > 0) {
                      submitText(events[0]);
                    }
                  }}
                  disabled={events.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphRunner;
