import { prisma } from "@/server/db";
import { createAppError } from "@/shared/AppError";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { RequestError } from "@octokit/request-error";
import debug from "debug";

const logger = debug("app:github");

export async function verifyGitHubRepoAccess(
  userId: string,
  owner: string,
  repo: string
): Promise<void> {
  logger("loading account…");

  const account = await prisma.userAccount.findUnique({
    where: { userId_providerId: { userId, providerId: "github" } },
  });

  if (!account) {
    logger("account not found");

    throw createAppError("GITHUB_ACCOUNT_NOT_LINKED");
  }

  if (!account.accessToken) {
    logger("empty access token");

    throw createAppError("GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN");
  }

  const octokit = new Octokit({ auth: account.accessToken });

  let repository: components["schemas"]["full-repository"];

  logger("fetching repo");

  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });

    repository = response.data;
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      if (error.status === 401) {
        logger("invalid access token");

        throw createAppError("GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN");
      }

      if (error.status === 404) {
        logger("repo not found");

        throw createAppError("GITHUB_REPO_NOT_FOUND");
      }
    }

    logger(error);

    throw error;
  }

  logger("verifying push permissions");

  if (!repository.permissions?.push) {
    logger("access denied");

    throw createAppError("GITHUB_REPO_ACCESS_DENIED");
  }
}
