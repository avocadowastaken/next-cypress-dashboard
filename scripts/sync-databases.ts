import { spawnSync } from "child_process";
import { parse } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { join as joinPath } from "path";

const ROOT_DIR = joinPath(__dirname, "..");
const LOCAL_ENV = joinPath(ROOT_DIR, ".env.local");
const PRISMA_ENV = joinPath(ROOT_DIR, "prisma", ".env");

function getDatabaseURL(): URL {
  const { DATABASE_URL } = process.env;

  if (DATABASE_URL) {
    return new URL(DATABASE_URL);
  }

  for (const pathToEnv of [PRISMA_ENV, LOCAL_ENV]) {
    if (existsSync(pathToEnv)) {
      const content = readFileSync(pathToEnv, "utf8");

      const { DATABASE_URL: url } = parse(content);

      if (url) {
        return new URL(url);
      }
    }
  }

  throw new Error("DATABASE_URL not defined.");
}

export function syncDatabases() {
  const databaseURL = getDatabaseURL();

  for (const schema of ["local", "preview", "public"]) {
    databaseURL.searchParams.set("schema", schema);

    spawnSync("yarn", ["prisma", "db", "push", "--preview-feature"], {
      stdio: "inherit",
      encoding: "utf8",
      env: { ...process.env, DATABASE_URL: databaseURL.toString() },
    });
  }
}

if (require.main === module) {
  syncDatabases();
}
