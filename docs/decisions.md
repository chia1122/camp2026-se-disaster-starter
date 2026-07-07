# Decisions

## DEC-001：

### Context

Starter repository commands and CI should use one package manager so students and agents do not split workflows.

### Options considered

- Keep the previous package-manager workflow.
- Use pnpm as the only documented and CI package manager.

### Decision

Use Node 24 and pnpm for install, scripts, lockfile, CI, and course documentation.

### Consequences

Contributors should use Node 24, then run `pnpm install` and `pnpm run check`. No alternate package manager is supported.

## DEC-002：Phase 0 新增工作使用前端 runtime 草稿

### Context

Phase 0 需要讓使用者新增工作、填寫人數預估，並保留「還不知道如何判斷」與「不能直接變成任務」的人工確認脈絡。

### Options considered

- 直接把新增工作寫入 `src/fixtures/shared/tasks.json`。
- 修改 `Task` 或 `CommonRecord` schema，加入 Phase 0 review metadata。
- 只在前端 runtime state 建立草稿，並清楚標示為待人工確認。

### Decision

新增工作先使用前端 runtime state，不寫入 fixture、不新增後端、不修改 `CommonRecord`。

### Consequences

使用者重新整理頁面後，新增草稿會消失。若後續要保存或交接草稿，應新增 adapter 或整理成 `src/fixtures/workspace/` normalized data，並通過 validation。

## DEC-003：GitHub Pages 展示與人員指派先做成前端 demo

### Context

使用者希望看到 `github.io` 展示畫面、可填寫的人工確認重點，以及完整的人員指派表單。

### Options considered

- 嘗試自動部署 GitHub Pages。
- 將人工確認與人員指派草稿寫入 fixture。
- 在 Vite app 中新增可展示頁與 runtime-only 表單。

### Decision

在 `src/app/App.tsx` 新增 GitHub Pages 展示頁、人工確認重點表單與人員指派表單。表單送出後只保存在前端 runtime state。

### Consequences

Demo 可從首頁看到並可由 `vite build` 產出 GitHub Pages 靜態檔，但目前不自動部署。人工確認紀錄與人員指派草稿重新整理後會消失；若後續需要保存，需設計 workspace fixture 或 adapter。
