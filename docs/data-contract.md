# Data Contract

## Inputs

- `src/fixtures/phase-0/messy-reports.json`
  - Phase 0 dirty input.
  - UI may display it directly only when clearly labeled as not normalized.
- Front-end manual task form input
  - Runtime-only draft data entered by the user in the Vite app.
  - Not persisted to filesystem, backend, database, or localStorage.

## Outputs

- Phase 0 classification view
  - Displays raw text, source type, verification status, updated time, suggested category, severity color, people estimate, unknown reasons, and task blockers.
- Runtime task drafts
  - Fields: `id`, `title`, `description`, `category`, `severity`, `verificationStatus`, `peopleEstimate`, `sourceReference`.
  - These drafts are UI-only review artifacts and are not treated as normalized `Task` records.

## Extended schema

- No core schema change in this iteration.
- `CommonRecord` is unchanged.
- `peopleEstimate`, category, severity, selected unknown reasons, and selected blockers are UI-level review metadata for Phase 0.
- Existing normalized `Task.peopleNeeded` remains the internal task schema field for validated fixtures.

## Adapter decisions

外部資料不一定符合內部 schema。先寫 adapter，只有語意真的不足時才擴充 schema。

- No adapter added for manual task drafts because the feature is a front-end review aid, not an import pipeline.
- If the team later decides to convert drafts into normalized `Task` fixtures, add an adapter or explicit save step and validate the result before placing data under `src/fixtures/workspace/`.
