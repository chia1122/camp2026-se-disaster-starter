# Build Sprint 2：吸收變更

## 時間

16:20–17:20

## 你現在拿到的來源

- event injection decision
- `docs/decisions.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `events/event-1535/`
- `tests/`

## 你要做什麼

這一輪不是繼續加功能，而是把 event injection 帶來的變更補穩。

請完成：

1. UI 顯示 event 造成的新狀態、warning 或 reject summary
2. 不確定資訊不被當成已確認事實
3. adapter / schema decision 有文件
4. 測試補上，驗證 decision，不是證明災情真相
5. handoff 文件補上限制
6. demo 看得到 event response

## 成果放哪裡

- UI：`src/app/App.tsx`、`src/components/` 或 `src/features/`
- data / adapter / schema：依 decision 放到 `src/fixtures/workspace/`、`src/adapters/`、`src/contracts/`
- docs：`docs/data-contract.md`、`docs/decisions.md`、`docs/handoff.md`、`docs/ai-log.md`
- tests：`tests/`

若是 reject path，可以在 UI 顯示 decision / warning 摘要，不要把它變成 normalized record。

## 不做什麼

- 不新增第二條主流程
- 不做大重構
- 不為了展示效果隱藏錯誤
- 不把 dirty input 直接當 normalized data
- 不做通用 event importer

## 必須交付

- [ ] event data 已依照 `docs/decisions.md` 處理
- [ ] demo 能看到 event response
- [ ] 不確定資訊沒有被當成事實
- [ ] 測試補上
- [ ] 若 schema、adapter、fixture path 或 I/O contract 有變，更新 `docs/data-contract.md`
- [ ] `docs/handoff.md` 寫出已知限制
- [ ] `docs/ai-log.md` 更新
- [ ] `pnpm build` 成功
- [ ] 盡量跑 `pnpm run check`；若未通過，記錄原因
- [ ] 一個 commit，建議訊息：`Stabilize event response`

## 停止條件

17:10 後停止新增功能，確認成果已接進 demo，準備整理目前狀態。
