# Build Together

Build Together is a no-database MVP for helping developers, designers, founders, and creators find teammates and ship projects together.

## What is included

- React, Vite, Tailwind CSS, Framer Motion, and React Router frontend.
- Mock auth with register, login, logout, protected routes, email verification UI, and forgot password UI.
- LocalStorage-backed services for users, projects, join requests, and notifications.
- Project browse, search, filters, details, save project, join request, create project, dashboard, profile, notifications, settings, and team chat demo pages.
- JSON seed data in `src/data`.
- Express mock API scaffold in `server` for future backend integration.

## Demo Login

- Email: `aarav@example.com`
- Password: `password123`

## Run Frontend

```bash
npm install
npm run dev
```

## Run Mock API

```bash
cd server
npm install
npm run dev
```

The current frontend uses localStorage services so it works without the Express server. The service layer is kept separate so MongoDB, JWT auth, and real APIs can be added later.
