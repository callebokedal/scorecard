# CLAUDE.md – Project Conventions for Golf Scorecard app

## Language
- All code, comments, variable names, function names, and documentation must be written in **English**
- UI text (labels, placeholders, messages) should also be in English unless otherwise specified

## Technical Stack
- **React 18** with **JavaScript** (no TypeScript)
- **Vite** as build tool
- **Tailwind CSS** for styling (utility classes only, no custom CSS files unless necessary)
  - **UI style** should be based on https://ui.shadcn.com/docs/components style
- **React Query (TanStack Query v5)** for server state management
- **Zustand** for client/local state management
- **React Router v6** for routing
- **react-i18next** for internationalization

## Container-First Development
- The application runs inside a **Podman** container
    - Only suggest up-to-date, secure and stable images and containers
- No direct dependency on the host Node.js or npm installation
- All development commands are run via `podman-compose` or `podman` directly
- The `Containerfile` (not `Dockerfile`) is the source of truth for the runtime environment

## Project Structure
```
src/
  assets/          # Static assets (icons, images)
  components/      # Reusable UI components (not page-specific)
    common/        # Generic components (Button, Modal, Badge, Markers etc.)
    layout/        # Layout components (Sidebar, Header, Panes, etc.)
  features/        # Feature-based modules, one folder per domain
    <feature>/     # ...
    settings/      # User settings
  hooks/           # Shared custom hooks
  pages/           # Route-level page components (thin, delegate to features)
  services/        # Data access layer (import/export, local storage, API)
  store/           # Zustand store definitions
  types/           # JSDoc type definitions and shared constants
  utils/           # Pure utility/helper functions
```

## Code Conventions
- **Functional components only** – never class components
- **Named exports** – never default exports (except for pages used by React Router)
- **One component per file**
- **No inline styles** – use Tailwind classes exclusively
- Props must be documented with JSDoc `@param` comments for complex components
- Avoid deeply nested ternaries – extract to variables or helper functions

## State Management
- **React Query** for anything fetched from an external source or that needs caching/sync
- **Zustand** for UI state and local app state
- **Local component state** (`useState`) for purely local UI state (e.g., open/closed modal)
- Do not put server state into Zustand

## File Naming
- Component files: `PascalCase.jsx`
- Hook files: `camelCase.js`, prefixed with `use` 
- Store files: `camelCase.store.js`
- Service files: `camelCase.service.js` (e.g., `<project>.service.js`)
- Utility files: `camelCase.js`

## What to Avoid
- No TypeScript (use JSDoc for type hints if needed)
- No Redux or MobX
- No CSS Modules or styled-components – Tailwind only
- No class components
- No default exports (except route-level pages)
- No host-level `npm install` – always run inside container

## Scoring Logic
- Scoring system is **Stableford**
- Playing handicap per player is calculated from the player's HCP and the course slope rating
- HCP strokes are distributed across holes based on each hole's slope index (1 = hardest, 18 = easiest)
  - A player with playing HCP 18 gets 1 extra stroke on every hole
  - A player with playing HCP 10 gets 1 extra stroke on the 10 holes with the lowest slope index
- Stableford points per hole: `points = par + hcpStrokes - strokesPlayed + 2` (clamped to min 0)
  - Eagle or better = 4p, Birdie = 3p, Par = 2p, Bogey = 1p, Double bogey or worse = 0p
- Both strokes played and Stableford points are always shown per hole in the scorecard view
- When no course is selected, HCP and points calculations are disabled (strokes only)

## For all prompts
- If important features are added or implemented that is not covered in [CLAUDE.md] (this file) or [readme.md], please suggest these files with short documentation - keeping them up to date with the functionality and architecture of the app.
- Create test cases for important functionality.