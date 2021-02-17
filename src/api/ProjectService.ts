import { randomBytes } from "crypto";

export function createProjectRecordKey(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    randomBytes(32, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
}
