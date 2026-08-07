# Environment Isolation Plan

## Goal

Create three environments for this project with strict separation:

- `development`
- `staging`
- `production`

Each environment must have its own:

- Supabase project
- Postgres database and data set
- Auth users and auth configuration
- Storage buckets and files
- Edge Functions deployment
- Supabase secrets
- Frontend environment variables
- Third-party API keys where sandbox or separate accounts are available
- Deployment target and domain mapping

The end state is that work done in development cannot read from, write to, authenticate against, or send emails from staging or production by mistake.

## Current Repo Findings

This repo already uses environment variables for the frontend, but it is still wired like a single-environment system.

### Frontend variables currently used

The React app reads these Vite variables:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_GTM_ID`
- `VITE_GOOGLE_ANALYTICS_ID`
- `VITE_GOOGLE_ADS_CONVERSION_ID`
- `VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL`
- `VITE_FACEBOOK_PIXEL_ID`
- `VITE_COOKIEBOT_ID`
- `VITE_RECAPTCHA_SITE_KEY`

### Backend and edge-function secrets currently used

Edge Functions currently depend on these server-side secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `FROM_EMAIL`
- `SITE_URL`

### Deployment coupling that exists today

- `supabase/config.toml` contains one `project_id`, which is currently a single-project setup.
- `.github/workflows/release-deploy.yml` is production-oriented and links one Supabase project using one secret set.
- `.env` is present in the repo root and contains one environment's values.

## Recommended Target Architecture

## 1. Environment model

Use three hosted Supabase projects:

- `flyttbas-dev`
- `flyttbas-staging`
- `flyttbas-prod`

Use one isolated frontend config set per environment:

- local development points to `flyttbas-dev`
- staging deployment points to `flyttbas-staging`
- production deployment points to `flyttbas-prod`

Recommended deployment mapping:

- `development`: local Vite app and optional dev deployment URL such as `dev.flyttbas.se`
- `staging`: preview or staging deployment URL such as `staging.flyttbas.se`
- `production`: `flyttbas.se`

This is better than relying on one Supabase project with branches because the requirement is complete data and key isolation. Separate Supabase projects are the clean boundary.

## 2. Isolation boundary per environment

For each environment, isolate all of the following:

- Database schema and rows
- Auth users, sessions, magic links, password resets
- Storage files and signed URLs
- Edge Functions and their secrets
- reCAPTCHA site key and secret
- Google Maps API key
- Email provider settings and sender identities
- Analytics and tracking IDs
- Domain URLs used inside emails

If a vendor supports test or sandbox credentials, use them in development and staging. Do not reuse production credentials in lower environments unless the vendor has no realistic alternative and the risk has been accepted explicitly.

## Detailed Implementation Plan

## Phase 1: Inventory and classification

Create a single environment inventory sheet before changing infrastructure.

Classify every key or identifier into one of these groups:

- `public but environment-specific`: Supabase URL, Supabase publishable key, analytics IDs, Cookiebot ID, reCAPTCHA site key
- `secret and environment-specific`: service role key, Resend API key, Google Maps API key, reCAPTCHA secret, Vercel tokens, database password
- `data-bearing integration`: Supabase database, auth users, storage buckets
- `notification identity`: sender email, site URL, callback URLs

Minimum inventory list for this repo:

- Supabase project ref
- Supabase URL
- Supabase anon or publishable key
- Supabase service role key
- Supabase DB password
- Resend API key
- Google Maps API key
- reCAPTCHA site key
- reCAPTCHA secret key
- GTM container ID
- GA4 measurement ID
- Google Ads conversion ID and label
- Facebook Pixel ID
- Cookiebot ID
- `SITE_URL`
- `FROM_EMAIL`
- Vercel project identifiers and deploy token

## Phase 2: Provision separate Supabase projects

Create three Supabase projects manually in the Supabase dashboard.

Recommended naming:

- `flyttbas-dev`
- `flyttbas-staging`
- `flyttbas-prod`

For each project, configure:

- database password
- region
- auth providers and allowed redirect URLs
- storage buckets
- edge functions secrets
- SMTP or email provider behavior if used through functions

Important rule: do not clone production data into development unless you first anonymize it. If production-like testing is needed in staging, use sanitized seed data only.

## Phase 3: Make schema portable and repeatable

Use the repo as the source of truth for schema and edge functions.

Target rule:

- migrations in `supabase/migrations` define the schema
- edge functions in `supabase/functions` define server logic
- seed scripts define non-sensitive reference data

Rollout steps:

1. Audit migrations for anything that assumes production-only URLs, emails, or identifiers.
2. Add seed scripts for base records required in every environment.
3. Keep environment-specific values out of migrations when possible.
4. Apply the same migration history to dev, then staging, then production.

## Phase 4: Restructure frontend environment management

Move to explicit Vite environment files.

Recommended files:

- `.env.example`
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.local` for developer overrides only

