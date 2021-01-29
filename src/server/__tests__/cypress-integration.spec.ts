import { beforeEach } from "@jest/globals";
import { execSync } from "child_process";

beforeEach(async () => {
  execSync("yarn patch-cypress-api-url");
}, 15000);

test("basic", async () => {
  // await exec("cypress", ["run", ""], { silent: true });
});
