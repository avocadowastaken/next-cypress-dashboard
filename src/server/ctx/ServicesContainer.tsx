import { RunsService } from "@s/services/RunsService";
import { Injectable } from "@s/utils/DI";

export class ServicesContainer extends Injectable {
  readonly runs = this.container.resolve(RunsService);
}
