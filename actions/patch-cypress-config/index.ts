import { getInput, group, info, setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { create as createGlob } from "@actions/glob";
import { promises as fs } from "fs";
import * as path from "path";
import * as yaml from "yaml";

const API_URL =
  getInput("api_url", { required: false }) ||
  "https://next-cypress-dashboard.vercel.app";

async function resolveCachePath(): Promise<string> {
  let version = "";
  let cachePath = "";

  await group("Verify Cypress installation", () =>
    exec("npx", ["cypress", "install"])
  );

  await group("Obtain Cypress cache path", () =>
    exec("npx", ["cypress", "cache", "path"], {
      listeners: {
        stdout: (data) => {
          cachePath += data.toString("utf8");
        },
      },
    })
  );

  await group("Obtain Cypress binary version", () =>
    exec("npx", ["cypress", "version", "--component", "binary"], {
      listeners: {
        stdout: (data) => {
          version += data.toString("utf8");
        },
      },
    })
  );

  return path.join(cachePath.trim(), version.trim());
}

async function main(): Promise<void> {
  const cachePath = await resolveCachePath();
  const glob = await createGlob(`${cachePath}/**/app.yml`);

  for await (const configPath of glob.globGenerator()) {
    const configYaml = await fs.readFile(configPath, "utf-8");
    const config = yaml.parse(configYaml) as {
      production: { api_url: string };
    };

    if (config.production.api_url !== API_URL) {
      config.production.api_url = API_URL;

      info(`Updating ${configPath}…`);

      await fs.writeFile(configPath, yaml.stringify(config), "utf-8");
    } else {
      info(`Skipping ${configPath}`);
    }
  }
}

main().catch(setFailed);
