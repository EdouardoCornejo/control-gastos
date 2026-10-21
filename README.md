# Control de Gastos

Expense tracker built with React and Vite. Set a budget, log your expenses by category and watch how much you have left in real time.

**Demo:** DEMO_URL

## Features

- Define a budget and track spent / available amounts with a circular progress indicator
- Add, edit (swipe right) and delete (swipe left) expenses
- Categories: savings, food, home, miscellaneous, leisure, health and subscriptions
- Filter expenses by category
- Data persisted in the browser's `localStorage` (no backend, nothing leaves your device)

## Tech stack

- [React 19](https://react.dev)
- [Vite 8](https://vite.dev)
- [react-circular-progressbar](https://github.com/kevinsqi/react-circular-progressbar)
- [react-swipeable-list](https://github.com/marekrozmus/react-swipeable-list)

## Getting started

Requirements: Node.js `^20.19.0 || >=22.12.0`.

```bash
npm install
npm run dev
```

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server             |
| `npm run build`   | Build for production into `dist/`        |
| `npm run preview` | Serve the production build locally       |

## Deployment

Deployed on [Vercel](https://vercel.com) as a static Vite site. Response headers (Content-Security-Policy and other security headers) are configured in `vercel.json`.
