import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@/core/env";
import { AppError } from "@/lib/AppError";
import { prisma } from "@/lib/db";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { RequestError } from "@octokit/request-error";

export async function obtainAccessToken(
  code: string,
  state: string
): Promise<
  [
    token: string,
    user:
      | components["schemas"]["private-user"]
      | components["schemas"]["public-user"]
  ]
> {
  const auth = createOAuthAppAuth({
    clientType: "oauth-app",
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  });

  const { token } = await auth({ type: "oauth-user", code, state });

  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.request("GET /user");

  return [token, data];
}

async function getOctokit(userId: string): Promise<Octokit> {
  const account = await prisma.userAccount.findUnique({
    select: { accessToken: true },
    where: { userId_providerId: { userId, providerId: "github" } },
  });

  if (!account?.accessToken) {
    throw new AppError("UNAUTHORIZED");
  }

  return new Octokit({ auth: account.accessToken });
}

export async function findGitHubUserAvatar(
  userId: string,
  email: string
): Promise<null | string> {
  try {
    email = decodeURIComponent(email);
  } catch {}

  const privateEmailPattern = /(([\d]{7})\+)?(.+)(@users.noreply.github.com)$/;
  const privateEmailMatches = email.match(privateEmailPattern);

  if (privateEmailMatches) {
    const id = privateEmailMatches[2];

    if (id) {
      return `https://avatars.githubusercontent.com/u/${id}`;
    }

    const username = privateEmailMatches[3];

    if (username) {
      return `https://avatars.githubusercontent.com/${username}`;
    }
  }

  const octokit = await getOctokit(userId).catch(() => null);

  if (octokit) {
    const users = await octokit
      .request("GET /search/users", { q: `${email} in:email`, per_page: 1 })
      .catch(() => null);

    if (users?.data.items.length) {
      return users.data.items[0].avatar_url;
    }

    const commits = await octokit
      .request("GET /search/commits", {
        per_page: 1,
        sort: "author-date",
        q: `author-email:${email}`,
        mediaType: { previews: ["cloak"] },
      })
      .catch(() => null);

    if (commits?.data.items.length) {
      const { author } = commits.data.items[0];

      if (author) {
        return author.avatar_url;
      }
    }
  }

  return null;
}

export async function verifyGitHubRepoAccess(
  userId: string,
  owner: string,
  repo: string
): Promise<void> {
  const octokit = await getOctokit(userId);

  let repository: components["schemas"]["full-repository"];

  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });

    repository = response.data;
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      if (error.status === 401) {
        throw new AppError("UNAUTHORIZED");
      }

      if (error.status === 404) {
        throw new AppError("GITHUB_REPO_NOT_FOUND");
      }
    }

    throw error;
  }

  if (!repository.permissions?.push) {
    throw new AppError("GITHUB_REPO_ACCESS_DENIED");
  }
}
