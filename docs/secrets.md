### Secrets

#### Generate Secrets

```bash
yarn ts-node scripts/generate-secrets.ts
```

It will generate secrets in dotenv format.

```bash
SESSION_SECRET='nBoPA6LvhkK4ZuWIlko04Id5yZQux+UvGw2H+5RNYsY='
TASKS_API_SECRET='E2OAhG1AdQP4Rq1II0h0eRNiygdbfMQj7DNIOM3VoUc='
```

So you can append directly to your env file (do not forget to add `--silent` after `yarn`).

```bash
yarn --silent ts-node scripts/generate-secrets.ts >> .env
```

#### Updating Vercel secrets

> You can use any name you want for the secrets, but you have to keep same env
> variable names.

##### Vercel preview secrets

```bash
# Generate new secrets for preview
yarn --silent ts-node scripts/generate-secrets.ts > .env.preview

# Copy all the new variables for the preview
source .env.preview

vercel secret rm session-secret-preview --yes
vercel secrets add session-secret-preview "${SESSION_SECRET}"
vercel env rm SESSION_SECRET preview --yes
printf "session-secret-preview" | vercel env add secret SESSION_SECRET preview

vercel secret rm tasks-api-secret-preview --yes
vercel secrets add tasks-api-secret-preview "${TASKS_API_SECRET}"
vercel env rm TASKS_API_SECRET preview --yes
printf "tasks-api-secret-preview" | vercel env add secret TASKS_API_SECRET preview
```

##### Vercel production secrets

```bash
# Generate new secrets for production
yarn --silent ts-node scripts/generate-secrets.ts > .env.production

# Copy all the new variables for the production
source .env.production

vercel secret rm session-secret-production --yes
vercel secrets add session-secret-production "${SESSION_SECRET}"
vercel env rm SESSION_SECRET production --yes
printf "session-secret-production" | vercel env add secret SESSION_SECRET production

vercel secret rm tasks-api-secret-production --yes
vercel secrets add tasks-api-secret-production "${TASKS_API_SECRET}"
vercel env rm TASKS_API_SECRET production --yes
printf "tasks-api-secret-production" | vercel env add secret TASKS_API_SECRET production
```
