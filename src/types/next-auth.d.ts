import { NextApiHandler } from "next";
import "next-auth";
import { InitOptions } from "next-auth";

declare module "next-auth" {
  export default function NextAuth(options: InitOptions): NextApiHandler;
}
