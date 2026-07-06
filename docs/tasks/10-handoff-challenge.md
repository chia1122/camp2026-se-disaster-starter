# Handoff Challenge：接手另一組

## 時間

18:40–19:25

## 你現在拿到的來源

- 另一組 repo
- 另一組 GitHub Pages demo
- 另一組 `docs/handoff.md`
- 另一組 `docs/spec.md`
- staff 發出的 handoff issue

## 你要做什麼

在有限時間內接手另一組 repo，完成一個小任務，或清楚記錄無法完成的原因。

請依序：

1. 打開另一組 demo，先理解可展示成果
2. clone / pull 另一組 repo
3. 依照 `docs/handoff.md` 啟動專案
4. 找到主流程、資料入口與 render path
5. 完成 handoff issue 指定的小修改
6. 回報哪裡清楚、哪裡不清楚

不熟 Git 時可先照 staff 給的 repo URL：

```bash
git clone <repo-url>
cd <repo-name>
pnpm install
pnpm dev
```

環境問題最多卡 5 分鐘。若還是無法啟動，記錄指令、錯誤和卡點，然後求助。

## 成果放哪裡

- 前端 demo 修改要接到對方 repo 的 `src/app/App.tsx`
- normalized data 放對方 repo 的 `src/fixtures/workspace/`
- adapter 放 `src/adapters/`
- 測試放 `tests/`
- feedback 依 staff 指示回覆 handoff issue；若沒指定，先回在 issue

## 不做什麼

- 不重構另一組專案
- 不批評 UI 美醜
- 不改變另一組核心設計
- 不只看 code 而不打開 demo
- 不為了啟動而改 Node 版本、package manager、lockfile、CI 或 deploy 設定

## 必須交付

- [ ] 成功啟動另一組 repo，或記錄啟動失敗原因
- [ ] 打開 demo，理解可展示成果
- [ ] 找到主流程入口與資料來源
- [ ] 完成一個小修改，或清楚說明阻塞點
- [ ] 給原組至少 2 個 handoff feedback，最好引用具體畫面、檔案或文件段落
- [ ] 在自己組內記錄接手觀察

## 停止條件

19:25 停止修改，準備回到自己的成果包裝。
