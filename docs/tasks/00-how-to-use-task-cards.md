# 如何使用任務卡

## 時間

整天都會用到。

## 先做這三步

1. 打開台上或 GitHub Issue 指到的任務卡。
2. 先看「你現在拿到的來源」和「你要做什麼」。
3. 開始前說清楚：要改哪裡、成果會從哪個畫面看到、哪些事今天不做。

若任務卡要求讀 `docs/spec.md`、`docs/data-contract.md` 或 `docs/output-paths.md`，再打開那些文件。

## 共通規則

- 可展示成果要能從 GitHub Pages 首頁看到或操作。
- 前端成果要接到 `src/app/App.tsx` 或它匯入的 component。
- `events/**` 是外部 dirty input，不要直接當內部資料。
- 小組整理後的 normalized data 放在 `src/fixtures/workspace/`。
- 不新增後端、資料庫、登入、Docker、爬蟲、地圖 SDK、外部 API 或安全掃描工具。

更多路徑規則看 `docs/output-paths.md`。

## 常見詞

| 詞              | 這裡的意思                      |
| --------------- | ------------------------------- |
| fixture         | repo 裡的假資料                 |
| dirty data      | 外部來的混亂資料，不能直接相信  |
| normalized data | 符合內部 schema 的資料          |
| schema          | 資料欄位和狀態規則              |
| adapter         | 把外部格式轉成內部格式的小函式  |
| entry path      | demo 從哪個檔案一路 render 出來 |

## 問 Coding Agent 前

先要求 Agent 回答：

1. 要改哪些檔案？
2. demo render path 是什麼？
3. 會新增或更新什麼測試？若本階段不需要，寫「本階段不新增測試」。
4. 哪些成果只屬於文件或測試？
5. 不會做哪些超出範圍的事？

等小組確認後再讓 Agent 改檔。

## 停止條件

時間到就停止加功能，改成：

- 確認 demo 可見
- 補文件、AI log、decision
- 跑 `pnpm build`；sprint 結束或交接前盡量跑 `pnpm run check`
- 若檢查沒過，記錄指令、錯誤和原因
- commit

不熟 Git 時先問組員或 mentor，不要用會刪掉別人改動的指令。
