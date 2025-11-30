# Anti-Scam Master - AI Coding Instructions

## Project Overview
A swipeable card game (Tinder-style) built for LINE platform using Next.js 14 App Router. Users swipe left (scam) or right (safe) on Vietnamese anti-scam scenarios, receiving real-time feedback and a final certificate.

## Architecture

### State Management Pattern
- **Single-file state**: All game state lives in `src/app/page.tsx` using React hooks (no Redux/Zustand)
- Game flows through 4 states: `intro` → `playing` → `feedback` → `result` (see `GAME_STATES` in `constants/gameConfig.ts`)
- User answers stored in array (`UserAnswer[]`) for final scoring - never mutate, always append

### Data Flow
1. **Scenarios**: Static array in `constants/scenarios.ts` → shuffled on game start → consumed sequentially
2. **Scoring**: Each swipe creates `UserAnswer` object → batch calculated in `utils/gameUtils.ts` → 5 radar stats (knowledge, speed, vigilance, analysis, mindset)
3. **Certificate**: Canvas-rendered from stats in `utils/certificateUtils.ts` using vanilla Canvas API (no external libs)

### Component Structure
```
page.tsx (orchestrator)
├── IntroScreen (name input)
├── GameHeader (progress bar + streak counter)
├── DraggableCard (swipeable or button-based)
├── FeedbackCard (correct/incorrect explanation)
└── ResultScreen (radar chart + certificate download)
```

## Key Conventions

### TypeScript Interfaces
All game types in `src/types/game.ts`. Components **must** import these types - never inline types for game entities.

### Constants Usage
- All magic numbers in `constants/gameConfig.ts` (e.g., `MIN_SWIPE_DISTANCE: 100`)
- Scenario types use string literals from `SCENARIO_TYPES` object
- When adding new thresholds, update `STAT_THRESHOLDS` object, don't hardcode

### Swipe Mechanics (DraggableCard.tsx)
- Mouse + Touch handlers unified via `handleStart/Move/End` pattern
- Rotation calculated as `position.x * ROTATION_MULTIPLIER`
- Overlays (TIN/LỪA) opacity tied to swipe distance
- **Interactive scenarios**: Buttons replace swipe (`data.interactive` flag)

### Scenario Types & Styling
- `MESSAGE_STYLE_TYPES` array determines chat bubble UI (phishing, chat_scam, ceo_fraud, romance)
- Non-message types use card-style layout with Search icon
- Check `isMessageStyle` flag in DraggableCard to conditionally render

## LINE LIFF Integration (Currently Disabled)

The app is designed for LINE but LIFF is commented out in `page.tsx`:
```tsx
// import liff from '@line/liff';
// liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
```

To re-enable:
1. Uncomment LIFF imports and init code
2. Set `NEXT_PUBLIC_LIFF_ID` in `.env.local`
3. Replace manual name input with `liff.getProfile()` for userName

**HTTPS requirement**: LINE requires HTTPS endpoints - use ngrok for local dev (`ngrok http 3000`)

## Development Workflow

### Scripts
- `npm run dev` - Start dev server (port 3000)
- `npm run build` - Production build (checks TypeScript errors)
- `npm run lint` - ESLint check

### Adding New Scenarios
1. Add to `ORIGINAL_SCENARIOS` in `constants/scenarios.ts`
2. Required fields: `id`, `title`, `description`, `type`, `isScam`, `difficulty`, `details`
3. For interactive: Add `interactive: true` + `options: [{ label, action }]` array
4. Match `type` to existing `SCENARIO_TYPES` or add new type + icon in `ScenarioIcon.tsx`

### Modifying Scoring Logic
All calculations in `utils/gameUtils.ts`:
- `calculateStats()` - Converts UserAnswer[] to 5-dimension stats
- `getSuggestions()` - Generates feedback based on thresholds
- Speed scoring uses time brackets (fast < 1.5s, medium < 5s, slow < 8s)

### Styling Conventions
- **Tailwind only** - No custom CSS files except `globals.css`
- Dark theme (`bg-slate-950`) with accent colors (`blue-600`, `red-500`, `green-400`)
- Animation classes: `animate-in fade-in slide-in-from-*` from Tailwind
- Mobile-first: Use `max-w-sm` for cards, `md:` for desktop overrides

## Common Pitfalls

1. **Don't mutate scenarios array**: Always shuffle into new state variable
2. **Canvas rendering**: Must set `canvas.width/height` before drawing (see `CANVAS_WIDTH/HEIGHT`)
3. **Vietnamese text**: Use proper UTF-8 encoding, test special chars (đ, ă, â)
4. **Touch events**: Always prevent default on TouchStart to avoid scroll conflicts
5. **TypeScript strict mode**: All functions must have return types for exports

## Testing on iOS Simulator
1. Run `npm run dev` + `ngrok http 3000`
2. Update LINE Console endpoint with ngrok URL
3. Open Safari on Simulator → Enter ngrok URL
4. Use Safari Web Inspector (Develop > Simulator) for debugging

## Production Deployment (Vercel)
- Set `NEXT_PUBLIC_LIFF_ID` in Vercel env vars
- Update LINE Console endpoint to Vercel domain (e.g., `anti-scam.vercel.app`)
- No custom build config needed - Next.js defaults work

## File References
- Game state logic: `src/app/page.tsx`
- Type definitions: `src/types/game.ts`
- Scoring algorithms: `src/utils/gameUtils.ts`
- Swipe mechanics: `src/components/DraggableCard.tsx`
- Scenario data: `src/constants/scenarios.ts`
