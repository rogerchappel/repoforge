import assert from "node:assert/strict";
import test from "node:test";

import { createMessage } from "../src/index.js";

test("createMessage returns a greeting", () => {
  assert.equal(createMessage("agent"), "hello agent");
});
