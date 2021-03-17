import { exec } from "@actions/exec";

async function main() {
  const [id = "id1"] = process.argv.slice(2);

  await exec(
    "cypress",
    ["run", "--record", "--parallel", "--ci-build-id", id],
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
