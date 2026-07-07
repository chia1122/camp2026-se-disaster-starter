# Handoff

## How to run

```bash
pnpm install
pnpm run dev
```

## 已完成的完成條件（AC）

- Phase 0 首頁工作台顯示所有原始資訊、分類、風險程度與人數預估。
- 每筆資訊的「還不知道如何判斷」與「不能直接變成任務」原因可用按鈕選填。
- 「新增工作」頁面可建立前端 runtime 草稿，包含分類、風險、查核狀態、來源與人數預估。
- Phase 0 工作台可依風險程度、分類、查核狀態、人數預估與更新時間排序。
- 主要背景色已改為 baby blue。
- GitHub Pages 展示頁已接在首頁第一個 tab。
- 每筆 Phase 0 原始資訊都有人工確認重點表單，可填查核問題、負責角色、下一步與備註。
- 人員指派頁已改為完整表單，可新增任務、志工群組、人數、狀態、決策角色與指派原因。

## Known issues

- 新增工作草稿只存在前端 state，重新整理後會消失。
- 選填原因目前只作為畫面互動狀態，尚未輸出為 normalized data。
- 人工確認重點與人員指派草稿也只存在前端 state。
- 目前只提供 GitHub Pages 可 build 的展示頁，尚未自動部署到遠端 GitHub Pages。

## Important files

- `src/app/App.tsx`
- `src/styles/global.css`
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/decisions.md`
- `docs/ai-log.md`
- `vite.config.ts`

## Suggested next task

- 若需要保存新增工作，請先設計 adapter 或 workspace fixture，再通過 validation；不要直接把 Phase 0 dirty data 寫入 `src/fixtures/shared/`。
- 若要真的發布到 GitHub Pages，請確認 GitHub Actions 或 Pages 設定使用 `pnpm install` 和 `pnpm build`，產物為 `dist/`。
