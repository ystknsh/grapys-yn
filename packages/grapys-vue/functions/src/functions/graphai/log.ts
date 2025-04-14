import { CallableRequest } from "firebase-functions/v2/https";
import { log } from "firebase-functions/logger";


export const operationLog = (context: CallableRequest, operationType: string, params: Record<string, string>) => {
  const uid = context.auth?.uid;
  // const operationType = params.operationType || "-----";

  
  const header: Record<string, string> = {};
  for (let i = 0; i < context.rawRequest.rawHeaders.length; i += 2) {
    header[context.rawRequest.rawHeaders[i]] = context.rawRequest.rawHeaders[i + 1];
  }
  // console.log(context);
  // console.log( JSON.stringify(header));
  const referer = header["referer"];
  const userAgent = header["user-agent"];
  const secUa = header["sec-ch-ua"];
  const platform = header["sec-ch-ua-platform"];
  const ip = header["x-forwarded-for"];

  // path, restautantId, time, method, options
  const logData = {
    logType: "operationLog", // ok
    operationType, // ok
    referer,
    userAgent,
    secUa,
    platform,
    ip,
    uid,
    params,
  };
  const message = [operationType, uid].join(":");
  log(message, logData);
};

