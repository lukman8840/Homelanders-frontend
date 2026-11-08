# HomeLander frontend

HomeLander is a property marketplace focused initially on Abuja, Nigeria. This frontend currently
provides a responsive public landing and sample property-browsing experience, with route and layout
scaffolds for future account and dashboard features. All property listings are illustrative mock
data, not real offers.

## Technology

- React and TypeScript, built with Vite
- React Router DOM and TanStack Query
- Axios, React Hook Form, and Zod
- Tailwind CSS and Styled Components
- Lucide React
- ESLint and Prettier
- Vitest, React Testing Library, and jsdom

## Getting started

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
Copy-Item .env.example .env
npm run dev
```

The API base URL is configured with `VITE_API_BASE_URL` in `.env`; the example value points to
`http://localhost:8000/api`. The frontend does not assume a backend framework or specific endpoints.

## Development commands

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the Vite development server            |
| `npm run build`        | Type-check and create a production build     |
| `npm run preview`      | Preview the production build locally         |
| `npm run lint`         | Check code with ESLint                       |
| `npm run lint:fix`     | Automatically fix supported ESLint issues    |
| `npm run format`       | Format supported project files with Prettier |
| `npm run format:check` | Check formatting without changing files      |
| `npm test`             | Run the Vitest suite once                    |
| `npm run test:watch`   | Run Vitest in watch mode                     |

## Project structure

```text
src/
├── app/                 # App entry, router, providers, and shared layouts
├── assets/              # Static assets
├── components/
│   ├── common/          # Navbar, footer, and shared site components
│   ├── feedback/        # Loading and empty states
│   └── ui/              # Button, Input, Card, and Container
├── features/
│   ├── auth/
│   │   ├── components/   # Shared auth form UI and route guards
│   │   ├── context/      # Auth state provider and hook
│   │   ├── pages/        # Login, registration, recovery, verification
│   │   ├── schemas/      # Zod validation and tests
│   │   ├── services/     # Axios-backed service boundary and role mapping
│   │   └── types/        # Frontend auth model
│   ├── dashboard/        # Owner dashboard, properties, submission, verification
│   ├── messaging/        # Property conversations, message UI, and service boundary
│   ├── properties/       # Sample data, property UI, and browse/detail pages
│   └── ...               # Future marketplace features
├── hooks/               # Shared React hooks
├── lib/
│   └── api/             # Shared API client (not yet used by sample screens)
├── routes/              # Home and not-found pages
├── styles/              # Tailwind entry and design tokens
├── test/                # Test setup and test utilities
├── types/               # Shared TypeScript types
└── utils/               # Shared utility functions
```

### Routes and layouts

- `/`, `/properties`, and `/properties/:id` use the public website layout.
- `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/verify-email` use the auth
  layout. Forms validate input but report that the service is not configured until an API adapter
  is supplied.
- `/dashboard`, `/dashboard/properties`, and `/dashboard/profile` use the dashboard layout behind
  `ProtectedRoute`. They remain unavailable until the auth service confirms a session.
- `/dashboard/properties/new`, `/dashboard/properties/:propertyId`, and
  `/dashboard/properties/:propertyId/edit` provide the local-demo submission and verification
  workflow. `/dashboard/messages` provides the protected property conversation workspace.
- `/dashboard/kyc` and `/dashboard/kyc/submit` provide the protected KYC status and submission
  workflow.
- Unknown paths render the not-found page.

Routes are declared in `src/app/router/router.tsx`. New feature-specific components, pages, hooks,
types, schemas, and service code should live under that feature's folder. Keep genuinely shared
elements in `src/components`, `src/hooks`, `src/lib`, or `src/utils`.

### Authentication integration boundary

The auth UI, validation, provider, protected/role-based guards, and logout state transition are
prepared, but no authentication request or session persistence is implemented. The default service
throws an explicit configuration error instead of returning success-shaped mock data.

To integrate a backend, implement the `AuthApiContract` in
`src/features/auth/services/authService.ts` using the shared Axios client, normalize its response
to the frontend `AuthUser`, and inject the configured service through `AppProviders`. Keep
backend role identifiers in a `createAuthRoleMapper` mapping; the app does not assume backend role
names.

Before wiring the adapter, agree with the backend team on:

- Endpoint paths, HTTP methods, request fields, response shapes, and validation/error formats for
  login, registration, logout/session lookup, password reset, and email verification.
- Credential/session handling (for example, secure cookie or token strategy), persistence,
  expiry, refresh, and CSRF requirements.
- Backend role identifiers and their mapping to buyer, property owner, agent applicant, approved
  agent, and admin.
- Password and phone-number rules, verification-code/reset-token format and expiry, and the final
  Terms and Conditions URL/content.

### Adding a feature

1. Add only the needed `components`, `pages`, `hooks`, `services`, `types`, or `schemas` folders
   under the feature.
