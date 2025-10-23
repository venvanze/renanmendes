# Copilot Instructions for Renan Mendes Project

## Project Overview
- **Type:** React + TypeScript SPA, built with Vite, styled using Tailwind CSS.
- **Purpose:** Portfolio and professional video editor showcase for Renan Mendes.
- **Structure:**
  - `src/` contains all source code, organized by feature and UI component.
  - `public/` and `build/` hold static assets and build outputs.
  - Uses modular, reusable UI components (see `src/components/ui/`).

## Key Workflows
- **Development:**
  - Start dev server: `npm run dev` (Vite, port 3000 by default)
  - Build for production: `npm run build` (outputs to `build/`)
- **No explicit test scripts** (as of Oct 2025); focus is on manual and visual testing.

## Patterns & Conventions
- **Component Organization:**
  - UI primitives in `src/components/ui/` (e.g., `button.tsx`, `card.tsx`)
  - Section/page components in `src/components/sections/`
  - Navigation in `src/components/navigation/`
  - Figma asset integration in `src/components/figma/` and via Vite aliases
- **Styling:**
  - Tailwind CSS (`src/index.css`, `src/styles/globals.css`)
  - Custom classes and utility functions in `src/components/ui/utils.ts`
- **Data:**
  - Portfolio/project data in `public/content.json` and `build/content.json`
  - Data build script: `scripts/build_portfolio_data.py`
- **Aliases:**
  - Use `@/` for `src/` imports (see `vite.config.ts`)
  - Figma assets aliased for direct import in components

## Integration & Dependencies
- **Radix UI** for accessible UI primitives
- **Lucide, Embla, Sonner, Vaul, Recharts** for icons, carousels, notifications, dialogs, and charts
- **React Hook Form** for forms
- **No backend/server code**; all data is static or client-side

## Examples
- To add a new UI primitive, place it in `src/components/ui/` and follow the pattern of existing files.
- To update portfolio data, edit `public/content.json` and run the build script if needed.
- For Figma asset usage, import using the Vite alias (see `vite.config.ts`).

## Special Notes
- **No tests or CI/CD defined**; manual QA is expected.
- **No custom ESLint/Prettier config** found; follow TypeScript and Tailwind best practices.
- **All build and dev commands are npm-based.**

---
For more details, see `vite.config.ts`, `package.json`, and the `src/components/` directory structure.
