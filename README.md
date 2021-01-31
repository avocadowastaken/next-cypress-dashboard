# Next Cypress Dashboard 🏄

## Motivation

This project was inspired by the [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress),
which is absolutely great and production ready alternative to Cypress dashboard
with the single flaw – it's complex infrastructure.

So my personal goal was to make more minimalistic approach that focused on:

1. Test parallelisation
2. Easy installation

Differences with the [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress)

- Main functionality of [services](https://sorry-cypress.dev/terminology)
  were replaced by [NextJS](https://nextjs.org)
- Mongo and In Memory [execution drivers](https://sorry-cypress.dev/director/execution)
  were replaced by [Prisma](https://www.prisma.io/), which only works with
  [SQL databases](https://www.prisma.io/docs/reference/database-reference/supported-databases)
- No plans to support [storage driver](https://sorry-cypress.dev/director/storage)
  since videos and snapshots could be stored as CI artifacts.

## Usage

### Deployment

Check [NextJS](https://nextjs.org/docs/deployment) and
[Prisma](https://www.prisma.io/docs/concepts/components/prisma-client/deployment)
deployment guides.

### CI

#### GitHub Actions

```yaml
strategy:
  fail-fast: false
  matrix:
    container: [A, B, C, D, E, F]

steps:
  - uses: actions/checkout@v1

  - run: npm ci

  - uses: umidbekkarimov/next-cypress-dashboard/actions/patch-cypress-config@main
    with:
      api_url: ${{ secrets.NEXT_CYPRESS_DASHBOARD_URL }}

  - run: npx cypress run --record --parallel --ci-build-id=e2e-${{ github.sha }}

  - if: failure()
    uses: actions/upload-artifact@v2
    with:
      name: cypress-${{ matrix.container }}
      path: cypress/videos
```

#### Other CI

You can use any CI, but you have to reconfigure Cypress agent to use Next
Cypress Dashboard first. You can check [Sorry Cypress documentation](https://sorry-cypress.dev/quickstart#reconfigure-cypress-agent) for that.
