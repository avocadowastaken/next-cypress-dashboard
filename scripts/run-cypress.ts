import { exec } from "@actions/exec";
import { patchCypressConfig } from "./patch-cypress-config";

async function main() {
  await patchCypressConfig({ api_url: "http://localhost:3000/" });

  await exec(
    "cypress",
    [
      "run",
      "--record",
      "--parallel",
      "--ci-build-id",
      `ci-build-id-${new Date().toISOString().slice(0, 10)}`,
    ],
    {
      env: {
        ...process.env,
        CYPRESS_RECORD_KEY: "123",
        DEBUG: "cypress:server:record,cypress:server:api",
      },
    }
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
