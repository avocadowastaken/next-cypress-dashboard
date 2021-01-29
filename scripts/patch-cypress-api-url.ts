import { exec } from "@actions/exec";
import * as glob from "@actions/glob";
import { promises as fs } from "fs";
import * as path from "path";
import * as yaml from "yaml";

async function resolveCypressCachePath(): Promise<string> {
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

  return path.join(cachePath.trim(), version.trim());
}

export async function patchCypressAPIUrl(apiURL: string): Promise<void> {
  const cachePath = await resolveCypressCachePath();
  const globber = await glob.create(`${cachePath}/**/app.yml`);

  for await (const filePath of globber.globGenerator()) {
    const fileText = await fs.readFile(filePath, "utf-8");
    const fileContent = yaml.parse(fileText) as {
      production: { api_url: string };
    };

    if (fileContent.production.api_url !== apiURL) {
      fileContent.production.api_url = apiURL;

      await fs.writeFile(filePath, yaml.stringify(fileContent), "utf-8");
    }
  }
}

if (require.main === module) {
  patchCypressAPIUrl("http://localhost:3000").catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
