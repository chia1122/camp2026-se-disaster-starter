# AI Log

這份紀錄用來留下小組如何使用 AI / Coding Agent 的操作脈絡。重點不是逐字保存所有 prompt，而是記錄重要協作、取捨與人類判斷。

## 什麼時候要記錄

請在以下情況更新本檔案：

- AI 協助釐清需求或產生 spec 草稿
- AI 協助設計 schema、adapter 或資料轉換策略
- AI 協助產生 UI、測試、README 或 handoff 文件
- AI 建議被小組拒絕，且拒絕原因和安全 / 正確性 / scope 有關
- AI 輸出可能造成誤導，例如把未確認資料寫成已確認事實
- event injection 後，AI 協助判斷 schema mismatch 或 adapter 策略

## 不需要記錄

- 不需要逐字貼完整 prompt
- 不需要記錄每一次小型 autocomplete
- 不需要記錄單純修 typo 或格式化

## 紀錄格式

| 時間       | 階段    | 任務                   | AI / Agent 建議                                                                            | 採用 / 拒絕 | 人類判斷理由                                                                             | 相關檔案 / commit                                                                                        |
| ---------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 2026-07-07 | Phase 0 | 建立混亂資訊整理工作台 | 建議把首頁改成左右分欄：左側保留原始資訊，右側顯示分類、風險程度、不確定資訊與不能派工原因 | 採用        | 符合 Phase 0 任務卡，且沒有把 dirty data 寫入 normalized fixtures 或宣稱為 verified data | `src/app/App.tsx`, `src/styles/global.css`, `docs/phase0-observations.md`                                |
| 2026-07-07 | Phase 0 | 新增工作互動與排序     | 建議用前端 runtime state 做工作草稿、用按鈕選填人工確認原因，並加入人數預估與排序          | 採用        | 符合前端-only 限制；不新增後端、不修改 `CommonRecord`，也不把草稿當 verified task        | `src/app/App.tsx`, `src/styles/global.css`, `docs/spec.md`, `docs/data-contract.md`, `docs/decisions.md` |
| 2026-07-07 | Phase 0 | 展示頁與指派表單       | 建議新增 GitHub Pages 展示頁、人工確認重點填寫表單與人員指派完整表單                       | 採用        | 保持前端-only 與 runtime 草稿限制；不自動部署、不把指派草稿當成正式資料                  | `src/app/App.tsx`, `src/styles/global.css`, `docs/spec.md`, `docs/data-contract.md`, `docs/handoff.md`   |

## 範例

| 時間  | 階段            | 任務             | AI / Agent 建議                                                   | 採用 / 拒絕 | 人類判斷理由                              | 相關檔案 / commit             |
| ----- | --------------- | ---------------- | ----------------------------------------------------------------- | ----------- | ----------------------------------------- | ----------------------------- |
| 09:45 | Phase 0         | 分析混亂資料     | 建議把社群貼文直接轉成 verified report                            | 拒絕        | 社群貼文來源未確認，應保持 `needs_review` | `docs/phase0-observations.md` |
| 15:50 | Event Injection | 處理外部任務資料 | 建議新增 adapter 將 `need_people: "10人"` 轉成 `peopleNeeded: 10` | 採用        | 這是外部格式差異，不應修改 `CommonRecord` | `src/adapters/...`            |

## 課後反思

### AI 幫助最大的地方

-

### AI 最容易誤導的地方

-

### 下次使用 AI 開發前，我們會先準備

-
