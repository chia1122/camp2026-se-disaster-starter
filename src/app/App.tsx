import { type FormEvent, useMemo, useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import reportsData from "../fixtures/shared/reports.json";
import sitesData from "../fixtures/shared/sites.json";
import tasksData from "../fixtures/shared/tasks.json";
import assignmentsData from "../fixtures/shared/assignments.json";
import { RecordCard } from "../components/RecordCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { labelForStatus } from "../components/status-labels";
import {
  assignmentsSchema,
  reportsSchema,
  sitesSchema,
  tasksSchema,
} from "../contracts";
import { safeParseFixture } from "../lib/load-fixture";

type TabKey =
  | "githubPages"
  | "messy"
  | "reports"
  | "sites"
  | "tasks"
  | "assignments"
  | "newTask";
type CategoryKey = "report" | "site_status" | "volunteer_task" | "assignment";
type SeverityKey = "critical" | "high" | "medium" | "low";
type SortKey =
  "severity" | "category" | "verification" | "people" | "updatedAt";

type MessyReport = {
  id: string;
  rawText: string;
  sourceType: string;
  verificationStatus: string;
  updatedAt: string;
};

type Phase0Assessment = {
  categories: CategoryKey[];
  severity: SeverityKey;
  peopleEstimate: number;
  situation: string;
  unknowns: string[];
  blockers: string[];
};

type DraftTask = {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  severity: SeverityKey;
  verificationStatus: string;
  peopleEstimate: number;
  sourceReference: string;
};

type ConfirmationNote = {
  focus: string;
  owner: string;
  nextStep: string;
  note: string;
};

type DraftAssignment = {
  id: string;
  taskId: string;
  volunteerGroupId: string;
  peopleCount: number;
  status: string;
  decidedByRole: string;
  decisionReason: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "githubPages", label: "GitHub Pages 展示" },
  { key: "messy", label: "第一階段原始資訊" },
  { key: "reports", label: "通報" },
  { key: "sites", label: "地點" },
  { key: "tasks", label: "志工任務" },
  { key: "assignments", label: "人員指派" },
  { key: "newTask", label: "新增工作" },
];

const categoryLabels: Record<CategoryKey, string> = {
  report: "通報",
  site_status: "地點狀態",
  volunteer_task: "志工任務",
  assignment: "人員指派",
};

const severityLabels: Record<SeverityKey, string> = {
  critical: "高風險",
  high: "需快速查核",
  medium: "資訊衝突",
  low: "持續觀察",
};

const sortLabels: Record<SortKey, string> = {
  severity: "風險程度",
  category: "災害分類",
  verification: "查核狀態",
  people: "人數預估",
  updatedAt: "更新時間",
};

