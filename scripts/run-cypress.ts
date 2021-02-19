import { exec } from "@actions/exec";
import * as path from "path";

async function main() {
  await exec("ts-node", [path.join(__dirname, "patch-cypress-config.ts")]);

  await exec(
    "cypress",
    ["run", "--record", "--parallel", "--ci-build-id", `ci-build-id-2`],
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
