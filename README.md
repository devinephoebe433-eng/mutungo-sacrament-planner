# Mutungo Ward Sacrament Meeting Planner

A calm, print-ready workspace for preparing a clear Sunday sacrament meeting program. The planner keeps meeting details, prayers, hymns, speakers, musical numbers, and service order together in one responsive interface.

**Production:** [mutungo-sacrament-planner.vercel.app](https://mutungo-sacrament-planner.vercel.app)  
**Repository:** [github.com/devinephoebe433-eng/mutungo-sacrament-planner](https://github.com/devinephoebe433-eng/mutungo-sacrament-planner)

## Features

- Edit meeting date, time, location, presiding leader, conducting leader, and prayers.
- Add, edit, reorder, and remove speakers and musical numbers.
- Save the current order of service as a reusable local template.
- Persist planner work in the browser with `localStorage`.
- Preview a congregation-facing program and print it with editor chrome removed.
- Responsive layouts for desktop, tablet, and mobile screens.
- Accessible labels, focus states, button names, and live announcements for save and action feedback.

## Tech stack

- React 19 with TypeScript
- Vite 8
- Plain CSS with responsive media queries
- Browser `localStorage` for the current local-first persistence boundary
- Vercel for production hosting

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To validate a production build:

```bash
npm run typecheck
npm run build
npm run preview
```

## Project structure

```text
src/
  App.tsx       Planner state, editing interactions, preview, and print actions
  main.tsx      React entry point
  styles.css    Design tokens, responsive layout, and print styles
public/         Static assets
index.html      Document metadata and application entry point
```

The application intentionally uses one explicit `PlannerState` object. The editor and print preview read from the same state, which prevents the two views from drifting apart. The local persistence boundary is isolated behind the `STORAGE_KEY` constant so a future authenticated API or database can replace it without changing the visual workflow.

## Accessibility and UX decisions

Form controls use visible labels, interactive controls expose meaningful accessible names, keyboard focus is visible, and save/action feedback is announced with `role="status"` and `aria-live`. Reordering uses explicit move buttons rather than drag-and-drop so the workflow remains usable with a keyboard and on touch devices. The print stylesheet removes navigation and editing controls while preserving the program content.

## Deployment

The production deployment is connected to the `main` branch on Vercel. Pull requests receive preview deployments automatically when the Vercel GitHub integration is enabled.

## Reflection

The main design challenge was balancing a detailed program editor with a simple print layout on small screens. A shared data model, inline editing, explicit move controls, and a dedicated print stylesheet keep the workflow predictable. AI assisted with component planning, interaction copy, accessibility review, responsive CSS ideas, and build troubleshooting; final implementation decisions and validation were completed against the project requirements.

## License

This repository is an educational project for BYU-Pathway Worldwide coursework.
