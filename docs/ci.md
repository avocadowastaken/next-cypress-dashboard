### Continuous Integration

You can use any CI, but you have to reconfigure Cypress agent to use Next
Cypress Dashboard first. You can check [Sorry Cypress documentation](https://sorry-cypress.dev/quickstart#reconfigure-cypress-agent) for that.

#### GitHub Actions

```yaml
strategy:
  fail-fast: false
  matrix:
    container: [A, B, C, D, E, F]

steps:
  - uses: actions/checkout@v1

  - run: npm ci

  - uses: umidbekk/next-cypress-dashboard/actions/patch-cypress-config@main
    with:
      api_url: ${{ secrets.NEXT_CYPRESS_DASHBOARD_URL }}

  - run: npx cypress run --record --parallel --ci-build-id=e2e-${{ github.sha }}

  - if: failure()
    uses: actions/upload-artifact@v2
    with:
      name: cypress-${{ matrix.container }}
      path: cypress/videos
```
