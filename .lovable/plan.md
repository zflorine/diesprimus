# Dies primus dies ultimus — Plan

A single-page, editorial, monochrome app that gives the user one activity per day from a pool of 400, tracks results in localStorage, produces a colored annual report, supports idea regeneration, and is multilingual (FR/EN/ZH).

## Design direction
- **Palette**: pure white `#ffffff`, ink black `#111111`, greys `#6b7280` / `#9ca3af` / `#e5e7eb`. Hairline 1px borders. Color appears only in the report chart.
- **Report curve colors (soft)**: Création `#e59ab8`, Esprit `#9b8fd6`, Sciences `#8fb4e5`, Corps `#8fca9e`.
- **Typography**: serif display headings (`@fontsource/fraunces`) + clean sans body/UI (`@fontsource/inter`). For Chinese, add `@fontsource/noto-sans-sc` so CJK glyphs render cleanly. Registered in `src/styles.css` `@theme`.
- **Feel**: generous whitespace, thin rules, tracked small-caps labels, large date typography, subtle fade/slide transitions.

## Internationalization (NEW)
- Languages: **Français (default)**, **English**, **简体中文**.
- Language switcher in the top bar (3 compact text buttons: FR · EN · 中文). Selection persisted in localStorage (`dpdu_lang`) and applied instantly.
- Lightweight i18n via a `src/lib/i18n.ts` module + `useLang` context/hook (no heavy dependency). UI strings live in a `translations` object keyed by language.
- **Activity data is trilingual**: each activity carries `titre`/`tutoriel` per language:
```json
{
  "id": "ce-001",
  "domaine": "creation_expression",
  "titre": { "fr": "...", "en": "...", "zh": "..." },
  "tutoriel": { "fr": "...", "en": "...", "zh": "..." }
}
```
Domain labels and all buttons/labels also translated. The stored `id` stays language-independent, so history and cooldown work across language switches; the display simply reads the active language.

## Data
`src/data/activitiesData.js` — 400 objects (100 per domain), trilingual shape above, concise 1–2 sentence tutorials, stable ids (`ce-###`, `ec-###`, `st-###`, `cx-###`).
Domains: `creation_expression`, `esprit_connaissance`, `sciences_technique`, `corps_exploration`.

## State & storage (localStorage)
- `dpdu_history`: `{ date, activityId, domaine, status: "done"|"failed" }[]`.
- `dpdu_proposals`: per-date the 8 proposed ids (drives cooldown + reopening a day).
- `dpdu_lang`: current language.
- Helper `src/lib/dpdu-store.ts`: read/write, `getCooldownSet(refDate, extraExcluded)`, and `pickDaily(date, { reroll })` selecting 2 eligible random activities per domain excluding cooldown ids.

## Flow (single route `src/routes/index.tsx`, step state machine)
1. **Date step**: editorial hero, shadcn date picker pre-filled with today, "Let's go!" button opens the day. If the date already has a locked entry, jump to recap.
2. **Choice step**: 4 domain sections, 2 cards each. Selecting one collapses its sibling and reveals the action sheet.
   - **Regenerate (NEW)**: the "Let's go!" button remains visible on the choice step. Re-clicking it **re-rolls** a fresh set of 8 proposals for that date (the previously proposed ids get pushed into a temporary exclusion + cooldown set so re-rolls surface new ideas). Works only before the day is locked by a feedback choice. Subtle "regenerating" fade transition.
3. **Action & feedback**: selected activity title + tutoriel (in current language), buttons "C'est fait" / "Je n'ai pas pu le faire". Choosing writes history and locks the day.
4. **History view**: reverse-chronological, 7 per page, pagination (prev · page number · next). Each row: date, domain tag, title, done/failed marker.
5. **Annual report**: "Générer mon rapport annuel" → Recharts LineChart, X = last 12 months, Y = count of `done` per month, 4 colored lines. "Télécharger mon graph" → PNG via `html-to-image`.

Minimal top nav: Aujourd'hui / Historique / Rapport + language switcher.

## Cooldown rule
60 days. An id is ineligible if within the last 60 days it was proposed-but-not-chosen or marked `failed`. `done` ids also respect the window. Re-roll additionally excludes ids already shown in the current session for that date. Graceful fallback if a domain runs low.

## Dependencies
- `bun add recharts html-to-image`
- `bun add @fontsource/fraunces @fontsource/inter @fontsource/noto-sans-sc`

## Files
- `src/data/activitiesData.js` (new, 400 trilingual entries)
- `src/lib/i18n.ts` (new — UI strings + language hook/context)
- `src/lib/dpdu-store.ts` (new — storage, selection, cooldown, reroll)
- `src/components/dpdu/DateStep.tsx`, `ChoiceStep.tsx`, `ActionStep.tsx`, `HistoryView.tsx`, `AnnualReport.tsx`, `DomainTag.tsx`, `LangSwitcher.tsx` (new)
- `src/routes/index.tsx` (rewrite — steps, nav, i18n provider; replaces placeholder)
- `src/styles.css` (font tokens incl. Noto Sans SC, thin-rule utilities)
- `src/routes/__root.tsx` (real title/description/OG metadata)

## Technical notes
- All state client-side; guard localStorage for SSR (typeof window / effects) so TanStack prerender doesn't crash.
- Recharts + html-to-image are client-only; render report behind a mounted check.
- No backend, no Cloud, no accounts.