const phase0Assessments: Record<string, Phase0Assessment> = {
  "M-001": {
    categories: ["report", "volunteer_task"],
    severity: "high",
    peopleEstimate: 12,
    situation: "疑似清泥人力需求，但地點只描述為老雜貨店後面。",
    unknowns: ["精確地址", "需要人數是否仍為十幾人", "現場是否安全"],
    blockers: ["不能用模糊地點派工", "缺少任務負責人或回報窗口"],
  },
  "M-002": {
    categories: ["site_status"],
    severity: "medium",
    peopleEstimate: 0,
    situation: "活動中心可能仍有雨鞋，但資訊只確認到早上。",
    unknowns: ["下午庫存", "可領取方式", "是否有人管理物資"],
    blockers: ["不能把早上庫存顯示成現在仍有", "不能直接引導人潮前往"],
  },
  "M-003": {
    categories: ["site_status", "volunteer_task"],
    severity: "medium",
    peopleEstimate: 2,
    situation: "老街口需求可能從鏟子改為水電，且舊單可能過期。",
    unknowns: ["原始單據版本", "水電需求內容", "是否已有人接手"],
    blockers: ["不能讓舊任務繼續招募錯誤技能", "需要確認技能需求再發布"],
  },
  "M-004": {
    categories: ["site_status"],
    severity: "medium",
    peopleEstimate: 0,
    situation: "社群貼文聲稱活動中心有很多雨鞋，可能和稍早志工資訊重疊或衝突。",
    unknowns: ["貼文時間", "物資數量", "是否來自現場人員"],
    blockers: ["不能把社群留言當成 verified 庫存", "不能直接導流領取"],
  },
  "M-005": {
    categories: ["report", "site_status"],
    severity: "high",
    peopleEstimate: 3,
    situation: "臨時物資站疑似缺飲用水，但地點有兩個可能位置。",
    unknowns: ["正確物資站位置", "缺水數量", "補給窗口"],
    blockers: ["不能把物資送到未確認地點", "不能建立沒有收受窗口的任務"],
  },
  "M-006": {
    categories: ["site_status"],
    severity: "high",
    peopleEstimate: 0,
    situation: "道路封閉截圖可能影響行動安全，但日期與官方性不明。",
    unknowns: ["公告日期", "發布單位", "道路封閉範圍"],
    blockers: ["不能用不明日期截圖判斷道路可通行", "需要人工確認官方來源"],
  },
  "M-007": {
    categories: ["report"],
    severity: "critical",
    peopleEstimate: 1,
    situation: "疑似個人醫療需求，資訊嚴重不足且可能涉及個資與安全。",
    unknowns: ["姓名或可聯絡窗口", "橋梁位置", "藥品需求與急迫性"],
    blockers: [
      "不能公開個人醫療資訊",
      "不能派人到不明位置",
      "需要人工查核與隱私保護",
    ],
  },
  "M-008": {
    categories: ["site_status", "volunteer_task"],
    severity: "high",
    peopleEstimate: 0,
    situation: "學校側門被提議為集合點，但另一筆資訊指出剛淹水不適合停留。",
    unknowns: ["目前水位", "集合點替代方案", "最新現場回報時間"],
    blockers: ["不能把可能危險地點設為集合點", "需要確認後才可安排志工集合"],
  },
  "M-009": {
    categories: ["volunteer_task", "assignment"],
    severity: "medium",
    peopleEstimate: 4,
    situation: "水電工班支援名單可能已過期，不能視為今日可用人力。",
    unknowns: ["工班今日是否可支援", "技能與人數", "聯絡窗口"],
    blockers: ["不能直接指派過期名單", "需要重新確認可用時段"],
  },
  "M-010": {
    categories: ["site_status", "volunteer_task"],
    severity: "high",
    peopleEstimate: 0,
    situation: "A 區暫停派人，但原因可能是過量、危險或任務完成。",
    unknowns: ["暫停原因", "A 區範圍", "何時重新評估"],
    blockers: ["不能只靠一句話關閉任務", "若是安全風險需明確標示"],
  },
};

