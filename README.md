# Mutungo Ward Sacrament Meeting Planner

A focused, browser-based planner for preparing a clear sacrament meeting program. The app keeps meeting details, speakers, musical numbers, prayers, and program order in one calm workspace, then turns the finished plan into a print-ready program.

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Architectural decision / reflection

I chose a single-page React state model with a small, explicit `PlannerState` object rather than spreading meeting data across many unrelated form components or introducing a backend. The alternative would have been a multi-route flow or a database-backed API, but this assignment is a focused planning tool where the fastest path to a dependable review experience is local-first state with `localStorage` persistence. The program is an ordered array, so moving an item up or down is predictable, the preview reads from exactly the same source of truth as the editor, and a refresh does not lose a user's work. This approach also keeps the app easy to deploy as a static frontend while leaving room to add accounts and shared ward templates later.

## Challenge summary

The main challenge was balancing a detailed program editor with a print layout that still feels simple on a smaller screen. I handled that by using one shared data model, inline editing for the common fields, explicit move controls instead of fragile drag-and-drop, and a dedicated print stylesheet that removes editor chrome without requiring a separate print-only data path.

## AI summary

AI was used to help plan the component structure, refine the interaction copy, generate the initial React and CSS implementation, and review the code for accessibility, responsive behavior, and type-safety issues. I made the final product decisions, adjusted the sample meeting content for Mutungo Ward, and validated the production build.

## Submission links

- GitHub repository: https://github.com/devinephoebe433-eng/mutungo-sacrament-planner
- Required branch: `peer-code-review`
- Pull request: https://github.com/devinephoebe433-eng/mutungo-sacrament-planner/pull/1
- Vercel preview: pending Vercel account authentication; import the `peer-code-review` branch from the repository above
