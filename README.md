# qpp-measures-client

This is at st multi-tool UI interface for the qpp-measures-data repo build on NextJS. This currently supports the following tools:

- Measures Explorer - Web app for searching qpp-measures-data json by performance year.
- MVP Factory - Web app for building out MVPs with form validation.

## Getting Started

Install the deps

```bash
npm install
# or 
yar n
```

Running the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Building static files for S3

```bash
npm run build
```

Healthcheck can be accessed on [http://localhost:3000/api/health](http://localhost:3000/api/health). This endpoint can be edited in `pages/api/health.ts`. (Not accessible via static build)

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


## Tooling

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [MobX-State-Tree](https://mobx-state-tree.js.org/) - Observer pattern based store for React with good defaults.