Suggested contents per environment:

```env
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_RECAPTCHA_SITE_KEY=
VITE_GTM_ID=
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_ADS_CONVERSION_ID=
VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL=
VITE_FACEBOOK_PIXEL_ID=
VITE_COOKIEBOT_ID=
```

Operational rules:

- commit `.env.example`
- do not commit real `.env.*` values
- keep local overrides in `.env.local`
- make `npm run dev` default to development values
- make staging builds use `vite build --mode staging`
- make production builds use `vite build --mode production`

Because the repo already uses `import.meta.env`, the frontend code should need minimal structural change.

## Phase 5: Separate edge-function secrets by environment

Each Supabase project must store its own secret set.

Secret matrix per environment:

### Shared secret names, different values

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `FROM_EMAIL`
- `SITE_URL`

Recommended values by environment:

- `development`: dev sender address, dev site URL, test API keys where available
- `staging`: staging sender address, staging URL, non-production vendor keys
- `production`: production sender address, production URL, production vendor keys

Operational rule:

- deploy functions into each Supabase project separately
- set secrets in each project separately
- never copy production service role keys into dev or staging secret stores

## Phase 6: Separate auth and redirect URLs

Supabase Auth must be configured separately in each project.

For every environment, define:

- site URL
- redirect URLs for auth flows
- password setup URLs
- email template links

Example mapping:

- dev: `http://localhost:5173`, optional `https://dev.flyttbas.se`
- staging: `https://staging.flyttbas.se`
- production: `https://flyttbas.se`

This is important because this app uses authentication flows and email-based links. A wrong redirect URL can silently send users into the wrong environment.

## Phase 7: Separate third-party integrations

Not every integration needs a unique account, but every integration must be evaluated.

### Must be environment-specific

- Supabase project identifiers and keys
- reCAPTCHA keys
- Resend API key or sending identity
- `SITE_URL`
- `FROM_EMAIL`

### Strongly recommended to be environment-specific

- Google Maps API key
- GTM container
- GA4 property or data stream
- Google Ads conversion setup
- Facebook Pixel
- Cookiebot configuration

Why this matters:

- lower environments should not contaminate production analytics
- development emails should not come from production sender identities if avoidable
- sandbox keys make accidental customer impact less likely

## Phase 8: CI/CD redesign

The existing GitHub Actions workflow should be split so environment choice is explicit.

Recommended deployment model:

### Option A: branch-based

- `develop` branch deploys to development
- `staging` branch deploys to staging
- `main` or release branch deploys to production

### Option B: workflow dispatch plus protected environments

- manual promotion to development
- manual promotion to staging
- manual promotion to production

Recommended for this project:

- automatic deploy to development from `develop`
- automatic deploy to staging from `staging`
- controlled promotion to production from release branch or tagged release

GitHub environment setup:

- create GitHub environments named `development`, `staging`, `production`
- store a separate secret set in each environment
- require approval for `production`
- optionally require approval for `staging`

Per-environment GitHub secrets needed:

- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_GTM_ID`
- `VITE_GOOGLE_ANALYTICS_ID`
- `VITE_GOOGLE_ADS_CONVERSION_ID`
- `VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL`
- `VITE_FACEBOOK_PIXEL_ID`
- `VITE_COOKIEBOT_ID`
- Vercel target identifiers or deployment tokens for the matching environment

Pipeline responsibilities by environment:

1. Build frontend with that environment's Vite vars.
2. Deploy frontend to that environment's target.
3. Link the matching Supabase project.
4. Run `supabase db push` against only that project.
5. Deploy edge functions to only that project.
6. Set or verify function secrets for only that project.

## Phase 9: Vercel environment strategy

Choose one of these models.

### Recommended model

Use one Vercel project with three environment scopes where possible:

- Development
- Preview for staging
- Production

Then ensure each scope points to the matching Supabase project.

### Safer model

Use separate Vercel projects:

- `flyttbas-dev-web`
- `flyttbas-staging-web`
- `flyttbas-prod-web`

This reduces the chance of cross-environment variable mistakes at the hosting layer.

If strong isolation is the main goal, separate Vercel projects are the better operational choice.

## Phase 10: Seed data and test users

Create explicit seed content for dev and staging.

Development seeds should include:

- admin user
- partner test users
- customer test users
- sample quote requests
- sample offers
- sample dashboard data

Staging seeds should include:

- production-like but anonymized users
- realistic quote and offer flows
- test email recipients only

Rules:

- never manually reuse production auth users in lower environments
- never restore raw production backups into dev or staging without anonymization

## Phase 11: Access control and team workflow

Define who can access which environment.

Recommended policy:

- all developers: development
- QA or product stakeholders: staging
- limited admins only: production Supabase and production Vercel

Operational workflow:

1. Build feature locally against development.
2. Merge to `develop` and deploy to development.
3. Promote tested code to staging.
4. Validate auth, emails, edge functions, and analytics isolation in staging.
5. Promote to production.

## Phase 12: Observability and safety rails

Add checks that detect cross-environment mistakes early.

Recommended safeguards:

- visible environment banner in non-production UI
- environment name exposed in frontend config
- edge functions log environment name on startup
- email subjects prefixed in non-production, for example `[DEV]` and `[STAGING]`
- robots disabled or noindex on non-production deployments
- analytics disabled or isolated in non-production

These are small changes, but they prevent costly operator mistakes.

## Concrete Repo Changes Needed

The implementation work for this repo is likely:

1. Add `.env.example` and stop storing live environment values in tracked files.
2. Add `.env.development`, `.env.staging`, `.env.production` handling.
3. Update `.gitignore` to ignore real env files if they will stay local.
4. Refactor CI from a single production path to environment-aware jobs.
5. Create GitHub environment secret sets.
6. Provision three Supabase projects.
7. Deploy schema and functions to all three projects.
8. Configure environment-specific auth redirect URLs.
9. Configure environment-specific edge-function secrets.
10. Configure Vercel environment variables or separate Vercel projects.
11. Add seed data strategy for dev and staging.
12. Add non-production safeguards in the UI and email layer.

## Estimated Work Breakdown

If one person already knows Supabase, React, GitHub Actions, and Vercel, this is usually:

- infrastructure setup: 0.5 to 1.5 days
- CI/CD refactor: 0.5 to 1 day
- seed data and auth redirect cleanup: 0.5 to 1 day
- validation and rollout: 0.5 to 1 day

Realistic total:

- `2 to 4 days` for a solid first implementation
- `4 to 6 days` if you also want polished seed data, safer analytics separation, and deployment approvals

## Recommended Rollout Order

Do not change production first.

Recommended sequence:

1. Create `flyttbas-dev` and wire local development to it.
2. Make the frontend read environment-specific Vite files cleanly.
3. Make edge functions deploy to dev with dev secrets.
4. Create and validate staging.
5. Only after staging is proven, cut production over to the new environment-aware pipeline.

## Definition Of Done

The setup is complete when all of the following are true:

- local development builds against dev config only
- staging deploys against staging Supabase only
- production deploys against production Supabase only
- each Supabase project has different project ref, URL, publishable key, service role key, and database password
- edge functions are deployed separately per environment
- emails from dev and staging cannot be confused with production emails
- analytics from dev and staging do not pollute production reporting
- no production data is required for normal development
- CI secrets are stored per environment, not as one shared global set

## Recommended First Implementation Steps For This Repo

If implementation starts now, do these first:

1. Remove the single-environment assumption from tracked env handling.
2. Create three Supabase projects and capture their refs, URLs, anon keys, and DB passwords.
3. Create GitHub environments and move secrets into environment-scoped storage.
4. Split deployment automation by environment.
5. Validate one full user flow in dev, then staging, then production.
