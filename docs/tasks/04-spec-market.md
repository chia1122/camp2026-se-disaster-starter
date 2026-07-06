# Spec 市集

## 時間

13:00–13:30

## 你現在拿到的來源

- 自己組的 `docs/spec.md`
- 自己組的 `docs/data-contract.md`
- 其他組的 spec
- mentor / 同學質疑

## 你要做什麼

閱讀其他組的 spec，用檢查問題幫他們找工程風險。

可以問：

- 使用者是誰？
- 資料從哪個檔案進來？
- 狀態如何驗證？不確定時畫面怎麼顯示？
- 誰需要人工確認？
- scope 是否太大？
- AI 是否被賦予最終判斷權？
- 是否需要後端、外部 API、資料庫、地圖 SDK 或登入才做得出來？
- demo 是否能從 `src/app/App.tsx` 看見？
- 是否會自動覆蓋、排序、合併或判斷真相？

收到質疑後，回頭修正自己的 spec。

## 成果放哪裡

- 更新 `docs/spec.md`
- 更新 `docs/data-contract.md`
- 更新 `docs/decisions.md`
- 若有使用 AI 檢查 spec，更新 `docs/ai-log.md`

若 demo 入口不清楚，在 `docs/spec.md` 補上 demo path。

## 不做什麼

- 不評比誰的點子比較酷
- 不幫別組寫解法
- 不擴大自己的 scope
- 不把質疑變成辯論輸贏
- 不在這個階段大量改 UI

## 必須交付

- [ ] 對其他組提出至少 2 個具體質疑
- [ ] 自己收到質疑後，更新 `docs/spec.md`
- [ ] 在 `docs/decisions.md` 記錄至少 1 個取捨
- [ ] 檢查自己的 demo path 是否清楚

## 停止條件

13:30 停止新增想法，準備進入 Scope Lock。
