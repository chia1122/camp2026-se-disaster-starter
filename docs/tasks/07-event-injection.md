# Event Injection：處理新資料與 schema mismatch

## 時間

15:35–16:20

## 你現在拿到的來源

- staff 發出的 event PR
- `events/event-1535/README.md`
- `events/event-1535/incoming-data.json`
- `events/event-1535/task.md`
- `events/event-1535/notes-for-review.md`
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `src/contracts/`

## 你要做什麼

先讀 event 檔案，不要立刻寫 code。可以看 GitHub PR 的 Files changed，或打開本機 `events/event-1535/`。

先判斷：

1. incoming data 哪裡不符合 schema？
2. 這是資料錯誤、新需求，還是外部格式差異？
3. 應該 adapter、schema extension、mark `needs_review`，還是 reject？
4. 進 UI 後會不會被誤認為已確認事實？
5. demo 要怎麼看見處理結果？

策略簡表：

| 情況                             | 優先策略                |
| -------------------------------- | ----------------------- |
| 欄位名稱或格式不同，但語意已存在 | adapter                 |
| 內部模型真的缺少必要語意         | family schema extension |
| 資訊可能有用但證據不足           | mark `needs_review`     |
| 資料無法辨識或不該進 demo        | reject                  |
| 只需要提醒使用者注意             | display warning         |

decision 至少寫出理由：format mismatch、missing evidence、new domain meaning、display-only warning 或 reject reason。

## 成果放哪裡

- dirty input 留在 `events/event-1535/`
- adapter 放 `src/adapters/`
- normalized result 若要給 UI 用，放 `src/fixtures/workspace/`
- UI 從 `src/app/App.tsx` 或它匯入的 feature 看得到處理結果
- decision / data contract / AI log 依實際變更更新
- 測試放 `tests/`

## 不做什麼

- 不直接搬 `incoming-data.json` 到 `src/fixtures/shared/`
- 不直接改 `CommonRecord`
- 不自動覆蓋正式狀態
- 不讓 AI 做最終判斷
- 不做 webhook、diff parser、server importer 或 CLI ingestion

## 可以怎麼使用 Coding Agent

分兩步：

1. 分析階段：只列 mismatch、風險、策略，不改檔。
2. 實作階段：小組決定策略後，才請 Agent 修改指定檔案。

## 必須交付

- [ ] `docs/decisions.md` 記錄 event decision
- [ ] demo 可見不確定、reject 或 warning 處理
- [ ] UI 不把不確定資訊顯示成 verified fact
- [ ] 若有 code change，至少新增或更新 1 個測試
- [ ] 若 schema、adapter、fixture path 或 I/O contract 有變，更新 `docs/data-contract.md`
- [ ] `docs/ai-log.md` 更新
- [ ] 一個 commit，建議訊息：`Handle event injection`

## 停止條件

16:10 後停止大重構。更完整的測試、文件與交接整理留到 Build Sprint 2。
