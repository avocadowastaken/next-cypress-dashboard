import { promises as fs } from "fs";
import * as path from "path";

export async function stringifyPrivateKey(filename: string): Promise<string> {
  const filepath = path.resolve(filename);
  return fs.readFile(filepath, "base64");
}

if (require.main === module) {
  const [input] = process.argv.slice(2);
  stringifyPrivateKey(input)
    .then((line) => {
      console.log(line);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
