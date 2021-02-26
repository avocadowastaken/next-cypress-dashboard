import { spawnSync } from "child_process";
import { parse } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { join as joinPath } from "path";

const LOCAL_ENV = joinPath(__dirname, "..", ".env");

function getDatabaseURL(): URL {
  let { DATABASE_URL } = process.env;

  if (!DATABASE_URL && existsSync(LOCAL_ENV)) {
    ({ DATABASE_URL } = parse(readFileSync(LOCAL_ENV, "utf8")));
  }

  if (!DATABASE_URL) {
    throw new Error("'DATABASE_URL' not defined.");
  }

  return new URL(DATABASE_URL);
}

export function migrate(schema: string, ...args: string[]) {
  if (!schema) {
    throw new Error("Schema is empty.");
  }

  const databaseURL = getDatabaseURL();
  databaseURL.searchParams.set("schema", schema);

  spawnSync("yarn", ["prisma", "db", "push", "--preview-feature", ...args], {
    stdio: "inherit",
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: databaseURL.toString() },
  });
}

if (require.main === module) {
  const [schema, ...args] = process.argv.slice(2);

  migrate(schema, ...args);
}
