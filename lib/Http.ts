import { parse, serialize } from "superjson";

export type RequestOptions =
  | { method?: "GET" | "DELETE" }
  | { method: "POST" | "PUT" | "PATCH"; data?: unknown };

export async function requestJSON<TData>(
  url: string,
  options: RequestOptions = {}
): Promise<TData> {
  const init: RequestInit = { method: options.method };

  if (
    (options.method === "PUT" ||
      options.method === "POST" ||
      options.method === "PATCH") &&
    options.data
  ) {
    init.body = JSON.stringify(serialize(options.data));
    init.headers = { "Content-Type": "application/json" };
  }

  const request = new Request(url, init);
  const response = await fetch(request);
  const responseText = await response.text();

  if (response.status >= 400) {
    let errorMessage = response.statusText;

    try {
      const responseData = JSON.parse(responseText);

      if (responseData.message) {
        errorMessage = responseData.message;
      }
    } catch {}

    throw new Error(errorMessage);
  }

  return parse(responseText);
}
