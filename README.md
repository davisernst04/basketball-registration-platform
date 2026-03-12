# Shadow Basketball Registration Platform

Registration platform for Shadow Basketball tryouts. The application provides a public registration flow for families and an administrative dashboard for managing tryout sessions and registrations.

## Overview

The project is built to handle the core workflow around basketball tryouts:

- publish upcoming tryout sessions
- collect player registrations from parents or guardians
- manage registrations through an internal dashboard
- support account-based access for staff and families

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

## Features

### Public and family-facing

- Landing page aligned with the program brand
- Public tryout schedule
- Registration form for player and guardian details
- Parent account flows for sign-in and account access

### Administrative

- Dashboard for managing tryout sessions
- Registration listing and review
- Session creation and capacity management
- Search and filtering for registrations

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/davisernst04/basketball-registration-platform.git
cd basketball-registration-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 4. Apply database migrations

Use the Supabase dashboard or CLI to apply the SQL files in `supabase/migrations/`.

### 5. Start the development server

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/` - landing page
- `/register` - registration form
- `/tryouts` - public tryout schedule
- `/dashboard` - staff dashboard
- `/profile` - account profile
- `/sign-in` - authentication
- `/sign-up` - account creation
- `/confirmation` - registration confirmation

## Project Structure

```text
basketball-registration-platform/
├── app/
├── components/
├── lib/
├── public/
├── supabase/
│   └── migrations/
├── tests/
├── types/
└── utils/
```

## Development

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run test` - run tests
- `npm run lint` - run ESLint

## Notes

Brand styling and team-specific copy can be adjusted in the app routes and shared components. Database changes are managed through the Supabase migration files included in the repository.
