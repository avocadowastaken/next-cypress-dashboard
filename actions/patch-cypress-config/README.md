# patch-cypress-config

Patches `app_url` of the `app.yml` file.

## Usage

```yml
jobs:
  e2e:
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - uses: umidbekk/next-cypress-dashboard/actions/patch-cypress-config@main
      - run: cypress
```
