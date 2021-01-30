import { RootContainer } from "@/api/ctx/RootContainer";
import { DependencyContainer } from "@/api/utils/DI";
import { NextApiRequest } from "next";

export class ServerRequestContext extends RootContainer {
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
