## Plan

1. **Read** `src/data/activitiesData.js` and parse the full array of 500 activities.
2. **Re-format** each entry into a flat, edit-friendly JSON structure with explicit keys:
   - `id`
   - `domain`
   - `title_fr`, `title_en`, `title_zh`
   - `tutorial_fr`, `tutorial_en`, `tutorial_zh`
3. **Write** the result to `/mnt/documents/dies_primus_activities_500.json` as a downloadable artifact.
4. **Verify** the file contains exactly 500 entries, 100 per domain, and that the JSON is valid.

## Deliverable

A single downloadable JSON file the user can edit directly and re-import into `src/data/activitiesData.js` later.
