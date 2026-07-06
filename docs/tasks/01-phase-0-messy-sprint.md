# Phase 0：共同混亂 Sprint

## 時間

09:20–10:10

## 你現在拿到的來源

- `docs/course-context.md`
- `docs/brief.md`
- `docs/output-paths.md`
- `src/fixtures/phase-0/messy-reports.json`
- starter UI

## 你要做什麼

做一個最小前端介面，讓下一位協作者看懂：

1. 目前有哪些資訊
2. 資料從哪裡來
3. 哪些已確認，哪些需要人工確認
4. 哪些欄位你們不知道怎麼判斷
5. 哪些資料不能直接進系統

這一階段不是找出唯一正確答案，而是讓混亂和不確定被看見。

## 前 10 分鐘

1. 開 starter UI；若還沒開，在 repo 裡跑 `pnpm install`、`pnpm dev`，再打開 localhost URL。
2. 看 `src/app/App.tsx`，確認畫面從哪裡 render。
3. 看 `messy-reports.json`，找 raw text、source、status、updatedAt 類似欄位。
4. 決定用列表、表格或卡片顯示。
5. 若問 Coding Agent，先請它分析資料，不要直接改 code。

不要爬社群、查地圖、補真實地址或從外部網站補資料。

## 成果放哪裡

- UI：`src/app/App.tsx`、`src/components/`，或 `src/features/phase-0/`
- 資料：只讀 `src/fixtures/phase-0/messy-reports.json`
- 文件：`docs/phase0-observations.md`、`docs/ai-log.md`

Phase 0 可以直接顯示 dirty records，但畫面要標示「這不是 normalized data」。

## 不做什麼

- 不做完整產品、角色權限、後端、資料庫、localStorage、外部 API、地圖
- 不修改 `CommonRecord`
- 不把 dirty data 移進 `src/fixtures/shared/` 假裝乾淨

## 必須交付

- [ ] UI 顯示所有 phase-0 messy records
- [ ] 首頁能看到 Phase 0 整理方式
- [ ] 每筆至少顯示 raw text、source、verification status、updatedAt
- [ ] `needs_review` / `unverified` 有明顯標示
- [ ] 至少標示 3 個「我們不知道如何判斷」
- [ ] 寫出 demo render path
- [ ] `docs/phase0-observations.md` 有初步紀錄
- [ ] `docs/ai-log.md` 有一筆 AI 使用紀錄

## 停止條件

10:00 後停止新增主要功能，補 observation、確認 demo 入口，準備 10:10 復盤。
