import { formatSchema } from "@prisma/sdk";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const schemaPath = path.join("prisma", "schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");

formatSchema({ schema }).then((formatted: string) => {
  formatted = formatted.trim() + os.EOL;

  if (schema !== formatted) {
    fs.writeFileSync(schemaPath, formatted, "utf8");
  }
});
