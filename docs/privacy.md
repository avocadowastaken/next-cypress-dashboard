### Privacy

1. We only gather required data to display minimal test details like

   - Organization of the repository
   - Name of the repository
   - Test spec file name
   - Test suite name
   - Test result errors

> Please check [schema.prisma](https://github.com/umidbekk/next-cypress-dashboard/blob/main/prisma/schema.prisma) file for more detail.

2. We run daily task to remove run data:
   - Test runs (Older than 24h)
   - Test run instances (Older than 24h)
   - Test run results (Older than 24h)

> Please check [pages/api/[[...tasks]].ts](https://github.com/umidbekk/next-cypress-dashboard/blob/main/pages/api/[[...tasks]].ts) file for more detail.
