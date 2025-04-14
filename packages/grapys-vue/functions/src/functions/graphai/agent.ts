import { openAIAgent } from "@graphai/openai_agent";
import * as admin from "firebase-admin";

import { CallableRequest, CallableResponse, HttpsError } from "firebase-functions/v2/https";
import type { AgentFunctionContext, AgentFunctionInfoDictionary } from "graphai";

import { StreamChunkCallback, runAgentOnCall } from "@receptron/graphai_firebase_functions";

const agentDictionary: AgentFunctionInfoDictionary = {
  openAIAgent,
};
const db = admin.firestore();

const restrictedModel = "gpt-4o-mini";

export const agentRunner = async (request: CallableRequest, response?: CallableResponse) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  // check privileges
  const userData = await db.doc(`/users/${uid}/secret/llm`).get();

  if (!userData.exists) {
    console.log("invalid operation " + uid);
    throw new HttpsError("permission-denied", "permission denied");
  }

  const { agentId, params } = request.data ?? {};
  if (agentId === "openAIAgent") {
    const newParams = { ...(params ?? {}), model: restrictedModel };
    request.data = { ...(request.data ?? {}), params: newParams };
  }
  // console.log(request.data);

  const streamCallback: StreamChunkCallback = (context: AgentFunctionContext, token: string) => {
    response?.sendChunk({
      delta: token,
      type: "agent",
      nodeId: context.debugInfo.nodeId,
      agentId: context.debugInfo.agentId,
    });
  };

  return await runAgentOnCall(request, agentDictionary, { streamCallback });
};
