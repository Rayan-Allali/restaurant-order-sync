# Restaurant Order Sync

An offline first restaurant order management API built with Express.js, TypeScript, SQLite and PostgreSQL.

The app is designed to keep the restaurant running in the event of a loss of internet connection or loss of the cloud database. All order operations are first stored locally in SQLite and then automatically synced up to the remote PostgreSQL database when connectivity is restored.

## Features

- Offline first architecture: orders are stored locally in SQLite so the API can work completely offline.
- Automatic synchronisation: pending orders are synced to the cloud PostgreSQL database in the background.
- Retry mechanism: failed sync attempts will be retried automatically with exponential backoff.
- Idempotent sync: the PostgreSQL UPSERTS will prevent duplicate orders in the case of a retry of the sync.
- Order versions are used to track versions and this helps to prevent an out of date sync attempt from overwriting a more recent local change.
- REST API: endpoints for creating, retrieving and updating restaurant orders.
- **API documentation:** Interactive Swagger UI docs.

## Architecture

The application uses two databases:

- SQLite: the local source of truth for the incoming API operations.
- PostgreSQL (Neon): the remote cloud database that's receiving the synchronised order data.

### Synchronization flow

1. A client sends over an order create or order update.
2. The API validates the request and then persists the changes to SQLite.
3. The local operation succeeds irrespective of cloud availability.
4. The sync worker picks up any pending changes and attempts to sync those with PostgreSQL.
5. Following a successful cloud write the local order is marked as synchronised.
6. If sync fails the order stays in 'pending' and will be retried automatically.

Cloud sync never blocks the API response.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Backend:** Express.js
- **Local Database:** SQLite with better-sqlite3
- **Cloud Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Validation:** express-validator
- **Documentation:** Swagger / OpenAPI
- **Code Quality:** Biome

## Getting Started

### Prerequisites

- Node.js
- pnpm
- A PostgreSQL database (Neon or another PostgreSQL instance)

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

Install dependencies:

```bash
pnpm install
```

### Environment Variables

Create a .env file in the project root, using the .env.example file as a guide.

### Database Migrations

The project uses Drizzle ORM for its schema and migration management. There are separate schema and migration files for SQLite and PostgreSQL.

**SQLite migrations:**

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

**PostgreSQL migrations:**

```bash
# Generate migrations
pnpm db:generate:pg

# Apply migrations
pnpm db:migrate:pg
```

Ensure your environment variables are all set up prior to running the migrations, in particular the postgresql connection string.

### Code Quality

The project uses Biome for code formatting and linting.

```bash
# Format all files
pnpm format

# Check formatting without modifying files
pnpm format:check

# Run lint checks
pnpm lint

# Run formatting and lint checks
pnpm check

# Automatically apply available formatting and lint fixes
pnpm fix
```

### Run the Application

Development:

```bash
pnpm dev
```

Production build and startup:

```bash
pnpm build
pnpm start
```

## API Documentation

Once the application is running, access the interactive API documentation at:

```text
http://localhost:3000/api-docs
```

The generated OpenAPI specification is also available at:

```text
http://localhost:3000/api-docs.json
```

## Reliability and Design Decisions

- Local persistence is preferred to cloud availability.
- The API doesn't wait for remote sync to complete before it returns a response.
- Failed sync attempts don't wipe the locally stored orders.
- Exponential backoff is used to prevent us from doing too many retry attempts whilst the cloud database is down.
- Version checks will prevent an older sync attempt from marking a newer local order version as synced.

## Limitations

- The current implementation assumes there is a single local application instance.
- Multi-device conflict resolution is outside the remit of this implementation.

## License

This project was developed as part of a technical assessment.
