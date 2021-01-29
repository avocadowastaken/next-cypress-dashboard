import { DBContainer } from "@s/ctx/DBContainer";
import { Injectable } from "@s/utils/DI";

export abstract class BaseService extends Injectable {
  protected readonly db = this.container.resolve(DBContainer);
}
