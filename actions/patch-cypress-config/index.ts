import { getInput, setFailed } from "@actions/core";
import { patchCypressConfig } from "../../scripts/patch-cypress-config";

async function main(): Promise<void> {
  await patchCypressConfig({
    api_url: getInput("api_url", { required: true }),
  });
}

main().catch(setFailed);
