# 成果交流

## 時間

20:00–21:00

19:25–19:40 是展示前整理時間。19:40 後不要再新增功能。

## 你現在拿到的來源

- GitHub Pages demo
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/decisions.md`
- `docs/handoff.md`
- `docs/ai-log.md`
- event injection response
- handoff feedback

## 你要做什麼

準備 90 秒 lightning pitch 與成果市集展示。

90 秒回答：

1. 我們處理的資訊斷點是什麼？
2. Phase 0 時最錯誤的假設是什麼？
3. event injection 打破了哪個設計假設？
4. 我們如何處理不確定性？
5. AI 幫最多與最危險的地方是什麼？
6. demo 中要看哪個畫面？
7. 我們的系統刻意不替人決定什麼？

## 展示入口

- 優先用 GitHub Pages demo URL
- 若 Pages 還不能用，優先 `pnpm build` 後 `pnpm preview`
- 若 build 被記錄為阻塞，才用 `pnpm dev`

展示時要能對回：

- `src/app/App.tsx`
- 主 component / feature
- 主要 fixture / adapter
- `docs/spec.md`
- `docs/decisions.md`
- `docs/handoff.md`

## 不做什麼

- 不排名
- 不宣稱這是真實救災系統
- 不展示真實個資
- 不把未完成包裝成完成
- 不只展示文件而不打開 demo
- 19:40 後不 debug Pages deploy

## 必須交付

- [ ] 可操作 demo
- [ ] GitHub Pages demo URL 或本機等價入口
- [ ] 90 秒 lightning pitch
- [ ] 一句話元件說明
- [ ] event injection 學習
- [ ] handoff 學習
- [ ] AI 協作反思

## 停止條件

19:40 後禁止新增功能，只準備展示與說明。