2. Keep feature-specific data and presentation with the feature; promote components to
   `src/components` only when they are shared.
3. Add route entries in `src/app/router/router.tsx` and choose the existing public, auth, or
   dashboard layout.
4. Add focused React Testing Library tests alongside the feature code.
5. Run `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`.

## Styling

Use Tailwind utilities for layout, spacing, responsive behavior, and common UI styling. Use
Styled Components for encapsulated component-specific styles that are awkward to express as
utilities. Shared colors, typography, radius, and shadow tokens are defined in
`src/styles/global.css` and exposed as CSS variables for both approaches. Keep the two approaches
complementary rather than restating the same styles.

## Current scope

Property content and verification labels are explicitly mock examples. Authentication forms
validate locally, but auth APIs and session management are intentionally not configured; protected
routes remain inaccessible by default. Do not connect uploads, payments, messaging, or other
backend endpoints until their API contracts are agreed.

### Property marketplace

The Abuja browse page reads filter state from the URL query string, applies search, district,
price, type, bedroom, and bathroom filters to the local illustrative dataset, then sorts and
paginated results. Property details use the same normalized model and include a sample image
gallery, features, listing metadata, and a disabled contact action. No mock listing is a real or
verified offer.

`src/features/properties/data/sampleProperties.ts` is the current UI data source.
`src/features/properties/services/propertyService.ts` defines the separate Axios adapter boundary;
its default implementation reports that the API is not configured rather than returning mock
success. To connect the backend, agree on listing/detail endpoints, query parameter names and
semantics, sorting/pagination strategy, response/error envelopes, price/currency representation,
image URLs and alt text, location and feature fields, listing status, verification statuses, and
owner/agent contact rules. Implement the adapter to normalize those responses to the frontend
`Property` and `PropertyFilters` types, then replace the page's sample-data source with the
configured service. Keep sample data separate for tests and previews.

### Property owner module

The owner dashboard and property list use explicitly marked local demo records from
`src/features/dashboard/services/propertyOwnerMockService.ts`. New submissions and drafts only
change that in-memory demo list; they are not sent to the backend and do not persist across reloads.
Selected ownership documents are kept in form memory only, are not previewed, uploaded, persisted, or
included in public property content. Image previews use temporary object URLs and are revoked when
the selection changes or the form unmounts. Only a mapped `verified` status is displayed as
verified; unknown backend status strings are shown as unavailable.

`src/features/dashboard/services/propertyOwnerService.ts` defines a separate Axios-backed service
contract and `propertyOwnerApiService` uses the shared Axios client. It intentionally has no default
endpoints or payload encoding. Before providing a `PropertyOwnerApiContract`, agree with the backend
team on:

- Owner-scoped property list and detail operations, including authorization, pagination, sorting,
  and error response shapes.
- Draft create/update behavior, property submission and resubmission operations, request fields,
  response normalization, and the permitted edit states.
- The frontend expects each normalized property to include an identifier, title, type, description,
  Naira asking price, bedroom/bathroom/toilet counts, size, features, state/city/neighbourhood and
  address, raw verification status, submission/update timestamps, and optional assigned verifier,
  admin feedback, and rejection reason. Submission input additionally includes selected image and
  ownership-document `File` objects; the adapter must follow the agreed upload contract.
- The authoritative verification status values and their mapping to the frontend labels Draft,
  Submitted, Pending Verification, Under Review, Verified, and Rejected.
- Submission timestamps, assigned verifier fields, admin feedback, rejection reasons, and the
  backend process that alone grants verified/public status.
- Image and ownership-document upload mechanism, storage rules, accepted formats and size limits,
  access controls, retention, private preview/download behavior, and whether uploads are separate
  requests or part of submission.

The current UI applies a 10 MB per-file client limit and allowed image/document MIME types as a
usability check, not as a substitute for backend validation. Status aliases live in
`src/features/dashboard/types/propertyOwner.ts` and can be adapted once backend values are
confirmed. Messaging, payments, agent verification, and admin review tools are not implemented.

The active data source is selected in
`src/features/dashboard/services/configuredPropertyOwnerService.ts`. It currently points to the
mock service. After implementing the backend contract and deciding upload behavior, switch this
single selection to `propertyOwnerApiService`; the screens then use its normalized owner-property
responses and will show real success feedback only when the adapter request resolves.

### KYC and identity verification

The KYC dashboard and four-step form are under `src/features/kyc`. KYC status is separate from
property verification. The local demo starts with a rejected sample status to demonstrate review
feedback and resubmission; successful demo submission changes only the in-memory status to Pending.
It does not retain personal fields or the selected document, send data to the backend, or represent
a completed backend submission. Approved and in-review KYC records cannot be edited in the UI.
Unknown raw backend status values display as unavailable and disable the submission action until
the status mapping is updated.

