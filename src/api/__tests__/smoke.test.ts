import fetch from "node-fetch";

test("health", async () => {
  const { DEPLOY_TARGET_URL } = process.env;

  const response = await fetch(DEPLOY_TARGET_URL + "/api/health", {
    method: "GET",
  });

  expect(response.ok).toBe(true);

  await expect(response.json()).resolves.toMatchObject({
    request: { method: "GET" },
    projects: { count: expect.any(Number) },
  });
});
