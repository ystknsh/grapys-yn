import { onCall } from "firebase-functions/v2/https";

import { agentRunner } from "../../functions/graphai/agent";

export default onCall(
  {
    region: "asia-northeast1",
    timeoutSeconds: 90,
  },
  async (request, response) => {
    return await agentRunner(request, response);
});
