import type { AgentFilterFunction, ResultData } from "graphai";

import { firebaseApp } from "../utils/firebase/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getFirebaseOnCallFilter = (region: string, functionName: string) => {
  const functions = getFunctions(firebaseApp, region);
  const streamingFcuntion = httpsCallable(functions, functionName);

  const firebaseOnCallFilter: AgentFilterFunction = async (context, next) => {
    const { params, debugInfo, filterParams, namedInputs, config } = context;

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
        context.filterParams.streamTokenCallback((chunk as {delta: string})["delta"]);
      }
    }
    const allData = await data;
    console.log(allData);
    return allData as ResultData;
  };
  return {
    firebaseOnCallFilter,
  };
};
