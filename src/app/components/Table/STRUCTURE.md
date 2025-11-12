# TableNew Component Structure

## Component Hierarchy

```
FixtureTable (exported from Table.tsx)
├── QueryClientProvider
│   └── Table (internal component)
│       ├── TableControls
│       │   ├── Sort by Offense/Defense toggle buttons
│       │   └── Prev/Next gameweek navigation
│       │
│       └── table (HTML element with overflow scroll)
│           ├── TableHeader
│           │   └── th elements (Team + gameweek columns)
│           │
│           └── tbody
│               └── TableRow (one per team)
│                   ├── Team cell (logo + name)
│                   └── TableCell (one per gameweek in window)
│                       └── Fixture display (H:/A: opponent)
```

## Data Flow

```
useFixtures(season)                useTeams(season)
        │                                  │
        └──────────────┬──────────────────┘
                       │
                    Table Component
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        │              │              │
   Compute        TableControls   TableHeader
   min/max          & window       & handleSort
        │              │              │
        └──────────────┼──────────────┘
                       │
                   TableRow (×teams)
                       │
        ┌──────────────┴──────────────┐
        │                             │
   Team Cell                    TableCell (×gameweeks)
   (aggregates first 5)             │
        │                    ┌───────┴────────┐
        │                    │                │
    fixtureForTeamInWeek    getAttack    getDefense
        │                    │                │
        └────────────────────┼────────────────┘
                             │
                    Difficulty & Color
```

## File Structure

```
TableNew/
├── Table.tsx                 (Main container, state mgmt, sorting)
├── TableHeader.tsx           (Column headers)
├── TableRow.tsx              (Team rows)
├── TableCell.tsx             (Individual fixture cells)
├── TableControls.tsx         (Navigation & sort controls)
├── utils.ts                  (Difficulty calculations)
├── index.ts                  (Exports)
├── implementation.md         (Original specification)
├── README.md                 (User documentation)
├── IMPLEMENTATION_SUMMARY.md (Implementation details)
└── STRUCTURE.md              (This file)
```

## Component Responsibilities

### Table.tsx (~158 lines)
- ✅ QueryClientProvider wrapper
- ✅ State: window, sortBy, sortDirection, sortColumn
- ✅ Data fetching coordination
- ✅ Min/max gameweek calculation
- ✅ Window navigation logic
- ✅ DOM-based sorting implementation
- ✅ Sort direction & column toggling

### TableControls.tsx (~75 lines)
- ✅ Offense/Defense toggle buttons
- ✅ Prev/Next gameweek buttons
- ✅ Window range display
- ✅ Button state management (enabled/disabled)

### TableHeader.tsx (~33 lines)
- ✅ "Team" column header (column 0)
- ✅ Gameweek headers (GW n) (columns 1+)
- ✅ Click handlers for sorting

### TableRow.tsx (~95 lines)
- ✅ Team logo & name display
- ✅ Aggregate stats calculation (first 5 GWs)
- ✅ Data attributes for sorting
- ✅ Maps TableCell for each gameweek

### TableCell.tsx (~84 lines)
- ✅ Fixture display (H:/A: format)
- ✅ Multiple fixture handling
- ✅ Blank gameweek display
- ✅ Difficulty color coding
- ✅ Data attributes for sorting

### utils.ts (~78 lines)
- ✅ initDifficultyModel() - League mean calculation
- ✅ fixtureForTeamInWeek() - Fixture filtering
- ✅ getAttack() - Attack calculation & difficulty
- ✅ getDefense() - Defense calculation & difficulty
- ✅ Helper: squash() - Sigmoid normalization
- ✅ Helper: combineWeightedOffense() - Multi-match probability
- ✅ Helper: combineWeightedDefense() - Multi-match probability

## State Management

### Table Component State
```typescript
// Gameweek window (start, end inclusive)
const [window, setWindow] = useState([1, 11])

// Sorting mode: "offense" | "defense"
const [sortBy, setSortBy] = useState("offense")

// Sort direction: "asc" | "desc"
const [sortDirection, setSortDirection] = useState("desc")

// Sort column index (-1 = none)
const [sortColumn, setSortColumn] = useState(-1)
```

## Styling

### Colors (Tailwind)
- **Easy**: `bg-lime-300` (green)
- **Medium**: `bg-neutral-100` (gray)
- **Hard**: `bg-red-300` (red)
- **Invalid**: `bg-neutral-50` (light gray)

### Layout Classes
- **Table**: `table-auto w-full border-separate border-spacing-x-2 border-spacing-y-4`
- **Cell**: `h-14 px-2 py-1 text-center text-sm align-middle rounded-md`
- **Team Cell**: `px-2 py-2 text-left min-w-48 text-sm font-semibold border-b border-gray-200`
- **Scroll Container**: `overflow-x-auto whitespace-nowrap`

## Data Attributes Used for Sorting

### TableCell
```html
<td 
  data-offense="0.45"
  data-defense="0.62"
  data-offense-difficulty="medium"
  data-defense-difficulty="easy"
/>
```

### TableRow (Team Cell)
```html
<td 
  data-team-id="1"
  data-offense="2.15"
  data-defense="3.10"
/>
```

## Constants

```typescript
const SEASON = "2025-2026"      // Season identifier
const WINDOW_SIZE = 10           // Gameweeks shown at once
const WEEKS_FOR_AGGREGATE = 5   // First 5 weeks for team stats
```

## Performance Profile

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Initial Render | O(T × G) | T teams, G gameweeks in window |
| Sort | O(T × log T) | DOM sort on team rows |
| Window Change | O(G) | Re-render visible gameweeks |
| Data Fetch | O(1) | Cached by React Query |

Where T ≈ 20 teams, G ≈ 10 gameweeks

## Integration Example

```tsx
// pages/fixtures.tsx
import { FixtureTable } from "@/app/components/TableNew";

export default function FixturesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fixture Difficulty</h1>
      <FixtureTable />
    </div>
  );
}
```

## Removed Features (Original → New)

| Feature | Status | Reason |
|---------|--------|--------|
| TableCellMenu | ❌ Removed | Out of scope per requirements |
| Context menu on right-click | ❌ Removed | Out of scope per requirements |
| Fixture dragging/moving | ❌ Removed | Out of scope per requirements |
| Dynamic fixture editing | ❌ Removed | Out of scope per requirements |

## Error Handling

```typescript
// Missing data
if (!fixturesQuery.data || !teamsQuery.data) return null

// Empty gameweeks
- Returns empty array from fixtureForTeamInWeek()
- Displays "-" in cell

// No fixtures in season
- getMinMax() returns [1, 1]
- Window defaults to [1, 1]
```

## Browser Compatibility

- ✅ Modern browsers with ES2020+ support
- ✅ CSS Grid/Flexbox support
- ✅ Tailwind CSS v3+
- ✅ React 18+
- ✅ Next.js 13+ (App Router)