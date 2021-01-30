import fetch from "node-fetch";

if (!process.env.DEPLOY_TARGET_URL) {
  process.env.DEPLOY_TARGET_URL = "http://localhost:3000";
}

Object.assign(globalThis, { fetch });
