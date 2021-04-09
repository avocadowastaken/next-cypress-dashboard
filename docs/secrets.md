### Secrets

#### Generate Secrets

```bash
yarn ts-node scripts/generate-secrets.ts
```

It will generate secrets in dotenv format.

```bash
NCD_SECRET='E2OAhG1AdQP4Rq1II0h0eRNiygdbfMQj7DNIOM3VoUc='
SESSION_SECRET='nBoPA6LvhkK4ZuWIlko04Id5yZQux+UvGw2H+5RNYsY='
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

vercel secret rm ncd-secret-prev --yes
vercel secrets add ncd-secret-prev "${NCD_SECRET}"
vercel env rm NCD_SECRET preview --yes
printf "ncd-secret-prev" | vercel env add secret NCD_SECRET preview

vercel secret rm ncd-session-secret-prev --yes
vercel secrets add ncd-session-secret-prev "${SESSION_SECRET}"
vercel env rm SESSION_SECRET preview --yes
printf "ncd-session-secret-prev" | vercel env add secret SESSION_SECRET preview
```

##### Vercel production secrets

```bash
# Generate new secrets for production
yarn --silent ts-node scripts/generate-secrets.ts > .env.production

# Copy all the new variables for the production
source .env.production

vercel secret rm ncd-secret-prod --yes
vercel secrets add ncd-secret-prod "${NCD_SECRET}"
vercel env rm NCD_SECRET production --yes
printf "ncd-secret-prod" | vercel env add secret NCD_SECRET production

vercel secret rm ncd-session-secret-prod --yes
vercel secrets add ncd-session-secret-prod "${SESSION_SECRET}"
vercel env rm SESSION_SECRET production --yes
printf "ncd-session-secret-prod" | vercel env add secret SESSION_SECRET production
```