const severityOrder: SeverityKey[] = ["critical", "high", "medium", "low"];
const categoryOrder: CategoryKey[] = [
  "report",
  "site_status",
  "volunteer_task",
  "assignment",
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("githubPages");
  const [draftTasks, setDraftTasks] = useState<DraftTask[]>([]);
  const [draftAssignments, setDraftAssignments] = useState<DraftAssignment[]>(
    [],
  );

  const parsed = useMemo(() => {
    const reports = safeParseFixture(
      reportsSchema,
      reportsData,
      "src/fixtures/shared/reports.json",
    );
    if (!reports.success) return reports;

    const sites = safeParseFixture(
      sitesSchema,
      sitesData,
      "src/fixtures/shared/sites.json",
    );
    if (!sites.success) return sites;

    const tasks = safeParseFixture(
      tasksSchema,
      tasksData,
      "src/fixtures/shared/tasks.json",
    );
    if (!tasks.success) return tasks;

    const assignments = safeParseFixture(
      assignmentsSchema,
      assignmentsData,
      "src/fixtures/shared/assignments.json",
    );
    if (!assignments.success) return assignments;

    return {
      success: true as const,
      data: {
        reports: reports.data,
        sites: sites.data,
        tasks: tasks.data,
        assignments: assignments.data,
      },
    };
  }, []);

  const records = parsed.success
    ? (() => {
        if (activeTab === "messy") return messyReports;
        if (activeTab === "newTask") return [];
        if (activeTab === "reports") return parsed.data.reports;
        if (activeTab === "sites") return parsed.data.sites;
        if (activeTab === "tasks") return parsed.data.tasks;
        return parsed.data.assignments;
      })()
    : [];

  const messyRecords = messyReports as MessyReport[];
  const severityCounts = severityOrder.map((severity) => ({
    severity,
    count: messyRecords.filter(
      (record) => phase0Assessments[record.id]?.severity === severity,
    ).length,
  }));

  return (
    <main className="layout">
      <header className="hero">
        <p className="eyebrow">SITCON Camp 2026</p>
        <h1>災害資訊積木起始專案</h1>
        <p>
          先面對混亂資料，再透過規格、資料格式、轉換器與測試，把前端原型做成可交接的資訊元件。
        </p>
      </header>

      {parsed.success ? (
        <nav className="tabs" aria-label="資料分類">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              type="button"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      ) : null}

      <section className="panel">
        {!parsed.success ? (
          <ErrorState message={parsed.message} />
        ) : activeTab === "githubPages" ? (
          <GithubPagesPreview
            draftAssignmentsCount={draftAssignments.length}
            draftTasksCount={draftTasks.length}
            messyCount={messyRecords.length}
          />
        ) : activeTab === "newTask" ? (
          <NewTaskPage
            draftTasks={draftTasks}
            onAddTask={(task) => setDraftTasks((current) => [task, ...current])}
          />
        ) : activeTab === "assignments" ? (
          <AssignmentPage
            existingAssignments={parsed.data.assignments}
            tasks={parsed.data.tasks}
            draftAssignments={draftAssignments}
            onAddAssignment={(assignment) =>
              setDraftAssignments((current) => [assignment, ...current])
            }
          />
        ) : records.length === 0 ? (
          <EmptyState message="目前沒有資料" />
        ) : activeTab === "messy" ? (
          <Phase0Workbench records={messyRecords} counts={severityCounts} />
        ) : (
          <>
            <div className="panel__header">
              <h2>{tabs.find((tab) => tab.key === activeTab)?.label}</h2>
              <p>{records.length} 筆資料</p>
            </div>
            <div className="grid">
              {records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function GithubPagesPreview({
  messyCount,
  draftTasksCount,
  draftAssignmentsCount,
}: {
  messyCount: number;
  draftTasksCount: number;
  draftAssignmentsCount: number;
}) {
  return (
    <>
      <div className="pages-hero">
        <p className="eyebrow">GitHub Pages Demo</p>
        <h2>災害資訊積木展示頁</h2>
        <p>
          這個畫面就是部署到 <code>github.io</code>{" "}
          後首頁會看見的主要入口；所有成果都從 Vite app 進入，不依賴後端或外部
          API。
        </p>
      </div>

      <div className="pages-grid">
        <article>
          <span className="metric-number">{messyCount}</span>
          <h3>Phase 0 原始資訊</h3>
          <p>保留 dirty data 與人工確認脈絡，不直接宣稱為已確認事實。</p>
        </article>
        <article>
          <span className="metric-number">{draftTasksCount}</span>
          <h3>新增工作草稿</h3>
          <p>前端 runtime 草稿，適合展示與討論，重新整理後不保存。</p>
        </article>
        <article>
          <span className="metric-number">{draftAssignmentsCount}</span>
          <h3>人員指派草稿</h3>
          <p>表單欄位貼合 Assignment schema，但送出後仍需人工確認。</p>
        </article>
      </div>

      <div className="pages-checklist">
        <h3>GitHub Pages 檢核</h3>
        <ul>
          <li>首頁可進入災害分類工作台。</li>
          <li>可填寫人工確認重點。</li>
          <li>可新增工作草稿與人員指派草稿。</li>
          <li>資料來源與查核狀態持續可見。</li>
        </ul>
      </div>
    </>
  );
}

function Phase0Workbench({
  records,
  counts,
}: {
  records: MessyReport[];
  counts: Array<{ severity: SeverityKey; count: number }>;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const sortedRecords = [...records].sort((a, b) =>
    comparePhase0Records(a, b, sortKey),
  );

  return (
    <>
      <div className="panel__header">
        <div>
          <h2>災害情況分類工作台</h2>
          <p className="panel__note">
            Phase 0
            原始資料尚未整理成核心模型；以下分類是協作判斷輔助，不代表已確認事實。
          </p>
        </div>
        <p>{records.length} 筆原始資訊</p>
      </div>

      <div className="severity-summary" aria-label="風險程度摘要">
        {counts.map(({ severity, count }) => (
          <span className={`severity-pill severity-${severity}`} key={severity}>
            {severityLabels[severity]}：{count}
          </span>
        ))}
      </div>

      <div className="toolbar" aria-label="工作排序工具列">
        <label>
          排序
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="workbench">
        {sortedRecords.map((record) => (
          <Phase0Row key={record.id} record={record} />
        ))}
      </div>
    </>
  );
}

function Phase0Row({ record }: { record: MessyReport }) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [confirmationNote, setConfirmationNote] = useState<ConfirmationNote>({
    focus: "",
    owner: "",
    nextStep: "",
    note: "",
  });
  const assessment = phase0Assessments[record.id];
  const toggleReason = (reason: string) => {
    setSelectedReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  return (
    <article className="workbench-row">
      <section className="raw-column" aria-label={`${record.id} 原始資訊`}>
        <RecordCard record={record} />
      </section>

      <section
        className={`assessment-column severity-border-${assessment.severity}`}
        aria-label={`${record.id} 判斷結果`}
      >
        <div className="assessment-column__header">
          <div>
            <p className="assessment-label">災害情況分類</p>
            <h3>{assessment.situation}</h3>
          </div>
          <span className={`severity-pill severity-${assessment.severity}`}>
            {severityLabels[assessment.severity]}
          </span>
        </div>

        <div className="category-list">
          {assessment.categories.map((category) => (
            <span
              className={`category-chip category-${category}`}
              key={category}
            >
              {categoryLabels[category]}
            </span>
          ))}
          <span className="people-chip">
            人數預估：{formatPeopleEstimate(assessment.peopleEstimate)}
          </span>
        </div>

        <div className="assessment-grid">
          <div>
            <h4>還不知道如何判斷</h4>
            <div className="reason-buttons">
              {assessment.unknowns.map((unknown) => (
                <button
                  aria-pressed={selectedReasons.includes(unknown)}
                  className={
                    selectedReasons.includes(unknown) ? "selected" : ""
                  }
                  key={unknown}
                  type="button"
                  onClick={() => toggleReason(unknown)}
                >
                  {unknown}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4>不能直接變成任務</h4>
            <div className="reason-buttons">
              {assessment.blockers.map((blocker) => (
                <button
                  aria-pressed={selectedReasons.includes(blocker)}
                  className={
                    selectedReasons.includes(blocker) ? "selected" : ""
                  }
                  key={blocker}
                  type="button"
                  onClick={() => toggleReason(blocker)}
                >
                  {blocker}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="selection-summary">
          已選填 {selectedReasons.length} 個人工確認重點
        </div>

        <form
          className="confirmation-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <h4>人工確認重點表單</h4>
          <div className="form-grid">
            <label>
              查核問題
              <input
                value={confirmationNote.focus}
                onChange={(event) =>
                  setConfirmationNote((current) => ({
                    ...current,
                    focus: event.target.value,
                  }))
                }
                placeholder="例如：需要確認正確地點"
              />
            </label>
            <label>
              負責人或角色
              <input
                value={confirmationNote.owner}
                onChange={(event) =>
                  setConfirmationNote((current) => ({
                    ...current,
                    owner: event.target.value,
                  }))
                }
                placeholder="例如：現場志工、查核者"
              />
            </label>
          </div>
          <label>
            下一步
            <input
              value={confirmationNote.nextStep}
              onChange={(event) =>
                setConfirmationNote((current) => ({
                  ...current,
                  nextStep: event.target.value,
                }))
              }
              placeholder="例如：聯絡回報者確認時間與位置"
            />
          </label>
          <label>
            備註
            <textarea
              value={confirmationNote.note}
              onChange={(event) =>
                setConfirmationNote((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              placeholder="記錄不能直接派工的判斷脈絡。"
            />
          </label>
        </form>
      </section>
    </article>
  );
}

function AssignmentPage({
  existingAssignments,
  tasks,
  draftAssignments,
  onAddAssignment,
}: {
  existingAssignments: Array<{
    id: string;
    taskId: string;
    volunteerGroupId: string;
    peopleCount: number;
    status: string;
    decidedByRole?: string;
    decisionReason?: string;
  }>;
  tasks: Array<{ id: string; title: string; peopleNeeded?: number }>;
  draftAssignments: DraftAssignment[];
  onAddAssignment: (assignment: DraftAssignment) => void;
}) {
  const firstTaskId = tasks[0]?.id ?? "";
  const [taskId, setTaskId] = useState(firstTaskId);
  const [volunteerGroupId, setVolunteerGroupId] = useState("VG-DRAFT");
  const [peopleCount, setPeopleCount] = useState(1);
  const [status, setStatus] = useState("requested");
  const [decidedByRole, setDecidedByRole] = useState("coordinator");
  const [decisionReason, setDecisionReason] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskId || !volunteerGroupId.trim() || peopleCount <= 0) return;

    onAddAssignment({
      id: `ASSIGN-DRAFT-${String(draftAssignments.length + 1).padStart(3, "0")}`,
      taskId,
      volunteerGroupId: volunteerGroupId.trim(),
      peopleCount,
      status,
      decidedByRole: decidedByRole.trim(),
      decisionReason: decisionReason.trim(),
    });

    setTaskId(firstTaskId);
    setVolunteerGroupId("VG-DRAFT");
    setPeopleCount(1);
    setStatus("requested");
    setDecidedByRole("coordinator");
    setDecisionReason("");
  };

  const allAssignments = [...draftAssignments, ...existingAssignments];

  return (
    <>
      <div className="panel__header">
        <div>
          <h2>人員指派表單</h2>
          <p className="panel__note">
            指派草稿依照 Assignment
            欄位設計；送出後先留在前端畫面，仍需人工確認。
          </p>
        </div>
        <p>{allAssignments.length} 筆指派</p>
      </div>

      <div className="task-page">
        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            對應工作
            <select
              required
              value={taskId}
              onChange={(event) => setTaskId(event.target.value)}
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.id}｜{task.title}
                  {task.peopleNeeded ? `｜需求 ${task.peopleNeeded} 人` : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="form-grid">
            <label>
              志工群組 ID
              <input
                required
                value={volunteerGroupId}
                onChange={(event) => setVolunteerGroupId(event.target.value)}
                placeholder="例如：VG-003"
              />
            </label>
            <label>
              指派人數
              <input
                min="1"
                required
                type="number"
                value={peopleCount}
                onChange={(event) => setPeopleCount(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              指派狀態
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="requested">請求中</option>
                <option value="confirmed">已確認承接</option>
                <option value="rejected">已拒絕</option>
                <option value="cancelled">已取消</option>
                <option value="completed">已完成</option>
              </select>
            </label>
            <label>
              決策角色
              <input
                value={decidedByRole}
                onChange={(event) => setDecidedByRole(event.target.value)}
                placeholder="例如：coordinator"
              />
            </label>
          </div>

          <label>
            指派原因與限制
            <textarea
              value={decisionReason}
              onChange={(event) => setDecisionReason(event.target.value)}
              placeholder="記錄人數、技能、風險或為何需要人工確認。"
            />
          </label>

          <button className="primary-action" type="submit">
            新增指派草稿
          </button>
        </form>

        <section className="draft-list" aria-label="人員指派列表">
          {allAssignments.map((assignment) => (
            <article className="draft-card" key={assignment.id}>
              <div className="assessment-column__header">
                <div>
                  <p className="assessment-label">{assignment.id}</p>
                  <h3>{assignment.taskId}</h3>
                </div>
                <span className={`status-badge status-${assignment.status}`}>
                  {labelForStatus(assignment.status)}
                </span>
              </div>
              <div className="category-list">
                <span className="category-chip category-assignment">
                  {assignment.volunteerGroupId}
                </span>
                <span className="people-chip">
                  指派：{assignment.peopleCount} 人
                </span>
              </div>
              {assignment.decidedByRole ? (
                <p className="draft-card__meta">
                  決策角色：{assignment.decidedByRole}
                </p>
              ) : null}
              {assignment.decisionReason ? (
                <p>{assignment.decisionReason}</p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

function NewTaskPage({
  draftTasks,
  onAddTask,
}: {
  draftTasks: DraftTask[];
  onAddTask: (task: DraftTask) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryKey>("volunteer_task");
  const [severity, setSeverity] = useState<SeverityKey>("medium");
  const [verificationStatus, setVerificationStatus] = useState("needs_review");
  const [peopleEstimate, setPeopleEstimate] = useState(1);
  const [sourceReference, setSourceReference] = useState("manual_input");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddTask({
      id: `DRAFT-${String(draftTasks.length + 1).padStart(3, "0")}`,
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      verificationStatus,
      peopleEstimate,
      sourceReference: sourceReference.trim() || "manual_input",
    });

    setTitle("");
    setDescription("");
    setCategory("volunteer_task");
    setSeverity("medium");
    setVerificationStatus("needs_review");
    setPeopleEstimate(1);
    setSourceReference("manual_input");
  };

  return (
    <>
      <div className="panel__header">
        <div>
          <h2>新增工作草稿</h2>
          <p className="panel__note">
            這裡只建立前端 mock
            草稿，供協作者討論；送出後仍是待人工確認，不會寫入後端或資料庫。
          </p>
        </div>
        <p>{draftTasks.length} 筆草稿</p>
      </div>

      <div className="task-page">
        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            工作名稱
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：物資站飲用水補給確認"
            />
          </label>

          <label>
            工作描述
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="寫下來源、仍需確認的資訊，以及為什麼不能直接派工。"
            />
          </label>

          <div className="form-grid">
            <label>
              災害情況分類
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CategoryKey)
                }
              >
                {categoryOrder.map((item) => (
                  <option key={item} value={item}>
                    {categoryLabels[item]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              風險程度
              <select
                value={severity}
                onChange={(event) =>
                  setSeverity(event.target.value as SeverityKey)
                }
              >
                {severityOrder.map((item) => (
                  <option key={item} value={item}>
                    {severityLabels[item]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              查核狀態
              <select
                value={verificationStatus}
                onChange={(event) => setVerificationStatus(event.target.value)}
              >
                <option value="needs_review">待人工確認</option>
                <option value="unverified">未查核</option>
              </select>
            </label>

            <label>
              人數預估
              <input
                min="0"
                type="number"
                value={peopleEstimate}
                onChange={(event) =>
                  setPeopleEstimate(Number(event.target.value))
                }
              />
            </label>
          </div>

          <label>
            來源或關聯編號
            <input
              value={sourceReference}
              onChange={(event) => setSourceReference(event.target.value)}
              placeholder="例如：M-005、field_note、manual_input"
            />
          </label>

          <button className="primary-action" type="submit">
            新增待確認工作
          </button>
        </form>

        <section className="draft-list" aria-label="新增工作草稿列表">
          {draftTasks.length === 0 ? (
            <EmptyState message="尚未新增工作草稿" />
          ) : (
            draftTasks.map((task) => (
              <article
                className={`draft-card severity-border-${task.severity}`}
                key={task.id}
              >
                <div className="assessment-column__header">
                  <div>
                    <p className="assessment-label">{task.id}</p>
                    <h3>{task.title}</h3>
                  </div>
                  <span className={`severity-pill severity-${task.severity}`}>
                    {severityLabels[task.severity]}
                  </span>
                </div>
                <p>{task.description}</p>
                <div className="category-list">
                  <span className={`category-chip category-${task.category}`}>
                    {categoryLabels[task.category]}
                  </span>
                  <span className="people-chip">
                    人數預估：{formatPeopleEstimate(task.peopleEstimate)}
                  </span>
                  <span className="status-badge status-needs_review">
                    {labelForStatus(task.verificationStatus)}
                  </span>
                </div>
                <p className="draft-card__meta">來源：{task.sourceReference}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </>
  );
}

function comparePhase0Records(
  first: MessyReport,
  second: MessyReport,
  sortKey: SortKey,
) {
  const firstAssessment = phase0Assessments[first.id];
  const secondAssessment = phase0Assessments[second.id];

  if (sortKey === "severity") {
    return (
      severityOrder.indexOf(firstAssessment.severity) -
      severityOrder.indexOf(secondAssessment.severity)
    );
  }

  if (sortKey === "category") {
    return (
      categoryOrder.indexOf(firstAssessment.categories[0]) -
      categoryOrder.indexOf(secondAssessment.categories[0])
    );
  }

  if (sortKey === "verification") {
    return first.verificationStatus.localeCompare(second.verificationStatus);
  }

  if (sortKey === "people") {
    return secondAssessment.peopleEstimate - firstAssessment.peopleEstimate;
  }

  return (
    new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
  );
}

function formatPeopleEstimate(peopleEstimate: number) {
  return peopleEstimate > 0 ? `${peopleEstimate} 人` : "未估";
}
