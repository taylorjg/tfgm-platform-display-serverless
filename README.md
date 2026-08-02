# Description

AWS Lambda API for Manchester tram data, built with Serverless Framework v4 and TypeScript. Handlers query the [TfGM GraphQL API](https://apiary.tfgm.com) via `graphql-request` and expose simplified HTTP endpoints.

This repo is mainly the backend for [tfgm-platform-display](https://github.com/taylorjg/tfgm-platform-display), a web app that simulates a Metrolink platform dot-matrix display. The frontend calls these endpoints for stop search and live departure data.

## API

| Endpoint | Method | Query params | Description |
|---|---|---|---|
| `/search-locations` | GET | `searchKey` | Search tram stops by name |
| `/trams` | GET | `atcoCode`, optional `serviceIds`, `towards` | Get departures for a stop |

### Examples

```bash
# Search stops matching "road"
curl "https://<api-url>/search-locations?searchKey=road"

# Departures at St Werburgh's Road
curl "https://<api-url>/trams?atcoCode=9400ZZMASTW"

# Filter by line and direction (starts | ends)
curl "https://<api-url>/trams?atcoCode=9400ZZMASTW&serviceIds=Pink_Line,Navy_Line&towards=ends"
```

## Prerequisites

- Node.js 24 (see `.nvmrc`)
- AWS credentials configured for deploy (`profile: taylorjg` in `serverless.yml`)
- [Serverless Framework](https://www.serverless.com) v4 login or access key for CLI use

## Setup

```bash
npm ci
```

This project uses `legacy-peer-deps` (see `.npmrc`) because `graphql-request` has not yet widened its peer range to include GraphQL v17.

## Development

```bash
npm run lint          # ESLint (includes Prettier)
npm run typecheck     # TypeScript
npm run test          # Integration tests (live TfGM API)
```

### Invoke handlers locally

```bash
bash scripts/invoke-all-local.sh
```

Or invoke a single function:

```bash
npx serverless invoke local -f searchLocations \
  -d '{"queryStringParameters": {"searchKey": "road"}}'

npx serverless invoke local -f getTrams \
  -d '{"queryStringParameters": {"atcoCode": "9400ZZMASTW"}}'
```

Other helper scripts live in `scripts/`:

- `curl-all.sh` — hit the deployed API
- `invoke-all.sh` — invoke deployed Lambdas
- `test-filtering.sh` — test getTrams filtering scenarios (`1`, `2`, or `3`)
- `logs-all.sh` — tail CloudWatch logs

## Deploy

```bash
npm run deploy
npm run info
```

Deploy scripts set `SLS_AWS_SDK=3` for AWS SDK v3 compatibility with Serverless v4.

## CI

GitHub Actions runs on every push and pull request:

- lint, typecheck, and unit/integration tests
- `scripts/invoke-all-local.sh` against the live TfGM API

CI requires a repository secret named `SERVERLESS_ACCESS_KEY` for Serverless Framework v4 authentication.

## Project layout

```
src/
  handlers/       Lambda entry points
  queries/        GraphQL queries and response transforms
  network-map/    Tram line metadata for departure filtering
tests/            Handler integration tests
scripts/          Local invoke, curl, and log helpers
```

## Environment

| Variable | Source | Description |
|---|---|---|
| `TFGM_API_URL` | `serverless.yml` | TfGM GraphQL endpoint (`https://apiary.tfgm.com`) |
| `SERVERLESS_ACCESS_KEY` | CI secret / local env | Serverless Framework v4 authentication |
