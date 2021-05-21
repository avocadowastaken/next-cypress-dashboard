"use strict";

const path = require("path");
const execa = require("execa");

const ROOT_DIR = path.join(__dirname, "..");
const PATCH_CYPRESS_CONFIG_SCRIPT = path.join(
  ROOT_DIR,
  "actions",
  "patch-cypress-config",
  "dist",
  "index.js"
);

const [INPUT_API_URL = ""] = process.argv.slice(2);

execa.sync("node", [PATCH_CYPRESS_CONFIG_SCRIPT], {
  cwd: ROOT_DIR,
  stdio: "inherit",
  env: { ...process.env, INPUT_API_URL },
});
