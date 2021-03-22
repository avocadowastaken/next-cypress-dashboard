import { randomBytes } from "crypto";

function getRandomBytes(size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(size, (error, buffer) => {
      if (error) reject(error);
      else resolve(buffer.toString("base64"));
    });
  });
}

async function main() {
  const [SESSION_SECRET, TASKS_API_SECRET] = await Promise.all([
    getRandomBytes(32),
    getRandomBytes(32),
  ]);

  return Object.entries({
    SESSION_SECRET,
    TASKS_API_SECRET,
  })
    .map(([key, value]) => `${key}='${value}'`)
    .join("\n");
}

main()
  .then(console.log)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
