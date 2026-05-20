# BudgetSplit

Mobile-first web app for group expense splitting and personal budgeting.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app starts at `/splash`.

Component preview (development): `/dev/ui`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  app/          Application shell and routing
  pages/        Screen components
  components/   Shared UI and helpers
  styles/       Global styles and design tokens
  lib/          Utilities and constants
  types/        TypeScript types
  mocks/        Mock data (development)
```

## Design

UI is based on the [BudgetSplit Figma wireframes](https://www.figma.com/design/DAeOlvEG2xOdkj7HoEg7Kb/BudgetSplit-mobile-wireframes).
