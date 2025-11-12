# TableNew Component

A clean, reusable fixture difficulty table component for Fantasy Premier League (FPL).

## Overview

The TableNew component displays team fixtures across gameweeks with color-coded difficulty ratings. It features:

- **Sortable columns** - Click headers to sort by team or gameweek
- **Difficulty color coding** - Green (easy), Gray (medium), Red (hard), Light gray (no fixture)
- **Window navigation** - View 10 gameweeks at a time with prev/next controls
- **Offensive/Defensive metrics** - Toggle between attacking and defensive difficulty views
- **Responsive design** - Horizontal scrolling for large screens

## Architecture

### Components

1. **Table.tsx** - Main container and state management
   - Manages window range, sort settings, and column state
   - Implements DOM-based sorting logic
   - Wraps component tree with QueryClientProvider

2. **TableHeader.tsx** - Column headers
   - Renders "Team" column and gameweek columns (GW n)
   - Handles sort column selection

3. **TableRow.tsx** - Team rows
   - Displays team logo and name
   - Renders TableCell for each gameweek
   - Calculates aggregate stats for first 5 gameweeks (used for team row sorting)

4. **TableCell.tsx** - Individual fixture cells
   - Displays fixture(s) for a team in a gameweek
   - Shows home/away opponents with short names
   - Color-codes based on difficulty

5. **TableControls.tsx** - Navigation and sorting controls
   - Toggle buttons for "Sort by Offense" / "Sort by Defense"
   - Previous/Next gameweek buttons
   - Current window range display

### Utilities

**utils.ts** - Difficulty calculations
- `initDifficultyModel()` - Initialize league mean for calculations
- `opponetsForTeamInWeek()` - Get opponents for a team in a specific gameweek
- `getAttack()` - Calculate attacking potential and difficulty
- `getDefense()` - Calculate defensive strength and difficulty
- Helper functions: `squash()`, `combineWeightedOffense()`, `combineWeightedDefense()`

## Usage

```tsx
import { FixtureTable } from "@/app/components/TableNew";

export default function Page() {
  return <FixtureTable />;
}
```

## Data Flow

1. **Data Fetching** - Each component fetches `useFixtures()` and `useTeams()` data
2. **Difficulty Calculation** - League mean is calculated from all team ratings
3. **Fixture Lookup** - Fixtures are filtered by team_id and gameweek
4. **Stats Calculation** - Attack/defense stats are computed for each cell
5. **Color Mapping** - Difficulty rating maps to Tailwind color class
6. **Sorting** - DOM-based sorting reads data attributes from cells

## Constants

- `SEASON = "2025-2026"` - Season identifier
- `WINDOW_SIZE = 10` - Number of gameweeks displayed at once

## Styling

All components use Tailwind CSS for styling:

- **Table** - `table-auto w-full border-separate border-spacing-x-2 border-spacing-y-4`
- **Cells** - `h-14 px-2 py-1 text-center text-sm align-middle rounded-md`
- **Team cell** - `px-2 py-2 text-left min-w-48 text-sm font-semibold border-b border-gray-200`
- **Controls** - Border group with toggle buttons and navigation

## Difficulty Colors

| Difficulty | Color | Tailwind Class |
|---|---|---|
| Easy | Green | `bg-lime-300` |
| Medium | Gray | `bg-neutral-100` |
| Hard | Red | `bg-red-300` |
| Invalid (no fixture) | Light Gray | `bg-neutral-50` |

## Fixture Display Format

- **Home fixture** - `H:{opponent_short_name}`
- **Away fixture** - `A:{opponent_short_name}`
- **No fixture** - `-` (gray text)
- **Double gameweek** - Multiple fixtures stacked vertically

## Performance Notes

- Uses React Query for automatic caching and refetching
- Sorting uses DOM manipulation (suitable for ~20 teams)
- Fixtures data is keyed by team_id for O(1) lookup
- Consider memoization if performance issues arise

## Removed Features

This is a clean reimplementation that intentionally excludes:
- TableCellMenu context and right-click menus
- Fixture editing/dragging functionality

## Future Enhancements

Potential improvements (not in current scope):
- Server-side sorting for larger datasets
- Virtualization for performance at scale
- Export functionality (CSV, PDF)
- Fixture management/editing
- Mobile responsive card layout
- Team/opponent filtering
