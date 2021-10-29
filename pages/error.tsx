import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Error(): ReactElement {
  const router = useRouter();
  return <pre>{router.query["message"] || "Unknown Error"}</pre>;
}
