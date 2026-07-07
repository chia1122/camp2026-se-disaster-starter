# Data Contract

## Inputs

- `src/fixtures/phase-0/messy-reports.json`
  - Phase 0 dirty input.
  - UI may display it directly only when clearly labeled as not normalized.
- Front-end manual task form input
  - Runtime-only draft data entered by the user in the Vite app.
  - Not persisted to filesystem, backend, database, or localStorage.
- Front-end confirmation form input
  - Runtime-only review notes for each Phase 0 messy report.
  - Fields: `focus`, `owner`, `nextStep`, `note`.
- Front-end assignment form input
  - Runtime-only draft assignment data.
  - Fields follow the current `Assignment` family shape where possible: `taskId`, `volunteerGroupId`, `peopleCount`, `status`, `decidedByRole`, `decisionReason`.

## Outputs

- Phase 0 classification view
  - Displays raw text, source type, verification status, updated time, suggested category, severity color, people estimate, unknown reasons, and task blockers.
- Runtime task drafts
  - Fields: `id`, `title`, `description`, `category`, `severity`, `verificationStatus`, `peopleEstimate`, `sourceReference`.
  - These drafts are UI-only review artifacts and are not treated as normalized `Task` records.
- Runtime confirmation notes
  - Displayed in the Phase 0 workbench form only.
  - They capture human review intent, not confirmed facts.
- Runtime assignment drafts
  - Displayed in the `人員指派` page beside existing shared assignment fixtures.
  - They are not treated as normalized `Assignment` records until a later adapter or fixture workflow is designed.

## Extended schema

- No core schema change in this iteration.
- `CommonRecord` is unchanged.
- `peopleEstimate`, category, severity, selected unknown reasons, and selected blockers are UI-level review metadata for Phase 0.
- Existing normalized `Task.peopleNeeded` remains the internal task schema field for validated fixtures.
- Existing normalized `Assignment.peopleCount`, `taskId`, `volunteerGroupId`, `status`, `decidedByRole`, and `decisionReason` remain the internal assignment schema fields for validated fixtures.

## Adapter decisions

外部資料不一定符合內部 schema。先寫 adapter，只有語意真的不足時才擴充 schema。

- No adapter added for manual task drafts because the feature is a front-end review aid, not an import pipeline.
- No adapter added for confirmation notes or assignment drafts because they are front-end review aids, not an import pipeline.
- If the team later decides to convert drafts into normalized `Task` or `Assignment` fixtures, add an adapter or explicit save step and validate the result before placing data under `src/fixtures/workspace/`.
