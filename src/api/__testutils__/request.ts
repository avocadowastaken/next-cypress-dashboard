import fetch, { Headers, RequestInit, Response } from "node-fetch";
export async function request(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const { DEPLOY_TARGET_URL } = process.env;

  return fetch(DEPLOY_TARGET_URL + url, init);
}

export async function requestJSON(
  url: string,
  { headers: headersOption, ...options }: RequestInit = {}
): Promise<unknown> {
  const headers = new Headers(headersOption);

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await request(url, { ...options, headers });

  return response.json();
}
