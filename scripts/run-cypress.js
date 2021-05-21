"use strict";

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const execa = require("execa");

let { CYPRESS_RECORD_KEY } = process.env;

if (!CYPRESS_RECORD_KEY) {
  const dotEnvFilePath = path.join(__dirname, "..", ".env");

  if (fs.existsSync(dotEnvFilePath)) {
    try {
      const dotEnvFileContent = fs.readFileSync(dotEnvFilePath, "utf8");
      const { NCD_SECRET } = dotenv.parse(dotEnvFileContent);

      if (NCD_SECRET) {
        CYPRESS_RECORD_KEY = NCD_SECRET;
      }
    } catch {}
  }
}

const [id = "id1"] = process.argv.slice(2);

execa.sync(
  "npx",
  [
    "cypress",
    "run",
    "--record",
    "--parallel",
    "--ci-build-id",
    id,
    "--config",
    "video=false",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CYPRESS_RECORD_KEY,
      DEBUG: "cypress:server:record,cypress:server:api",
    },
  }
);
