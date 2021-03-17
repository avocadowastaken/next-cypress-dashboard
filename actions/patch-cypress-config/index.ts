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
  await group("Verifying installation", async () => {
    await exec("npx", ["cypress", "install"]);
    await exec("npx", ["cypress", "verify"]);
  });

  return group("Resolving cache path", async () => {
    let version = "";
    let cacheDir = "";

    await exec("npx", ["cypress", "cache", "path"], {
      listeners: {
        stdout: (data) => {
          cacheDir += data.toString("utf8");
        },
      },
    });

    await exec("npx", ["cypress", "version", "--component", "binary"], {
      listeners: {
        stdout: (data) => {
          version += data.toString("utf8");
        },
      },
    });

    const cachePath = path.join(cacheDir.trim(), version.trim());

    info(`Resolved: ${cachePath}`);

    return cachePath;
  });
}

async function main(): Promise<void> {
  const cachePath = await resolveCachePath();
  const pattern = `${cachePath}/**/app.yml`;
  const glob = await createGlob(pattern);

  await group("Patching config", async () => {
    info(`Searching for the files with the pattern: ${pattern}`);

    for await (const configPath of glob.globGenerator()) {
      const configYaml = await fs.readFile(configPath, "utf-8");
      const config = yaml.parse(configYaml) as {
        production: { api_url: string };
      };

      if (config.production.api_url !== API_URL) {
        info(`Patching ${configPath} (from: ${config.production.api_url})`);

        config.production.api_url = API_URL;
        await fs.writeFile(configPath, yaml.stringify(config), "utf-8");
      } else {
        info(`Skipping ${configPath}`);
      }
    }
  });
}

main().catch(setFailed);
