import { prisma } from "@/api/db";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } from "@/api/env";
import { NextApiRequest, NextApiResponse } from "next";
import nextAuth, { User } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";

export default function nextAuthApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  return nextAuth(req, res, {
    session: { jwt: true },
    jwt: { secret: JWT_SECRET },

    adapter: Adapters.Prisma.Adapter({
      prisma,
      modelMapping: {
        User: "user",
        Session: "userSession",
        Account: "userAccount",
        VerificationRequest: "userVerificationRequest",
      },
    }),

    providers: [
      Providers.GitHub({
        scope: "user read:org",
        clientId: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
      }),
    ],

    callbacks: {
      async signIn(
        // There are two different inputs passed here:
        // 1. User from the OAuth provider
        // 2. User from the DB
        user: User & { id: unknown; createdAt: unknown },
        account: {
          id: number;
          provider: string;
          expires_in?: string;
          access_token?: string;
          refresh_token?: string;
          refresh_token_expires_in?: string;
        }
      ) {
        if (typeof user.id === "string" && user.createdAt instanceof Date) {
          await prisma.userAccount.update({
            where: {
              userId_providerId_providerAccountId: {
                userId: user.id,
                providerId: account.provider,
                providerAccountId: String(account.id),
              },
            },

            data: {
              refreshToken: account.refresh_token || null,
              accessToken: account.access_token || null,
              accessTokenExpires: !account.expires_in
                ? null
                : new Date(
                    Date.now() + parseInt(account.expires_in, 10) * 1000
                  ),
            },
          });
        }

        return true;
      },
    },
  });
}
