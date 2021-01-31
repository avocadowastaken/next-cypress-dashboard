import { DependencyContainer, Injectable } from "@/api/utils/DI";
import { NextApiRequest } from "next";

export class ServerRequestContext extends Injectable {
  protected static cache = new WeakMap<
    NextApiRequest,
    Promise<ServerRequestContext>
  >();

  static async create(): Promise<ServerRequestContext> {
    const container = new DependencyContainer();

    return container.resolve(ServerRequestContext);
  }

  static resolve(req: NextApiRequest): Promise<ServerRequestContext> {
    let ctx = this.cache.get(req);

    if (!ctx) {
      ctx = this.create();
      this.cache.set(req, ctx);
    }

    return ctx;
  }
}
