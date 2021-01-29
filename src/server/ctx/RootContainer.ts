import { DBContainer } from "@s/ctx/DBContainer";
import { ServicesContainer } from "@s/ctx/ServicesContainer";
import { DependencyContainer, Injectable } from "@s/utils/DI";

export class RootContainer extends Injectable {
  static async create(): Promise<RootContainer> {
    const container = new DependencyContainer();

    return container.resolve(RootContainer);
  }

  readonly db = this.container.resolve(DBContainer);
  readonly services = this.container.resolve(ServicesContainer);
}
