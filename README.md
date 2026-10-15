# Shipping Bill Frontend

A focused refactor of the existing Shipping Bill creation workflow. The application remains a frontend-only demo and does not require a live backend.

## Setup

This repository uses the `fe-zen-arch` Git submodule. Clone the repository and initialize submodules before installing dependencies:

```bash
git clone --recurse-submodules https://github.com/satviktyagi12/assignment-01.git
cd assignment-01
pnpm install
pnpm dev
```

If the repository has already been cloned without submodules, run:

```bash
git submodule update --init --recursive
```

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint-check
```

The existing stack and workspace aliases are retained. No new runtime or development dependencies are introduced by this refactor.

## Structure and responsibilities

- `src/shipping-bills/shipping-bill-form.tsx`: form UI, field-array interactions, tab navigation, and UI feedback.
- `src/shipping-bills/shipping-bill-validation.ts`: form schema and field validation rules.
- `src/shipping-bills/shipping-bill-mock-service.ts`: asynchronous Promise-based mock operations for listing bills, saving drafts, and submitting bills.
- `src/shipping-bills/party-mock-service.ts`: asynchronous search/lookup methods for exporters, businesses, branches, and ports.
- `src/shipping-bills/demo-store.ts`: local demo data and persistence.
- `src/shipping-bills/shipping-bill-service.ts`: existing HTTP adapter and flat-file export behavior. The form uses the mock service so the core workflow can run without a backend.

The mock service is the boundary the UI calls for bill loading and saving. A real API-backed implementation can later replace that boundary without making UI components responsible for HTTP details.

## Mock data and assumptions

This is a focused refactoring exercise, not a production customs platform. Sample parties, ports, bills, and reference options are demonstration data. Submission validates key field relationships (selected parties and branches, route ports, invoices, and positive item quantity/pricing) before persisting the draft to the local demo store.

Local storage is used to keep demo changes between reloads in the current browser. Clear the browser storage key `export-software-shipping-bills-v2` to reset those saved demo changes.

## AI Usage & Approach

ChatGPT was used to assist with code review and implementation. The changes are kept focused on the existing form: extract validation from the UI, introduce an asynchronous mock-service boundary for list/draft/submit operations, make submission feedback explicit, and expose loading, empty, and error states where relevant. No dependencies were added. The implementation should be reviewed and validated with the build and lint commands above before submission.
