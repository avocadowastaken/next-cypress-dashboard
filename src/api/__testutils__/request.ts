import fetch, { RequestInit, Response } from "node-fetch";
export async function request(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const { DEPLOY_TARGET_URL } = process.env;

  return fetch(DEPLOY_TARGET_URL + url, init);
}

export async function requestJSON(
  url: string,
  init?: RequestInit
): Promise<unknown> {
  const response = await request(url, init);

  return response.json();
}
