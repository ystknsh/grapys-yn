import { openAIAgent } from "@graphai/openai_agent";
import { streamAgentFilterGenerator, agentFilterRunnerBuilder } from "@graphai/agent_filters";

import { CallableRequest, CallableResponse, HttpsError } from "firebase-functions/v2/https";
import type { AgentFunctionContext, AgentFunctionInfoDictionary } from "graphai";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const agentDictionary: AgentFunctionInfoDictionary = {
  openAIAgent,
};

export const agentRunner = async (request: CallableRequest, response?: CallableResponse) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { agentId, params, debugInfo, filterParams, namedInputs } = request.data ?? {};

  const agent = agentDictionary[agentId];
  if (agent === undefined) {
    throw new HttpsError("not-found", "No Agent Found");
  }

  const context = {
    params: params ?? {},
    namedInputs,
    debugInfo,
    agents: agentDictionary,
    filterParams,
  };

  // const { agents: __nonLog, ...logContext } = context;
  // console.log("agentDispatcherInternal(context): ", logContext);

  const callback = (context: AgentFunctionContext, token: string) => {
    if (token) {
      response?.sendChunk({
        delta: token,
        type: "agent",
        nodeId: context.debugInfo.nodeId,
        agentId: context.debugInfo.agentId,
      });
    }
  };
  const streamAgentFilter = {
    name: "streamAgentFilter",
    agent: streamAgentFilterGenerator<string>(callback),
  };
  const agentFilters = [streamAgentFilter];

  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner(context, agent.agent);
  return result;

  /*
  for await (const num of ["1", "2", "3", "4", "5"]) {
    response?.sendChunk({ delta: num });
    await sleep(1000);
  }
  
  return {
    text: "12334",
    agentId,
    params,
    debugInfo,
    filterParams,
    namedInputs,
    
  };
  */
};
