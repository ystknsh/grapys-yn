import { resultsOf } from "../packages/grapys-vue/src/utils/gui/result";

import test from "node:test";
import assert from "node:assert";

test("test result", async () => {
  const inputSchema = { array: [":message1", ":message2", ":message3", ":message4"] };
  const inputs = {
    message3: ":another3.inputs",
    message4: ":another4.text",
  };

  const result = resultsOf(inputSchema, inputs);
  assert.deepStrictEqual(result, { array: [ ':another3.inputs', ':another4.text' ] });

});
