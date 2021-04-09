import { exec } from "@actions/exec";
import { parse } from "dotenv";
import { readFileSync } from "fs";
import * as path from "path";

function getRecordKey(): string {
  const { CYPRESS_RECORD_KEY } = process.env;

  if (CYPRESS_RECORD_KEY) {
    return CYPRESS_RECORD_KEY;
  }

  const dotEnvFilePath = path.join(__dirname, "..", ".env");

  try {
    const dotEnvFileContent = readFileSync(dotEnvFilePath, "utf8");
    const { NCD_SECRET } = parse(dotEnvFileContent);

    if (NCD_SECRET) {
      return NCD_SECRET;
    }
  } catch {}

  return "";
}

async function main() {
  const recordKey = getRecordKey();
  const [id = "id1"] = process.argv.slice(2);

  await exec(
    "cypress",
    [
      "run",
      "--record",
      "--parallel",
      "--ci-build-id",
      id,
      "--config",
      "video=false",
    ],
    {
      env: {
        ...process.env,
        CYPRESS_RECORD_KEY: recordKey,
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
