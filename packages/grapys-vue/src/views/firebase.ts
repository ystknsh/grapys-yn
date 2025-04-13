import type { AgentFilterFunction, ResultData } from "graphai";

import { getFunctions, httpsCallable } from "firebase/functions";
import type { FirebaseApp } from "firebase/app";

export const getFirebaseOnCallFilter = (firebaseApp: FirebaseApp, region: string, functionName: string) => {
  const functions = getFunctions(firebaseApp, region);
  const streamingFcuntion = httpsCallable(functions, functionName);

  const firebaseOnCallFilter: AgentFilterFunction = async (context, __next) => {
    const { params, debugInfo, filterParams, namedInputs } = context;

    const agentId = debugInfo.agentId;

    const postData = {
      agentId,
      params,
      debugInfo,
      filterParams,
      namedInputs,
    };

    const { stream, data } = await streamingFcuntion.stream(postData);

    for await (const chunk of stream) {
      if (filterParams.streamTokenCallback) {
        context.filterParams.streamTokenCallback((chunk as {delta: string}).delta);
      }
    }
    const allData = await data;
    return allData as ResultData;
  };
  return {
    firebaseOnCallFilter,
  };
};
