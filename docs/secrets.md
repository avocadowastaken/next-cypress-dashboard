### Secrets

#### Generate Secrets

```bash
yarn ts-node scripts/generate-secrets.ts
```

It will generate secrets in dotenv format.

```bash
JWT_SECRET='/dXSGOC5rb+AhmnnYr4H8UVgoK755MrrJXKyw05AI4T/Rtkr0GvwlqVy2LSu4ql3wgbI+coQTdwG+DL2Avks/A=='
JWT_SIGNING_KEY='{"kty":"oct","kid":"6qFS-R8xNQwKTzbs4mD0UAhucxuYl05Fp5S7yKS1tjk","alg":"HS512","k":"1KwL-EB7RKm7zcARBWHaFz1fKL6Zzy3Ek6Zl67OjMKw"}'
JWT_ENCRYPTION_KEY='{"kty":"oct","kid":"W3CPPaI-ltmeSmL3GWGK3XJKaC30uxeNAvaE_tK3uGg","use":"enc","alg":"A256GCM","k":"ZlP_Dm44EHUhTdeQnLCi2QMm9pVSuswlOUR9Btle1rI"}'
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

vercel secret rm jwt-secret-preview --yes
vercel secrets add jwt-secret-preview "${JWT_SECRET}"
vercel env rm JWT_SECRET preview --yes
printf "jwt-secret-preview" | vercel env add secret JWT_SECRET preview

vercel secret rm jwt-signing-key-preview --yes
vercel secrets add jwt-signing-key-preview "${JWT_SIGNING_KEY}"
vercel env rm JWT_SIGNING_KEY preview --yes
printf "jwt-signing-key-preview" | vercel env add secret JWT_SIGNING_KEY preview

vercel secret rm jwt-encryption-key-preview --yes
vercel secrets add jwt-encryption-key-preview "${JWT_ENCRYPTION_KEY}"
vercel env rm JWT_ENCRYPTION_KEY preview --yes
printf "jwt-encryption-key-preview" | vercel env add secret JWT_ENCRYPTION_KEY preview
```

##### Vercel production secrets

```bash
# Generate new secrets for production
yarn --silent ts-node scripts/generate-secrets.ts > .env.production

# Copy all the new variables for the production
source .env.production

vercel secret rm jwt-secret-production --yes
vercel secrets add jwt-secret-production "${JWT_SECRET}"
vercel env rm JWT_SECRET production --yes
printf "jwt-secret-production" | vercel env add secret JWT_SECRET production

vercel secret rm jwt-signing-key-production --yes
vercel secrets add jwt-signing-key-production "${JWT_SIGNING_KEY}"
vercel env rm JWT_SIGNING_KEY production --yes
printf "jwt-signing-key-production" | vercel env add secret JWT_SIGNING_KEY production

vercel secret rm jwt-encryption-key-production --yes
vercel secrets add jwt-encryption-key-production "${JWT_ENCRYPTION_KEY}"
vercel env rm JWT_ENCRYPTION_KEY production --yes
printf "jwt-encryption-key-production" | vercel env add secret JWT_ENCRYPTION_KEY production
```
