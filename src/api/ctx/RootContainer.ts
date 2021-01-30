import { DBContainer } from "@/api/ctx/DBContainer";
import { DependencyContainer, Injectable } from "@/api/utils/DI";

export class RootContainer extends Injectable {
  static async create(): Promise<RootContainer> {
    const container = new DependencyContainer();

    return container.resolve(RootContainer);
  }

  readonly db = this.container.resolve(DBContainer);
}
