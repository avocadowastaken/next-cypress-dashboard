import { prisma } from "@/api/db";
import { BadRequestError } from "@/api/HTTPError";
import { SecurityContext } from "@/api/SecurityContext";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types/generated/types";

export class GitHubClient {
  static async create({ user }: SecurityContext): Promise<GitHubClient> {
    const account = await prisma.userAccount.findUnique({
      where: { userId_providerId: { userId: user.id, providerId: "github" } },
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

  async searchUser(
    login: string
  ): Promise<components["schemas"]["user-search-result-item"][]> {
    const response = await this.octokit.request("GET /search/users", {
      page: 1,
      per_page: 20,
      q: `${login} in:login`,
    });

    return response.data.items;
  }

  async searchRepo(
    owner: string,
    name: string
  ): Promise<components["schemas"]["repository"][]> {
    const response = await this.octokit.request("GET /search/repositories", {
      page: 1,
      per_page: 20,
      q: `${name} in:name,description org:${owner}`,
    });

    return response.data.items;
  }
}
