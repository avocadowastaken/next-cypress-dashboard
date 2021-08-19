### Secrets

#### Generate Secrets

```bash
node scripts/generate-secrets
```

It will generate secrets in dotenv format.

```bash
NCD_SECRET='E2OAhG1AdQP4Rq1II0h0eRNiygdbfMQj7DNIOM3VoUc='
SESSION_SECRET='nBoPA6LvhkK4ZuWIlko04Id5yZQux+UvGw2H+5RNYsY='
```

```bash
node scripts/generate-secrets >> .env
```

#### Updating Vercel secrets

> You can use any name you want for the secrets, but you have to keep same env
> variable names.

##### Vercel preview secrets

```bash
# Generate new secrets for preview
node scripts/generate-secrets > .env.preview

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
node scripts/generate-secrets > .env.production

# Copy all the new variables for the production
source .env.production

vercel secret rm ncd-secret-prod --yes
vercel secrets add ncd-secret-prod "${NCD_SECRET}"
vercel env rm NCD_SECRET production --yes
printf "ncd-secret-prod" | vercel env add secret NCD_SECRET production

vercel secret rm ncd-secret-prev --yes
vercel secrets add ncd-secret-prev "${SESSION_SECRET}"
vercel env rm SESSION_SECRET production --yes
printf "ncd-secret-prev" | vercel env add secret SESSION_SECRET production
```
