import { onCall } from "firebase-functions/v2/https";

import { agentRunner } from "../../functions/graphai/agent";
import { enforceAppCheck, secretKeys } from "../firebase";

export default onCall(
  {
    region: "asia-northeast1",
    timeoutSeconds: 90,
    enforceAppCheck,
    secrets: secretKeys,
  },
  async (request, response) => {
    return await agentRunner(request, response);
  },
);
