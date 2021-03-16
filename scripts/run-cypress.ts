import { exec } from "@actions/exec";

async function main() {
  await exec(
    "cypress",
    ["run", "--record", "--parallel", "--ci-build-id", "id2"],
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
