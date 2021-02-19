import { exec } from "@actions/exec";
import { randomBytes } from "crypto";

function getJWTSecret(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(64, (error, buffer) => {
      if (error) reject(error);
      else resolve(buffer.toString("base64"));
    });
  });
}

async function getJWTSigningKey(): Promise<string> {
  let result = "";

  await exec(
    "npx",
    [
      "--quiet",
      "node-jose-tools",
      "newkey",
      "-s",
      "256",
      "-t",
      "oct",
      "-a",
      "HS512",
    ],
    {
      silent: true,
      listeners: {
        stdout: (data) => {
          result += data.toString("utf8");
        },
      },
    }
  );

  return result;
}

async function getJWTEncryptionKey(): Promise<string> {
  let result = "";

  await exec(
    "npx",
    [
      "--quiet",
      "node-jose-tools",
      "newkey",
      "-s",
      "256",
      "-t",
      "oct",
      "-a",
      "A256GCM",
      "-u",
      "enc",
    ],
    {
      silent: true,
      listeners: {
        stdout: (data) => {
          result += data.toString("utf8");
        },
      },
    }
  );

  return result;
}

async function main() {
  const [JWT_SECRET, JWT_SIGNING_KEY, JWT_ENCRYPTION_KEY] = await Promise.all([
    getJWTSecret(),
    getJWTSigningKey(),
    getJWTEncryptionKey(),
  ]);

  return Object.entries({ JWT_SECRET, JWT_SIGNING_KEY, JWT_ENCRYPTION_KEY })
    .map(([key, value]) => `${key}='${value}'`)
    .join("\n");
}

main()
  .then(console.log)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
