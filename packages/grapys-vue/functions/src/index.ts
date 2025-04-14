import * as admin from "firebase-admin";
import exportIfNeeded from "./common/exportifneeded";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
admin.initializeApp();

exportIfNeeded("agent", "graphai/agent", exports);