The form keeps personal information and the identity `File` in React form state only. It never uses
localStorage, logs identity fields, or includes document contents in preview links or public
property URLs. Document preview is opt-in and uses a temporary `blob:` URL revoked when the
selection changes or the form unmounts. The mock service stores only status and review metadata.
The default document upload service throws an explicit configuration error rather than simulating
an upload.

`src/features/kyc/services/kycService.ts` and `kycDocumentUploadService.ts` use the shared Axios
instance through injectable contracts without inventing endpoint paths, payload encoding, or upload
transport. Before backend integration, agree on:

- Authenticated current-user KYC status and submission/resubmission operations, access controls,
  methods/routes, status and response/error formats, and whether approved records can ever change.
- Required personal fields and document-specific identification-number rules; this UI's current
  required fields are illustrative and must be reconciled with the actual compliance contract.
- Private document upload mechanism, accepted formats/sizes, storage access, retention/deletion,
  secure document references, preview/download authorization, and whether upload is separate from
  KYC submission.
- The identity verification purpose and approved consent wording/privacy notice, status values,
  submitted/updated timestamps, administrator feedback, and rejection/resubmission rules.

The client-side 10 MB limit and PDF/JPG/PNG type checks are usability validation only. Backend
authorization, validation, secure storage, and document access controls remain required.

### Agent applications and property verification

The agent application is available to signed-in users at `/dashboard/agent-application`. The
approved-agent workspace is at `/agent/dashboard` and is wrapped in the existing role route for
`approved-agent`; this client-side route is only a UX guard and does not replace backend
authorization. Agent applications and task records are separate from KYC status.

The agent application starts with illustrative rejected demo status to expose feedback and
resubmission. Submitting changes only an in-memory application status and does not retain
application fields or supporting-document contents. Agent dashboard/tasks use separate mock
services. Task completion after an inspection report is distinct from final property verification:
the demo keeps final status pending, and an agent cannot mark a property verified.
Ownership-document contents are not surfaced in agent pages; the UI only displays a review status
and requires a backend-controlled private document access process.

Application, agent dashboard, inspection, and final verification Axios contracts are defined in
`src/features/agents/services/agentApplicationService.ts`,
`agentDashboardService.ts`, `src/features/verification/services/inspectionService.ts`, and
`verificationService.ts`. The active demo adapters are selected in
`src/features/agents/services/configuredAgentServices.ts`. Before integration, agree with the
backend on:

- Agent application status/detail and submission operations, required fields and supporting
  documents, validation/error responses, permitted resubmission rules, and status values.
- How approved agent privileges are assigned and enforced server-side. The client `approved-agent`
  role route is not an authorization boundary.
- Agent task assignment, task detail, accept/progress transitions, agent-to-task authorization,
  instructions, assigned dates, and task status values and transitions.
- A private, authorized ownership-document access mechanism, disclosure rules, audit requirements,
  and whether/how agents can view any document data.
- Inspection report fields, photo upload process, date/location rules, report editability, task
  completion responses, and the admin/backend decision workflow after report submission.
- The final verification response contract, including independent document review, inspection
  findings, agent notes, admin decision, and authoritative final status mapping.

The current form file checks are client-side usability checks only. No property inspection result
automatically approves a listing. Commissions, payments, and admin review tools are intentionally
out of scope.

### In-app messaging

The protected `/dashboard/messages` page groups conversations by property listing. Search, unread
counts, message timestamps, read-state display, history pagination, and mobile list/chat navigation
are implemented with reusable components. The property detail contact action opens the page with a
`propertyId` query parameter so the selected listing is attached to the conversation.

The active implementation in `src/features/messaging/services/configuredMessagingService.ts` uses
in-memory illustrative conversations. Starting or sending a demo conversation does not contact a
real owner, persist across reloads, or represent delivery to another user. The messaging service
and realtime subscription have separate interfaces; `messagingApiService` uses the shared Axios
instance only when a backend contract adapter is supplied. No endpoint paths, payloads, response
shapes, or transport protocol are assumed.

Before backend integration, agree on:

- Authenticated conversation listing, property-based conversation creation, message history and
  pagination, message send, and read/unread operations, including routes, methods, request/response
  formats, and error handling.
- Server-side authorization for participants and property associations, listing contact rules, and
  how the current user's identity and participant roles are represented.
- Message delivery/read status semantics, timestamps/time zone, ordering, duplicate/retry behavior,
  and whether message editing/deletion or attachments are in scope.
- Realtime transport (for example WebSocket or another selected technology), authentication,
  subscription authorization, event shape, reconnection behavior, and fallback/polling behavior.

Frontend route guards are not a security boundary; backend authorization must enforce access to
every conversation and message. Attachments and notifications are not implemented.
