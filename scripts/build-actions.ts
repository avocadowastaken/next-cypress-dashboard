import { exec } from "@actions/exec";
import { create as createGlob } from "@actions/glob";
import { dirname, join as joinPath } from "path";

const ROOT_DIR = joinPath(__dirname, "..");
const ACTIONS_DIR = joinPath(ROOT_DIR, "actions");

async function main() {
  const glob = await createGlob(`${ACTIONS_DIR}/*/index.ts`);

  for await (const entry of glob.globGenerator()) {
    const outDir = joinPath(dirname(entry), "dist");

    await exec("esbuild", [
      entry,
      "--bundle",
      "--keep-names",
      "--minify-syntax",
      `--outdir=${outDir}`,
      "--target=node12",
      "--platform=node",
      "--main-fields=module,main",
    ]);
  }
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
