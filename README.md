# Next Cypress Dashboard 🏄

## Usage

1. Sign In using GitHub
2. Import a GitHub repo
3. Patch Cypress agent config (check [patch-cypress-config](https://github.com/umidbekk/next-cypress-dashboard/tree/main/actions/patch-cypress-config) action)
4. Run Cypress

Fur further information check the [docs](/docs).

## Motivation

This project was inspired by the [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress),
which is absolutely great and production ready alternative to Cypress dashboard
with the single flaw – it's complex infrastructure.

So my personal goal was to make more minimalistic approach that focused on:

1. Test parallelization
2. Easy installation

Differences with the [Sorry Cypress](https://github.com/sorry-cypress/sorry-cypress)

- Main functionality of [services](https://sorry-cypress.dev/terminology)
  were replaced by [NextJS](https://nextjs.org)
- Mongo and In Memory [execution drivers](https://sorry-cypress.dev/director/execution)
  were replaced by [Prisma](https://www.prisma.io/), which only works with
  [SQL databases](https://www.prisma.io/docs/reference/database-reference/supported-databases)
- No plans to support [storage driver](https://sorry-cypress.dev/director/storage)
  since videos and snapshots could be stored as CI artifacts.
