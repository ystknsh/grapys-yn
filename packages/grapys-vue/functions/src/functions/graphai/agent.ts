import { CallableRequest, CallableResponse } from "firebase-functions/v2/https";

export const sleep = async (milliseconds: number) => {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const agentRunner = async (request: CallableRequest, response?: CallableResponse) => {

  const uid = request.auth?.uid;

  if (!uid) {
    throw new Error("Authentication required");
  }
  
  const {
    agentId,
    params,
    debugInfo,
    filterParams,
    namedInputs,
  } = request.data ?? {};
  
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
};
