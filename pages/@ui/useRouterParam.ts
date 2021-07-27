import { useRouter } from "next/router";

export function useRouterParam(
  key: string,
  returnType?: "string"
): string | undefined;
export function useRouterParam(
  key: string,
  returnType: "number"
): number | undefined;
export function useRouterParam<T extends "string" | "number" | undefined>(
  key: string,
  returnType?: "string" | "number"
): undefined | number | string {
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
