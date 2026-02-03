# Pizza Project

## Project Architecture

This project follows a **Clean Architecture** (Layered Architecture) pattern to ensure separation of concerns and maintainability.

### Core Layers

- **Domain Layer** (`src/domain`): Contains the core business logic and entities (e.g., `OrderService`, `orderState`). This layer is framework-independent.
- **Infrastructure Layer** (`src/infrastructure`): Handles data persistence and external services. It implements the repositories defined by the domain requirements (e.g., `FileOrderRepository`).
- **Presentation Layer** (`src/app`): Built with Next.js App Router. It handles API routes and UI components, interacting with the domain layer.

### Data Persistence

The project uses a **File-based Database** system located in `src/data/`.

- Data is stored in JSON files (`orders.json`, `notifications.json`, etc.).
- The `FileOrderRepository` handles read/write operations with a locking mechanism to prevent race conditions.

## Project Structure

```
src/
├── app/              # Next.js App Router (Presentation Layer)
│   ├── api/          # API Routes (Admin, Orders)
│   └── components/   # React UI Components
├── domain/           # Business Logic (Pure JS, Framework Independent)
├── infrastructure/   # Data Access (Repositories)
├── data/             # JSON Storage (Database)
├── types/            # JSDoc Types & Models
└── lib/              # Shared Utilities
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
