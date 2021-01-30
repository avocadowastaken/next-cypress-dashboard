import { exec } from "@actions/exec";
import { create as createGlob } from "@actions/glob";
import { promises as fs } from "fs";
import { join as joinPath } from "path";
import { parse as fromYaml, stringify as toYaml } from "yaml";

async function resolveCachePath(): Promise<string> {
  let version = "";
  let cachePath = "";

  await exec("cypress", ["cache", "path"], {
    listeners: {
      stdout: (data) => {
        cachePath += data.toString("utf8");
      },
    },
  });

  await exec("cypress", ["version", "--component", "binary"], {
    listeners: {
      stdout: (data) => {
        version += data.toString("utf8");
      },
    },
  });

  return joinPath(cachePath.trim(), version.trim());
}

export interface PatchCypressConfigOptions {
  api_url: string;
}

export async function patchCypressConfig(
  overrides: PatchCypressConfigOptions
): Promise<void> {
  const cachePath = await resolveCachePath();
  const glob = await createGlob(`${cachePath}/**/app.yml`);

  for await (const configPath of glob.globGenerator()) {
    const configYaml = await fs.readFile(configPath, "utf-8");
    const config = fromYaml(configYaml) as {
      production: { api_url: string };
    };

    if (config.production.api_url !== overrides.api_url) {
      config.production.api_url = overrides.api_url;

      await fs.writeFile(configPath, toYaml(config), "utf-8");
    }
  }
}
