# FDR Table Component - Refactored Architecture

## Overview

This is a refactored implementation of the Fixture Difficulty Rating (FDR) table with improved maintainability, performance, and mobile support. The architecture follows a clear separation of concerns with dedicated layers for data management, business logic, and presentation.

## Key Improvements

1. **Single Source of Truth**: All difficulty calculations happen once in the data layer
2. **No Duplicate Calculations**: Components receive precomputed data instead of recalculating
3. **Context-Based Data Sharing**: Eliminates prop drilling and ensures data consistency
4. **Mobile-First Design**: Full mobile view with vertical cards alongside desktop table
5. **Responsive Switching**: Automatic view switching based on screen size (1024px breakpoint)
6. **Better Performance**: Memoization prevents unnecessary recalculations
7. **Improved Testability**: Business logic separated from UI components
8. **Type Safety**: Comprehensive TypeScript types throughout

## Directory Structure

```
FDRTable/
├── context/
│   └── FDRDataProvider.tsx          # Central data provider with React Query
│
├── hooks/
│   ├── useDifficultyScores.ts       # Precomputes all difficulty scores
│   ├── useFDRControls.ts            # UI state management
│   ├── useMediaQuery.ts             # Responsive breakpoint detection
│   └── index.ts
│
├── utils/
│   ├── difficulty.ts                # Core difficulty calculation functions
│   ├── sorting.ts                   # Team sorting utilities
│   ├── colors.ts                    # Color mapping for difficulty levels
│   └── index.ts
│
├── desktop/
│   ├── Table.tsx                    # Desktop table wrapper
│   ├── TableHeader.tsx              # Sortable table header
│   ├── TableRow.tsx                 # Team row with fixtures
│   ├── TableCell.tsx                # Individual fixture cell
│   ├── TableControls.tsx            # Desktop controls
│   └── index.ts
│
├── mobile/
│   ├── CardList.tsx                 # Mobile card list wrapper
│   ├── TeamCard.tsx                 # Individual team card
│   ├── FixtureRow.tsx               # Single gameweek fixture
│   ├── MobileControls.tsx           # Mobile-optimized controls
│   └── index.ts
│
├── shared/
│   ├── DifficultyBadge.tsx          # Colored difficulty indicator
│   ├── OpponentChip.tsx             # Opponent display with H/A
│   ├── LegendPanel.tsx              # Color legend
│   └── index.ts
│
├── FDRTableContainer.tsx            # Main container with view switching
├── index.tsx                        # Entry point with providers
├── types.ts                         # TypeScript type definitions
└── README.md                        # This file
```

## Architecture Layers

### 1. Data Layer (`context/`)

**FDRDataProvider**: Central provider that:
- Wraps React Query hooks for teams, fixtures, and gameweek data
- Initializes difficulty model once at the top level
- Computes all difficulty scores via `useDifficultyScores`
- Exposes data through context to avoid prop drilling
- Handles loading and error states centrally

### 2. Business Logic Layer (`hooks/`, `utils/`)

**Hooks**:
- `useDifficultyScores`: Precomputes ALL difficulty scores for all teams/gameweeks
- `useFDRControls`: Manages UI state (window, sorting, range)
- `useMediaQuery`: Detects screen size for responsive switching

**Utils**:
- `difficulty.ts`: Core math functions (squash, combineWeighted, calculations)
- `sorting.ts`: Team sorting by gameweek or range
- `colors.ts`: Color mapping for difficulty levels

### 3. Presentation Layer (`desktop/`, `mobile/`, `shared/`)

**Desktop Components**:
- Horizontal scrolling table view
- Sortable columns by clicking headers
- Sticky team name column
- Compact design for large datasets

**Mobile Components**:
- Vertical stacked cards
- Each card shows one team with all fixtures
- Touch-friendly controls
- Better for narrow screens

**Shared Components**:
- `DifficultyBadge`: Color indicator used in both views
- `OpponentChip`: Displays opponent with H/A indicator
- `LegendPanel`: Explains color meanings

## Data Flow

