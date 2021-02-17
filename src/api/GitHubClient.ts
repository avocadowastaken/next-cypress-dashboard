import { prisma } from "@/api/db";
import { createAppError } from "@/shared/AppError";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { RequestError } from "@octokit/request-error";

export class GitHubClient {
  static async create(userId: string): Promise<GitHubClient> {
    const account = await prisma.userAccount.findUnique({
      where: { userId_providerId: { userId, providerId: "github" } },
    });

    if (!account) {
      throw createAppError("GITHUB_ACCOUNT_NOT_LINKED");
    }

    if (!account.accessToken) {
      throw createAppError("GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN");
    }

    return new GitHubClient(account.accessToken);
  }

  protected readonly octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async getRepo(
    owner: string,
    name: string
  ): Promise<components["schemas"]["full-repository"]> {
    try {
      const response = await this.octokit.request("GET /repos/{owner}/{repo}", {
        repo: name,
        owner,
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof RequestError && error.status === 404) {
        throw createAppError("GITHUB_REPO_NOT_FOUND");
      }

      throw error;
    }
  }

  async verifyRepoAccess(owner: string, name: string): Promise<void> {
    const repo = await this.getRepo(owner, name);

    if (!repo.permissions?.push) {
      throw createAppError("GITHUB_REPO_ACCESS_DENIED");
    }
  }
}
