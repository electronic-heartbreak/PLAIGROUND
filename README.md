This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker

For local development, copy `example.env` to `.env`, then run:

```bash
docker compose --profile db up -d
npm run dev
```

Next.js uses `DATABASE_URL` from `.env` to connect to `localhost:5432`.
PostgreSQL's image does not initialize from a connection URL, so `.env` also sets
`POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` for the container.
If you change the credentials, update these variables and `DATABASE_URL` together.
Initialization settings only apply to an empty database volume.

Adminer is available at http://localhost:8080 with server `database`.

To run the app and database together in Docker:

```bash
docker compose --profile full up -d --build
```

Set the hostname in `.env`'s `DATABASE_URL` to `database` when running the app
inside Compose, and use `localhost` for commands running on the host.
The named volume preserves PostgreSQL data.

Build and run the production image:

```bash
docker build -t plaiground .
docker run --rm -p 3000:3000 plaiground
```

Open [http://localhost:3000](http://localhost:3000). To supply runtime environment
variables, add `--env-file .env` to `docker run` before the image name. Environment
files are excluded from the image build context. `NEXT_PUBLIC_*` variables are
inlined during the build and cannot be changed at runtime.

## Database (Drizzle)

The PostgreSQL setup follows the [Drizzle getting started guide](https://orm.drizzle.team/docs/get-started/postgresql-new)
using `node-postgres`. Table definitions live in `db/schema.ts`, Drizzle Kit
configuration in `drizzle.config.ts`. The schema starts empty, with no tables or
pre-created migrations. Future generated SQL migrations will live in `drizzle/`.

When you need your first table, define and export it from `db/schema.ts`. With
`DATABASE_URL` configured for your host and PostgreSQL running, generate and
review the migration before applying it:

```bash
npm run db:generate
npm run db:migrate
```

Commit the generated SQL and snapshots in `drizzle/`. `npm run db:push` is available
for disposable local databases; it changes the database without creating migration
files. `npm run db:studio` opens Drizzle Studio. Migrations are run separately from
application startup, using a development or deployment environment with the dev
dependencies installed.

Use `getDb()` only from Server Components, Route Handlers, or other server code
running in the Node.js runtime:

```ts
import { getDb } from "@/db";

const db = getDb();
// Query your tables here after defining them in db/schema.ts.
```

The server-only database module creates its connection pool on first use and
reuses it across development hot reloads. Next.js loads `.env` for the app;
Drizzle Kit loads it through `dotenv`. Keep `DATABASE_URL` private and unprefixed
by `NEXT_PUBLIC_`.

## Commit messages

Husky runs lint before each commit and validates commit messages with a
`commit-msg` hook. Use `type(topic): message` with one of the 10 allowed types and
one of the 10 allowed topics below. Both are required; any type can be combined
with any topic. The entire message, including any optional body, must be lowercase.
The subject and the message must not end with a dot.

| Type | Purpose |
| --- | --- |
| `feature` | Add functionality |
| `fix` | Correct a bug |
| `chore` | Perform routine maintenance |
| `docs` | Update documentation |
| `style` | Change code formatting |
| `refactor` | Restructure code without changing behavior |
| `perf` | Improve performance |
| `test` | Add or update tests |
| `build` | Change builds or packaging |
| `ci` | Change continuous integration |

| Topic | Area |
| --- | --- |
| `ui` | Interface and user experience |
| `api` | Endpoints and integrations |
| `auth` | Authentication and authorization |
| `database` | Data models, queries, and migrations |
| `documentation` | Guides and reference material |
| `dependencies` | Packages and dependency updates |
| `config` | Application configuration |
| `testing` | Test setup and coverage |
| `build-tools` | Build tooling and scripts |
| `infrastructure` | Hosting, containers, and deployment |

```text
feature(ui): add navigation menu
fix(documentation): correct setup instructions
chore(build-tools): update lint configuration
docs(documentation): explain local setup
ci(infrastructure): add deployment workflow
```

Hooks are installed automatically by `npm install` through the `prepare` script.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
