import { useRouter } from "next/router";

export function useRouterParam(key: string, returnType?: "string"): string;
export function useRouterParam(key: string, returnType: "number"): number;
export function useRouterParam<T extends "string" | "number">(
  key: string,
  returnType?: "string" | "number"
): number | string {
  let {
    query: { [key]: value },
  } = useRouter();

  if (typeof value != "string") {
    value = "";
  }

  if (returnType === "number") {
    return !value ? NaN : Number(value);
  }

  return value as T;
}
