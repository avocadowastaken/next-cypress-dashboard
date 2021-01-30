import { requestJSON } from "api/__testutils__/request";

describe("post", async () => {
  test("ensures project existance", async () => {
    const projectId = `projectId-${Math.random()}`;

    const result1 = await requestJSON("/runs", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });

    const result2 = await requestJSON("/runs", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
  });
});