```
User Request
    ↓
page.tsx
    ↓
FDRTable (index.tsx)
    ↓
QueryClientProvider
    ↓
FDRDataProvider
    ├── useTeams()
    ├── useFixtures()
    ├── useCurrentGameweek()
    └── useDifficultyScores() → Precomputes all scores
    ↓
FDRTableContainer
    ├── useFDRData() → Get precomputed data
    ├── useFDRControls() → Manage UI state
    └── useIsDesktop() → Check screen size
    ↓
    ├─→ Desktop: Table → TableHeader, TableRow → TableCell
    └─→ Mobile: CardList → TeamCard → FixtureRow
```

## Key Concepts

### Difficulty Calculation

The difficulty model uses a sigmoid-like transformation:

1. **League Mean**: Average of (offense - defense) across all teams
2. **Squash Function**: `1 / (1 + exp(-k * (x - league_mean)))`
3. **Combine Weighted**: `1 - ∏(1 - p_i)` for multiple opponents
4. **Thresholds**:
   - Easy: score > 0.66
   - Medium: 0.33 < score ≤ 0.66
   - Hard: score ≤ 0.33
   - Invalid: no fixtures

### Precomputation Strategy

Instead of calculating difficulty on-the-fly in each component, we:

1. Compute all scores once in `useDifficultyScores`
2. Store in normalized structure: `{ byTeam: { [teamId]: { [gameweek]: scores } } }`
3. Pass precomputed values down to components
4. Re-memoize only when teams or fixtures change

### Responsive Design

Using Option B (Conditional Rendering):
- `useMediaQuery` hook detects screen size
- Renders only Desktop OR Mobile view (not both)
- Breakpoint: 1024px (desktop) / 767px (mobile)
- Same data, same controls, different presentation

## Usage

```tsx
import FDRTable from "@/app/components/FDRTable";

export default function Page() {
  return <FDRTable />;
}
```

The component is fully self-contained with all providers included.

## Features

### Both Views
- Sort by offense or defense perspective
- Select gameweek range (3, 4, 5, or 6 weeks)
- Navigate through gameweeks with prev/next
- Sliding window (10 gameweeks visible at once)
- Color-coded difficulty visualization
- Interactive legend

### Desktop Specific
- Click any column header to sort by that gameweek
- Click "TEAM" header to sort by range aggregate
- Horizontal scrolling for many gameweeks
- Sticky first column

### Mobile Specific
- Vertical scrolling through team cards
- Each card is self-contained
- Touch-friendly buttons
- Compact controls at top

## Performance Considerations

1. **Memoization**: `useMemo` on all expensive calculations
2. **Single Computation**: Difficulty scores computed once, not per-component
3. **Context Optimization**: Only re-render when necessary data changes
4. **No Redundant Fetches**: React Query handles caching
5. **Conditional Rendering**: Only one view rendered at a time

## Testing Strategy

### Unit Tests (Recommended)
- `utils/difficulty.ts`: Test squash, combineWeighted, calculations
- `utils/sorting.ts`: Test sorting logic
- `hooks/useDifficultyScores.ts`: Test score computation
- `hooks/useFDRControls.ts`: Test state management

### Integration Tests (Recommended)
- Sorting interactions (header clicks)
- Window navigation (prev/next)
- Range selection changes
- View switching on resize

### E2E Tests (Optional)
- Full user flows
- Cross-device testing
- Performance benchmarks

## Future Enhancements

Potential features to add:

1. **Filtering**: Filter teams by name, league position, etc.
2. **Favorites**: Mark favorite teams for quick access
3. **Export**: Download as CSV or image
4. **Tooltips**: Show exact numeric values on hover
5. **Detailed View**: Expandable rows with more stats
6. **Comparison Mode**: Side-by-side team comparison
7. **Historical Data**: View past gameweek difficulties
8. **Virtualization**: For very large datasets
9. **Customizable Colors**: User preference for color scheme
10. **Accessibility**: Enhanced keyboard navigation and screen reader support

## Migration from Old Implementation

The old `Table/` directory is still present. To fully complete the migration:

1. Test the new implementation thoroughly
2. Verify all features work in both views
3. Check responsive behavior at various screen sizes
4. Delete the old `components/Table/` directory
5. Update any external references

## Contributing

When adding new features:

1. Keep the separation of concerns (data/logic/presentation)
2. Add types to `types.ts`
3. Extract reusable logic to `utils/` or `hooks/`
4. Share components between views when possible (use `shared/`)
5. Test on both desktop and mobile
6. Document complex logic with comments

## License

Same as the parent project.