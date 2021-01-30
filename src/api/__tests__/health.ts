import { request, requestJSON } from "@/api/__testutils__/request";

test("basic", async () => {
  const json = await requestJSON("/api/health", { method: "DELETE" });

  expect(json).toMatchObject({
    request: { method: "DELETE" },
    projects: { count: expect.any(Number) },
  });
});

test("404", async () => {
  const url = Math.random().toString().slice(2, 5).split("").join("/");
  const response = await request(`/api/${url}`);

  expect(response.status).toBe(404);

  await expect(response.json()).resolves.toEqual({
    status: 404,
    message: "Not Found",
    name: "RouteNotFoundError",
    context: { method: "GET", url: `/api/${url}` },
  });
});
