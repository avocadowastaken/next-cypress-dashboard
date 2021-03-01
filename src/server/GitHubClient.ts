import { prisma } from "@/server/db";
import { createAppError } from "@/shared/AppError";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { RequestError } from "@octokit/request-error";

export async function verifyGitHubRepoAccess(
  userId: string,
  owner: string,
  repo: string
): Promise<void> {
  console.time("Loading GitHub Account");

  const account = await prisma.userAccount.findUnique({
    where: { userId_providerId: { userId, providerId: "github" } },
  });

  console.timeEnd("Loading GitHub Account");

  if (!account) {
    throw createAppError("GITHUB_ACCOUNT_NOT_LINKED");
  }

  if (!account.accessToken) {
    throw createAppError("GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN");
  }

  const octokit = new Octokit({ auth: account.accessToken });

  let repository: components["schemas"]["full-repository"];

  console.time("Fetching GitHub Repo");

  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });

    repository = response.data;
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      if (error.status === 401) {
        throw createAppError("GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN");
      }

      if (error.status === 404) {
        throw createAppError("GITHUB_REPO_NOT_FOUND");
      }
    }

    throw error;
  } finally {
    console.timeEnd("Fetching GitHub Repo");
  }

  if (!repository.permissions?.push) {
    throw createAppError("GITHUB_REPO_ACCESS_DENIED");
  }
}
