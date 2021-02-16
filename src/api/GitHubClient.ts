import { prisma } from "@/api/db";
import { BadRequestError } from "@/api/HTTPError";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types/generated/types";

export class GitHubClient {
  static async create(userId: string): Promise<GitHubClient> {
    const account = await prisma.userAccount.findUnique({
      where: { userId_providerId: { userId, providerId: "github" } },
    });

    if (!account) {
      throw new BadRequestError("User is not linked with any GitHub account");
    }

    if (!account.accessToken) {
      throw new BadRequestError("GitHub access token is empty");
    }

    return new GitHubClient(account.accessToken);
  }

  protected readonly octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getRepo(
    owner: string,
    repo: string
  ): Promise<components["schemas"]["full-repository"]> {
    const response = await this.octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });

    return response.data;
  }
}
