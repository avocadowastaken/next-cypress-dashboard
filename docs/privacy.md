### Privacy

1. We only gather required data to display minimal test details like
   - Repository data – name and owner
   - Commit data – sha, branch, message, author name and email
   - Test data - file name, suite name, stats, errors

> Please check [schema.prisma](https://github.com/umidbekk/next-cypress-dashboard/blob/main/prisma/schema.prisma) file for more detail.

2. We run daily task to remove run data:
   - Test runs (Older than 24h)
   - Test run instances (Older than 24h)
   - Test run results (Older than 24h)

> Please check [pages/api/[...api].api.ts](https://github.com/umidbekk/next-cypress-dashboard/blob/main/pages/api/[...api].api.ts) file for more detail.
