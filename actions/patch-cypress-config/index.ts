import { getInput, setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { create as createGlob } from "@actions/glob";
import { promises as fs } from "fs";
import * as path from "path";
import * as yaml from "yaml";

const apiUrl = getInput("api_url", { required: true });

async function resolveCachePath(): Promise<string> {
  let version = "";
  let cachePath = "";

  await exec("npx", ["cypress", "install"]);

  await exec("npx", ["cypress", "cache", "path"], {
    listeners: {
      stdout: (data) => {
        cachePath += data.toString("utf8");
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

    if (config.production.api_url !== apiUrl) {
      config.production.api_url = apiUrl;

      await fs.writeFile(configPath, yaml.stringify(config), "utf-8");
    }
  }
}

main().catch(setFailed);
