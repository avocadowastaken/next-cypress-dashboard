"use strict";

const fs = require("fs");
const path = require("path");
const execa = require("execa");

const ACTIONS_DIR = path.join(__dirname, "..", "actions");

for (const action of fs.readdirSync(ACTIONS_DIR)) {
  console.log("Building: %s", action);
  execa.sync("npx", ["rapidbundle"], {
    stdio: "inherit",
    cwd: path.join(ACTIONS_DIR, action),
  });
}
