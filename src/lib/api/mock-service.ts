import type {
  Principal,
  TaskDTO,
  EpicDTO,
  SprintDTO,
  Sprint,
  MilestoneDTO,
  IncidentDTO,
  ApprovalSummary,
  ApprovalCount,
  SpecManifest,
  SpecOverview,
  SpecDashboard,
  Constitution,
  ValidationReport,
  RequirementTrace,
  CheckResult,
  SpecDraft,
  RunTrace,
  AuditListResponse,
  Listing,
  PublicLeaderboard,
  PublicBenchmark,
  CostSummary,
  CostTimeseries,
  AoSettingsOut,
  RoleConfigListResponse,
  SelfEvalStatusOut,
  DeploymentRead,
  DeploymentDetail,
  PipelineRead,
  VelocityDashboard,
} from "./types";

// In-memory persistent state for demo
export const mockTasks: TaskDTO[] = [
  {
    id: "task-101",
    key: "FORGE-101",
    project_id: "prj_demo",
    epic_id: "epic-1",
    kind: "feature",
    title: "Sandboxed agent runtime with git-worktree isolation",
    description: "Provide container-level execution isolation with rollback and step telemetry.",
    status: "in_progress",
    priority: "urgent",
    estimate: 5,
    execution_mode: "single_agent",
    labels: ["runtime", "agent", "security"],
    assignee_id: "usr_demo_admin",
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-102",
    key: "FORGE-102",
    project_id: "prj_demo",
    epic_id: "epic-1",
    kind: "feature",
    title: "Hybrid knowledge retrieval with BM25 + pgvector reranking",
    description: "Index codebase symbols, commit logs, and docs into PostgreSQL vector tables.",
    status: "in_review",
    priority: "high",
    estimate: 3,
    execution_mode: "single_agent",
    labels: ["rag", "knowledge", "search"],
    assignee_id: "usr_demo_admin",
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-103",
    key: "FORGE-103",
    project_id: "prj_demo",
    epic_id: "epic-2",
    kind: "feature",
    title: "Spec validation engine and manifest.yaml parser",
    description: "Author and enforce SDD specs, auto-generating requirement-to-task matrix.",
    status: "ready_for_agent",
    priority: "high",
    estimate: 8,
    execution_mode: "supervised_multi_agent",
    labels: ["spec", "sdd", "validation"],
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-104",
    key: "FORGE-104",
    project_id: "prj_demo",
    epic_id: "epic-2",
    kind: "bug",
    title: "Resolve CSP iframe frame-ancestors reflection",
    description: "Configure embedding policies so Forge previews mount cleanly inside AI Studio.",
    status: "done",
    priority: "urgent",
    estimate: 2,
    labels: ["security", "frontend"],
    assignee_id: "usr_demo_admin",
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-105",
    key: "FORGE-105",
    project_id: "prj_demo",
    epic_id: "epic-3",
    kind: "chore",
    title: "Hash-chained immutable audit log signing with Ed25519",
    description: "Anchor all agent mutations into cryptographic merkle tree batches.",
    status: "done",
    priority: "medium",
    estimate: 3,
    labels: ["audit", "cryptography"],
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-106",
    key: "FORGE-106",
    project_id: "prj_demo",
    epic_id: "epic-3",
    kind: "spike",
    title: "Evaluate model routing latency across Claude 3.7 & Gemini 2.5",
    description: "Benchmark reasoning step costs and tool invocation speed across coding tasks.",
    status: "backlog",
    priority: "low",
    estimate: 5,
    labels: ["benchmarks", "models"],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-107",
    key: "FORGE-107",
    project_id: "prj_demo",
    epic_id: "epic-2",
    kind: "feature",
    title: "Visual workflow state-machine editor and DAG inspector",
    description: "Interactive node canvas for governing multi-step agent orchestration loops.",
    status: "ready",
    priority: "high",
    estimate: 5,
    labels: ["workflow", "canvas"],
    sprint_id: "sprint-1",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockEpics: EpicDTO[] = [
  {
    id: "epic-1",
    key: "EPIC-1",
    project_id: "prj_demo",
    title: "Sandboxed Agent Runtime",
    description: "Worktree isolation, container sandboxes, time-travel replay and step logs.",
    status: "in_progress",
    labels: ["core", "runtime"],
  },
  {
    id: "epic-2",
    key: "EPIC-2",
    project_id: "prj_demo",
    title: "Spec-Driven Development (SDD)",
    description: "Requirements traceability, manifest validation, and automated task synthesis.",
    status: "in_progress",
    labels: ["spec", "governance"],
  },
  {
    id: "epic-3",
    key: "EPIC-3",
    project_id: "prj_demo",
    title: "Enterprise Governance & Security",
    description: "RBAC, SSO/SCIM federation, Ed25519 audit logs, and approval gates.",
    status: "ready",
    labels: ["security", "admin"],
  },
];

export const mockSprints: SprintDTO[] = [
  {
    id: "sprint-1",
    project_id: "prj_demo",
    name: "Sprint 14 — Runtime & SDD Engine",
    starts_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 9).toISOString(),
    goal: "Ship sandbox runtime, live Kanban board, and spec traceability matrix.",
  },
  {
    id: "sprint-2",
    project_id: "prj_demo",
    name: "Sprint 15 — Multi-Agent Workflows",
    starts_at: new Date(Date.now() + 86400000 * 10).toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 24).toISOString(),
    goal: "Deploy workflow visual editor and self-eval automated gate.",
  },
];

export const mockProjectSprints: Sprint[] = [
  {
    id: "sprint-1",
    project_id: "default",
    workspace_id: "ws-default",
    name: "Sprint 14 — Runtime & SDD Engine",
    goal: "Ship sandbox runtime, live Kanban board, and spec traceability matrix.",
    state: "active",
    start_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 9).toISOString(),
    started_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    committed_points: 38,
    committed_task_count: 12,
    completed_points: 22,
    added_points: 4,
    removed_points: 0,
    carryover_points: 0,
    remaining_points: 16,
    predictability: 0.88,
    scope_change_ratio: 0.1,
    velocity_version: 1,
  },
  {
    id: "sprint-2",
    project_id: "default",
    workspace_id: "ws-default",
    name: "Sprint 15 — Multi-Agent Workflows",
    goal: "Deploy workflow visual editor and self-eval automated gate.",
    state: "planned",
    start_date: new Date(Date.now() + 86400000 * 10).toISOString(),
    end_date: new Date(Date.now() + 86400000 * 24).toISOString(),
    committed_points: 42,
    committed_task_count: 14,
    completed_points: 0,
    added_points: 0,
    removed_points: 0,
    carryover_points: 0,
    remaining_points: 42,
    predictability: 0,
    scope_change_ratio: 0,
    velocity_version: 1,
  },
];

export const mockMilestones: MilestoneDTO[] = [
  {
    id: "ms-1",
    project_id: "prj_demo",
    name: "v0.9 Developer Preview",
    due_at: new Date(Date.now() + 86400000 * 14).toISOString(),
    description: "First public developer preview with spec engine.",
  },
  {
    id: "ms-2",
    project_id: "prj_demo",
    name: "v1.0 General Availability",
    due_at: new Date(Date.now() + 86400000 * 90).toISOString(),
    description: "Enterprise ready with RBAC and SSO.",
  },
];

export const mockIncidents: IncidentDTO[] = [
  {
    id: "inc-1",
    key: "INC-1",
    project_id: "prj_demo",
    title: "Sandbox container memory ceiling warning during benchmark run",
    severity: "medium",
    state: "mitigated",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const mockApprovals: ApprovalSummary[] = [
  {
    id: "appr-1",
    gate_type: "deployment",
    status: "pending",
    title: "Promote v0.9.4 release candidate to Staging cluster",
    risk_level: "medium",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    requester: { email: "agent-runner@forge.local", name: "Agent Runner" },
  } as unknown as ApprovalSummary,
  {
    id: "appr-2",
    gate_type: "spec_signoff",
    status: "pending",
    title: "Sign-off SDD Manifest: Agent Auto-Triage Loop",
    risk_level: "low",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    requester: { email: "admin@forge.local", name: "Demo Admin" },
  } as unknown as ApprovalSummary,
];

export const mockCurrentUser: Principal = {
  user_id: "usr_demo_admin",
  workspace_id: "ws_demo",
  email: "admin@forge.local",
  role: "admin",
  auth_method: "api_key",
};

export const mockAudit: AuditListResponse = {
  items: [
    {
      id: "audit-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      actor: "admin@forge.local",
      action: "task.status_transition",
      resource_type: "task",
      resource_id: "FORGE-104",
      outcome: "success",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      details: { previous_status: "in_review", new_status: "done" },
    } as any,
    {
      id: "audit-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      actor: "agent-orchestrator",
      action: "agent.execution_started",
      resource_type: "run",
      resource_id: "run-forge-421",
      outcome: "success",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      details: { model: "claude-3-7-sonnet", task_key: "FORGE-101" },
    } as any,
  ],
  next_cursor: null,
};

export const mockConstitution: Constitution = {
  id: "const-1",
  project_id: "default",
  principles: [
    "Every autonomous action must run inside an ephemeral isolated sandbox",
    "Traceability from requirement to acceptance test is mandatory before production merge",
    "Zero plaintext credentials in agent prompts, artifacts, or trace telemetry",
    "Deterministic execution replays must be reproducible from git worktrees and commits",
  ],
  architecture_guardrails: [
    "All backend APIs must enforce tenant-level RBAC, idempotency keys, and audit logs",
    "Asynchronous worker queues must support backoff retry policies and dead-letter queues",
    "Database schema migrations must be backward-compatible with N-1 service versions",
    "Container resource limits (CPU ceiling and memory limits) are strictly enforced",
  ],
  content: `# Project Engineering Constitution

## Article I: Sandbox Isolation & Containment
All autonomous agent executions must occur within isolated, ephemeral worktrees and Linux cgroup containers. No agent process may access host credentials or un-allowlisted outbound network endpoints.

## Article II: Strict Spec-Driven Traceability
No production pull request may be merged without 100% acceptance criteria coverage mapped to verified automated test cases.

## Article III: Secret Hygiene & Redaction
All environment secrets, session tokens, and keys must be masked in runtime traces and persistent audit ledgers using cryptographic hashes.`,
};

export const mockSpecs: SpecOverview[] = [
  {
    id: "spec-1",
    name: "Agent Execution Sandbox & Worktree Isolation",
    status: "approved",
    review_note: "Approved for production build. Sandbox security constraints validated.",
    plan_ref: "plan-sandbox-v1",
    tasks_ref: "tasks-sandbox-v1",
    validation_ref: "val-sandbox-v1",
    constitution_refs: ["const-1"],
    repos: ["forge-core", "forge-runtime"],
    execution_mode: "single_agent",
    skill_profile: "systems-engineer",
    requirements: [
      { id: "REQ-01", text: "Spin up isolated git-worktree per task run" },
      { id: "REQ-02", text: "Step-by-step diff capture and time-travel execution replay" },
      { id: "REQ-03", text: "Audit trail cryptographic signing with Ed25519 keys" },
      { id: "REQ-04", text: "Enforce cgroup resource limits (2 CPU cores, 4GB RAM ceiling)" },
    ],
    acceptance_criteria: [
      { id: "AC-01", text: "Worktree cleanly unmounted and pruned after run completion or cancellation" },
      { id: "AC-02", text: "Zero environment variables or auth tokens leaked in trace telemetry" },
      { id: "AC-03", text: "Sandbox CPU ceiling capped at 200% and memory capped at 4096 MB" },
    ],
    constraints: [
      { id: "C-01", text: "Must support Linux kernel namespaces without requiring root daemon" },
      { id: "C-02", text: "Network egress restricted to allowlisted package registries" },
    ],
    decisions: [
      {
        id: "ADR-01",
        title: "Use Git Worktrees over Full Clones",
        status: "accepted",
        context: "Cloning 2GB repositories per run causes excessive I/O latency and disk bloat.",
        decision: "Use lightweight git worktrees linked to a shared read-only bare repository cache.",
        consequences: "Workspace checkout reduced from 45s to 120ms; requires careful lock cleanup.",
      },
    ],
    validation: {
      spec_id: "spec-1",
      passed: true,
      coverage: 92,
      checks: [
        { name: "Schema & Syntax Integrity", passed: true, details: "Valid spec manifest structure" },
        { name: "Constitution Compliance", passed: true, details: "Adheres to Article I: Sandbox Isolation" },
        { name: "Security Audit & Secrets", passed: true, details: "No credential leak risk detected" },
        { name: "Requirement Traceability", passed: true, details: "All 4 requirements mapped to tests" },
      ],
      traceability: [
        {
          requirement_id: "REQ-01",
          text: "Spin up isolated git-worktree per task run",
          satisfied: true,
          acceptance_criteria_ids: ["AC-01"],
          task_refs: ["FORGE-101", "FORGE-102"],
          test_refs: ["test_sandbox_worktree_cleanup", "test_concurrent_worktree_isolation"],
        },
        {
          requirement_id: "REQ-02",
          text: "Step-by-step diff capture and time-travel replay",
          satisfied: true,
          acceptance_criteria_ids: ["AC-02"],
          task_refs: ["FORGE-103"],
          test_refs: ["test_diff_recording_replay"],
        },
        {
          requirement_id: "REQ-03",
          text: "Audit trail cryptographic signing",
          satisfied: true,
          acceptance_criteria_ids: ["AC-02"],
          task_refs: ["FORGE-104"],
          test_refs: ["test_audit_signature_verification"],
        },
        {
          requirement_id: "REQ-04",
          text: "Enforce cgroup resource limits (CPU, memory, disk I/O)",
          satisfied: true,
          acceptance_criteria_ids: ["AC-03"],
          task_refs: ["FORGE-105"],
          test_refs: ["test_cgroup_cpu_throttling"],
        },
      ],
    },
  },
  {
    id: "spec-2",
    name: "Hybrid Knowledge Retrieval (BM25 + Dense Vectors)",
    status: "clarifying",
    review_note: "Clarifying vector re-ranking latency thresholds before approval.",
    plan_ref: "plan-retrieval-v2",
    constitution_refs: ["const-1"],
    repos: ["forge-core", "forge-ai"],
    requirements: [
      { id: "REQ-10", text: "Inverted index for lexical search on code symbols" },
      { id: "REQ-11", text: "HNSW vector index with 768-dim embeddings" },
      { id: "REQ-12", text: "Reciprocal Rank Fusion (RRF) scoring module" },
    ],
    acceptance_criteria: [
      { id: "AC-10", text: "Sub-50ms latency on 100k chunk index query" },
      { id: "AC-11", text: "Top-5 MRR exceeds 0.85 on test benchmark" },
    ],
    constraints: [
      { id: "C-10", text: "Memory overhead under 512MB for vector storage" },
    ],
    validation: {
      spec_id: "spec-2",
      passed: true,
      coverage: 75,
      checks: [
        { name: "Schema Validation", passed: true, details: "Valid spec manifest structure" },
        { name: "Constitution Compliance", passed: true, details: "Passes memory ceiling" },
        { name: "Test Coverage", passed: true, details: "2 of 3 requirements verified" },
      ],
      traceability: [
        {
          requirement_id: "REQ-10",
          text: "Inverted index for lexical search on code symbols",
          satisfied: true,
          acceptance_criteria_ids: ["AC-10"],
          task_refs: ["FORGE-106"],
          test_refs: ["test_bm25_symbol_lookup"],
        },
        {
          requirement_id: "REQ-11",
          text: "HNSW vector index with 768-dim embeddings",
          satisfied: true,
          acceptance_criteria_ids: ["AC-10"],
          task_refs: ["FORGE-107"],
          test_refs: ["test_hnsw_vector_query"],
        },
        {
          requirement_id: "REQ-12",
          text: "Reciprocal Rank Fusion (RRF) scoring module",
          satisfied: false,
          acceptance_criteria_ids: ["AC-11"],
          task_refs: [],
          test_refs: [],
        },
      ],
    },
  },
  {
    id: "spec-3",
    name: "Workflow State Machine DSL & Visual Canvas",
    status: "draft",
    constitution_refs: ["const-1"],
    repos: ["forge-core"],
    requirements: [
      { id: "REQ-20", text: "Declarative JSON/YAML workflow definition schema" },
      { id: "REQ-21", text: "DAG topological sorter with cycle detection" },
      { id: "REQ-22", text: "Conditional branch transitions based on step output" },
    ],
    acceptance_criteria: [
      { id: "AC-20", text: "Throws explicit cycle detection error with cycle path nodes" },
      { id: "AC-21", text: "Workflow serializes and deserializes without state loss" },
    ],
    constraints: [
      { id: "C-20", text: "Zero external dependencies for the state machine engine" },
    ],
    validation: {
      spec_id: "spec-3",
      passed: false,
      coverage: 0,
      checks: [
        { name: "Schema Validation", passed: true, details: "Draft structure parsed" },
        { name: "Task Traceability", passed: false, details: "Pending task breakdown and review" },
      ],
      traceability: [],
    },
  },
  {
    id: "spec-4",
    name: "Cryptographic Audit Ledger & Ed25519 Attestation",
    status: "validated",
    review_note: "All gate checks passed with 100% verified traceability.",
    plan_ref: "plan-audit-v1",
    tasks_ref: "tasks-audit-v1",
    validation_ref: "val-audit-v1",
    constitution_refs: ["const-1"],
    requirements: [
      { id: "REQ-30", text: "SHA-256 hash chaining of sequential run step logs" },
      { id: "REQ-31", text: "Ed25519 signature per artifact published by agent" },
    ],
    acceptance_criteria: [
      { id: "AC-30", text: "Tampered logs fail verification with specific mismatch offset" },
      { id: "AC-31", text: "Public verification key downloadable from JWKS endpoint" },
    ],
    constraints: [
      { id: "C-30", text: "Constant-time signature verification to prevent timing attacks" },
    ],
    validation: {
      spec_id: "spec-4",
      passed: true,
      coverage: 100,
      checks: [
        { name: "Schema Validation", passed: true, details: "Full spec manifest structure" },
        { name: "Constitution Compliance", passed: true, details: "Adheres to Article III: Secret Hygiene" },
        { name: "Security Audit", passed: true, details: "Passed constant-time audit" },
        { name: "Traceability Complete", passed: true, details: "100% requirement to test mapping" },
      ],
      traceability: [
        {
          requirement_id: "REQ-30",
          text: "SHA-256 hash chaining of sequential run step logs",
          satisfied: true,
          acceptance_criteria_ids: ["AC-30"],
          task_refs: ["FORGE-110"],
          test_refs: ["test_hash_chain_integrity", "test_tampered_block_detection"],
        },
        {
          requirement_id: "REQ-31",
          text: "Ed25519 signature per artifact published by agent",
          satisfied: true,
          acceptance_criteria_ids: ["AC-31"],
          task_refs: ["FORGE-111"],
          test_refs: ["test_ed25519_signature_verification"],
        },
      ],
    },
  },
];

export const mockSpecDashboard: SpecDashboard = {
  project_id: "default",
  constitution: mockConstitution,
  specs: mockSpecs,
};

export const mockSpecManifest: SpecManifest = mockSpecs[0];

export const mockRunTrace: RunTrace = {
  id: "run-forge-421",
  task_id: "task-101",
  task_key: "FORGE-101",
  status: "completed",
  started_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  ended_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  agent_id: "forge-coder-v1",
  model: "claude-3-7-sonnet",
  tokens_prompt: 14200,
  tokens_completion: 3150,
  cost_usd: 0.088,
  steps: [
    {
      id: "step-1",
      name: "Context Retrieval",
      type: "retrieval",
      status: "success",
      duration_ms: 320,
      input: { query: "git worktree isolation container" },
      output: { chunks_found: 8, top_score: 0.94 },
    },
    {
      id: "step-2",
      name: "Plan Generation",
      type: "reasoning",
      status: "success",
      duration_ms: 1420,
      input: { task: "Implement LangGraph sandbox execution" },
      output: { steps_planned: 3, files_to_touch: ["runtime/sandbox.py", "runtime/worktree.py"] },
    },
    {
      id: "step-3",
      name: "Execute Code Modifications",
      type: "tool_call",
      status: "success",
      duration_ms: 2840,
      input: { tool: "edit_file", target: "runtime/sandbox.py" },
      output: { lines_modified: 48, status: "applied" },
    },
    {
      id: "step-4",
      name: "Test Verification",
      type: "tool_call",
      status: "success",
      duration_ms: 1980,
      input: { command: "pytest tests/test_sandbox.py" },
      output: { passed: 6, failed: 0 },
    },
  ],
} as unknown as RunTrace;

export const mockMarketplaceListings: Listing[] = [
  {
    id: "pkg-postgres-mcp",
    name: "Postgres Knowledge MCP",
    author: "Forge Team",
    version: "1.4.0",
    description: "Connect agent workflows directly to self-hosted relational schemas and vectors.",
    category: "connector",
    verified: true,
    installed: true,
    downloads: 1240,
  } as unknown as Listing,
  {
    id: "pkg-github-pr-guard",
    name: "GitHub PR Verification Gate",
    author: "Forge Team",
    version: "2.1.0",
    description: "Automated test gatekeeper and semantic commit verifier before PR merge.",
    category: "governance",
    verified: true,
    installed: true,
    downloads: 3890,
  } as unknown as Listing,
  {
    id: "pkg-slack-notifications",
    name: "Slack Incident & Approval Alerts",
    author: "Community",
    version: "0.8.2",
    description: "Two-way Slack notifications for pending approval gates and incident pages.",
    category: "integration",
    verified: true,
    installed: false,
    downloads: 620,
  } as unknown as Listing,
];

export const mockLeaderboard: PublicLeaderboard = {
  benchmark_id: "bench-coding-orchestration-v1",
  title: "Autonomous Coding & Specification Benchmark",
  updated_at: new Date().toISOString(),
  entries: [
    { rank: 1, agent: "Forge Supervised Agent (Claude 3.7)", score: 94.2, pass_rate: 0.96, cost_per_task: 0.12 },
    { rank: 2, agent: "Forge Standard Agent (Gemini 2.5 Flash)", score: 89.8, pass_rate: 0.91, cost_per_task: 0.03 },
    { rank: 3, agent: "Baseline LangGraph Agent", score: 81.4, pass_rate: 0.83, cost_per_task: 0.18 },
  ],
} as unknown as PublicLeaderboard;

export const mockDeployments: DeploymentRead[] = [
  {
    id: "dep-101",
    project_id: "default",
    environment_name: "development",
    repo_id: "repo-forge-core",
    commit_sha: "a1b2c3d4e5f",
    kind: "promotion",
    state: "succeeded",
    trigger: "auto_promote",
    initiated_by: "usr_agent_forge",
    health_status: "passing",
    requested_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    finished_at: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    id: "dep-102",
    project_id: "default",
    environment_name: "staging",
    repo_id: "repo-forge-core",
    commit_sha: "7f8b92ac012",
    kind: "promotion",
    state: "awaiting_approval",
    trigger: "manual",
    initiated_by: "usr_demo_admin",
    health_status: "passing",
    requested_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "dep-103",
    project_id: "default",
    environment_name: "production",
    repo_id: "repo-forge-core",
    commit_sha: "4e5f6a7b8c9",
    kind: "promotion",
    state: "succeeded",
    trigger: "manual",
    initiated_by: "usr_demo_admin",
    health_status: "passing",
    requested_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    finished_at: new Date(Date.now() - 86400000 * 2.9).toISOString(),
  },
];

export const mockPipeline: PipelineRead = {
  id: "pipe-default",
  project_id: "default",
  repo_id: "repo-forge-core",
  enabled: true,
  version: 1,
  environments: [
    {
      id: "env-dev",
      name: "development",
      rank: 1,
      is_restricted: false,
      requires_approval: false,
      gate_config: {},
      provider_config: {},
      health_check: {},
      currently_deployed: mockDeployments[0],
    },
    {
      id: "env-staging",
      name: "staging",
      rank: 2,
      is_restricted: false,
      requires_approval: true,
      gate_config: {},
      provider_config: {},
      health_check: {},
      currently_deployed: mockDeployments[1],
    },
    {
      id: "env-prod",
      name: "production",
      rank: 3,
      is_restricted: true,
      requires_approval: true,
      gate_config: {},
      provider_config: {},
      health_check: {},
      currently_deployed: mockDeployments[2],
    },
  ],
};

export function getMockDeploymentDetail(id: string): DeploymentDetail {
  const base =
    mockDeployments.find((d) => d.id === id) ||
    mockDeployments[1] ||
    mockDeployments[0];

  return {
    ...base,
    gate: {
      deployment_id: base.id,
      environment: base.environment_name,
      can_proceed: true,
      requires_human_approval: base.environment_name !== "development",
      checks: [
        {
          name: "ci_green",
          status: "passed",
          detail: "Unit & integration suite: 142 passed, 0 failed",
          metrics: { passed: "142", failed: "0", duration: "18.4s" },
        },
        {
          name: "security_clean",
          status: "passed",
          detail: "Container image vulnerabilities: 0 critical, 0 high",
          metrics: { critical: "0", high: "0" },
        },
        {
          name: "spec_validated",
          status: "passed",
          detail: "SDD Constitution compliance: verified",
          metrics: { invariants_checked: "12", passing: "12" },
        },
        {
          name: "policy_allows",
          status: "passed",
          detail: "Health check /health responded 200 in 34ms",
          metrics: { status_code: "200", latency_ms: "34" },
        },
      ],
      blocking_reasons: [],
    },
    checks: [
      {
        name: "ci_green",
        status: "passed",
        detail: "Unit & integration suite: 142 passed, 0 failed",
        metrics: { passed: "142", failed: "0", duration: "18.4s" },
      },
      {
        name: "security_clean",
        status: "passed",
        detail: "Container image vulnerabilities: 0 critical, 0 high",
        metrics: { critical: "0", high: "0" },
      },
      {
        name: "spec_validated",
        status: "passed",
        detail: "SDD Constitution compliance: verified",
        metrics: { invariants_checked: "12", passing: "12" },
      },
      {
        name: "policy_allows",
        status: "passed",
        detail: "Health check /health responded 200 in 34ms",
        metrics: { status_code: "200", latency_ms: "34" },
      },
    ],
    transitions: [
      {
        sequence: 1,
        from_state: "requested",
        to_state: "awaiting_approval",
        event: "gate_check_complete",
        actor: "system",
        created_at: base.requested_at,
      },
    ],
  };
}

export const mockCostSummary: CostSummary = {
  total_spend_usd: 142.85,
  monthly_budget_usd: 500.0,
  tokens_total: 48200000,
  runs_count: 312,
  top_models: [
    { model: "claude-3-7-sonnet", spend: 98.4, tokens: 28000000 },
    { model: "gemini-2.5-flash", spend: 32.1, tokens: 18000000 },
    { model: "text-embedding-004", spend: 12.35, tokens: 2200000 },
  ],
} as unknown as CostSummary;

export const mockAoSettings: AoSettingsOut = {
  auto_route_enabled: true,
  default_fast_model: "gemini-2.5-flash",
  default_reasoning_model: "claude-3-7-sonnet",
  max_effort_threshold: 8,
  routing_strategy: "cost_optimized",
} as unknown as AoSettingsOut;

// Mock Request Dispatcher
export function handleMockApiRequest(path: string, options: { method?: string; body?: any; query?: any } = {}): any {
  const cleanPath = path.replace(/^\/api/, "").replace(/^\//, "");
  const method = (options.method || "GET").toUpperCase();

  // /auth/me
  if (cleanPath === "auth/me") {
    return mockCurrentUser;
  }

  // /health or /
  if (cleanPath === "" || cleanPath === "health") {
    return { status: "ok", service: "forge-api", version: "0.9.0" };
  }

  // /board/tasks
  if (cleanPath === "board/tasks" || cleanPath.startsWith("board/tasks?")) {
    if (method === "POST" && options.body) {
      const newTask: TaskDTO = {
        id: `task-${Date.now()}`,
        key: `FORGE-${mockTasks.length + 101}`,
        project_id: "prj_demo",
        epic_id: options.body.epic_id || "epic-1",
        title: options.body.title || "New Task",
        description: options.body.description || "",
        status: options.body.status || "backlog",
        priority: options.body.priority || "medium",
        estimate: options.body.estimate || 3,
        execution_mode: options.body.execution_mode || "single_agent",
        labels: options.body.labels || [],
        assignee_id: "usr_demo_admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTasks.unshift(newTask);
      return newTask;
    }
    return [...mockTasks];
  }

  // /board/tasks/:id/status
  const taskStatusMatch = cleanPath.match(/^board\/tasks\/([^/]+)\/status$/);
  if (taskStatusMatch && (method === "PATCH" || method === "POST")) {
    const taskId = taskStatusMatch[1];
    const task = mockTasks.find((t) => t.id === taskId || t.key === taskId);
    if (task && options.body?.status) {
      task.status = options.body.status;
      task.updated_at = new Date().toISOString();
      return task;
    }
    return task || { id: taskId, status: options.body?.status };
  }

  // /board/tasks/:id
  const taskDetailMatch = cleanPath.match(/^board\/tasks\/([^/]+)$/);
  if (taskDetailMatch) {
    const taskId = taskDetailMatch[1];
    const task = mockTasks.find((t) => t.id === taskId || t.key === taskId);
    if (method === "PATCH" && task && options.body) {
      Object.assign(task, options.body);
      task.updated_at = new Date().toISOString();
      return task;
    }
    return task || mockTasks[0];
  }

  // /board/epics
  if (cleanPath.startsWith("board/epics")) {
    return [...mockEpics];
  }

  // /board/sprints
  if (cleanPath.startsWith("board/sprints")) {
    return [...mockSprints];
  }

  // /projects/:id/sprints
  if (cleanPath.match(/^projects\/[^/]+\/sprints/)) {
    return [...mockProjectSprints];
  }

  // /sprints/:id/start
  const sprintStartMatch = cleanPath.match(/^sprints\/([^/]+)\/start$/);
  if (sprintStartMatch && method === "POST") {
    const sprintId = sprintStartMatch[1];
    const sprint = mockProjectSprints.find((s) => s.id === sprintId);
    if (sprint) {
      sprint.state = "active";
      sprint.started_at = new Date().toISOString();
      return sprint;
    }
    return { id: sprintId, state: "active" };
  }

  // /sprints/:id/complete
  const sprintCompleteMatch = cleanPath.match(/^sprints\/([^/]+)\/complete$/);
  if (sprintCompleteMatch && method === "POST") {
    const sprintId = sprintCompleteMatch[1];
    const sprint = mockProjectSprints.find((s) => s.id === sprintId);
    if (sprint) {
      sprint.state = "completed";
      sprint.completed_at = new Date().toISOString();
      return sprint;
    }
    return { id: sprintId, state: "completed" };
  }

  // /sprints/:id/tasks
  const sprintTasksMatch = cleanPath.match(/^sprints\/([^/]+)\/tasks$/);
  if (sprintTasksMatch) {
    const sprintId = sprintTasksMatch[1];
    const matching = mockTasks.filter((t) => t.sprint_id === sprintId);
    return matching.length > 0 ? matching : [...mockTasks];
  }

  // /projects/:id/velocity
  if (cleanPath.match(/^projects\/[^/]+\/velocity/)) {
    const dashboard: VelocityDashboard = {
      project_id: "default",
      sprints: [
        {
          sprint_id: "sprint-12",
          name: "Sprint 12",
          committed_points: 30,
          completed_points: 29,
          predictability: 0.96,
        },
        {
          sprint_id: "sprint-13",
          name: "Sprint 13",
          committed_points: 34,
          completed_points: 32,
          predictability: 0.94,
        },
        {
          sprint_id: "sprint-14",
          name: "Sprint 14",
          committed_points: 38,
          completed_points: 22,
          predictability: 0.88,
        },
      ],
      summary: {
        sprint_count: 3,
        average_velocity: 27.7,
        rolling_3_velocity: 27.7,
        predictability_avg: 0.93,
        scope_change_avg: 0.08,
        forecast_low: 24,
        forecast_avg: 28,
        forecast_high: 34,
      },
    };
    return dashboard;
  }

  // /sprints/:id/burndown
  if (cleanPath.match(/^sprints\/[^/]+\/burndown/)) {
    const today = new Date();
    const points = [
      { date: new Date(today.getTime() - 86400000 * 4).toISOString().slice(0, 10), remaining_points: 38, ideal_remaining: 38, completed_points: 0 },
      { date: new Date(today.getTime() - 86400000 * 3).toISOString().slice(0, 10), remaining_points: 33, ideal_remaining: 35.3, completed_points: 5 },
      { date: new Date(today.getTime() - 86400000 * 2).toISOString().slice(0, 10), remaining_points: 27, ideal_remaining: 32.6, completed_points: 11 },
      { date: new Date(today.getTime() - 86400000 * 1).toISOString().slice(0, 10), remaining_points: 22, ideal_remaining: 29.9, completed_points: 16 },
      { date: today.toISOString().slice(0, 10), remaining_points: 16, ideal_remaining: 27.2, completed_points: 22 },
    ];
    return {
      sprint_id: "sprint-1",
      committed_points: 38,
      points,
      days: points,
    };
  }

  // /sprints/:id/capacity
  if (cleanPath.match(/^sprints\/[^/]+\/capacity/)) {
    return {
      sprint_id: "sprint-1",
      total_declared_capacity: 45,
      total_assigned_points: 38,
      members: [
        { member_id: "usr_alice", name: "Alice Chen", declared_capacity_points: 15, assigned_points: 13, allocation_status: "balanced" },
        { member_id: "usr_bob", name: "Bob Martin", declared_capacity_points: 15, assigned_points: 14, allocation_status: "balanced" },
        { member_id: "usr_clara", name: "Clara Vance", declared_capacity_points: 15, assigned_points: 11, allocation_status: "under" },
      ],
    };
  }

  // /sprints/:id/goal-alignment
  if (cleanPath.match(/^sprints\/[^/]+\/goal-alignment/)) {
    return {
      sprint_id: "sprint-1",
      goal_tokens: ["circuit", "fabrication", "simulation"],
      total_count: 12,
      aligned_count: 10,
      alignment_ratio: 0.83,
      unaligned_task_ids: ["task-2", "task-5"],
      score: 0.92,
      matched_tasks: 10,
      total_tasks: 12,
      keyword_coverage: 0.85,
    };
  }

  // /sprints/:id/report
  if (cleanPath.match(/^sprints\/[^/]+\/report/)) {
    return {
      sprint: {
        id: "sprint-1",
        project_id: "default",
        workspace_id: "ws-default",
        name: "Sprint 14 — Runtime & SDD Engine",
        state: "active",
        committed_points: 38,
        completed_points: 22,
        remaining_points: 16,
      },
      tasks: [],
    };
  }

  // /projects/:id/cfd
  if (cleanPath.match(/^projects\/[^/]+\/cfd/)) {
    return { project_id: "default", days: [] };
  }

  // /projects/:id/cycle-lead-time
  if (cleanPath.match(/^projects\/[^/]+\/cycle-lead-time/)) {
    return { project_id: "default", average_cycle_time_days: 3.4, average_lead_time_days: 5.2 };
  }

  // /board/milestones
  if (cleanPath.startsWith("board/milestones")) {
    return [...mockMilestones];
  }

  // /board/incidents or /incidents
  if (cleanPath.startsWith("board/incidents") || cleanPath.startsWith("incidents")) {
    return [...mockIncidents];
  }

  // /approvals/count
  if (cleanPath.startsWith("approvals/count")) {
    return { count: mockApprovals.filter((a) => a.status === "pending").length, pending: 2 };
  }

  // /approvals/:id/decision
  const approvalDecisionMatch = cleanPath.match(/^approvals\/([^/]+)\/decision$/);
  if (approvalDecisionMatch) {
    return { id: approvalDecisionMatch[1], status: options.body?.decision || "approved", resolved_at: new Date().toISOString() };
  }

  // /approvals
  if (cleanPath.startsWith("approvals")) {
    return [...mockApprovals];
  }

  // /audit
  if (cleanPath.startsWith("audit")) {
    return mockAudit;
  }

  // /attestations
  if (cleanPath.startsWith("attestations")) {
    return { items: [], total: 0 };
  }

  // /projects/:id/specs
  if (cleanPath.match(/^projects\/[^/]+\/specs/)) {
    return mockSpecDashboard;
  }

  // /spec/constitution
  if (cleanPath.startsWith("spec/constitution")) {
    return mockConstitution;
  }

  // /spec/specs actions and endpoints
  if (cleanPath.startsWith("spec/specs") || cleanPath.startsWith("spec/dashboard") || cleanPath === "spec" || cleanPath.startsWith("spec/tasks")) {
    // /spec/tasks/:taskId/validate
    if (cleanPath.startsWith("spec/tasks/") && cleanPath.endsWith("/validate")) {
      return (
        mockSpecs[0]?.validation ?? {
          spec_id: "spec-1",
          passed: true,
          coverage: 95,
          checks: [{ name: "Automated Suite", passed: true, message: "All assertions passed" }],
          traceability: [],
        }
      );
    }

    // POST /spec/specs (create)
    if (method === "POST" && (cleanPath === "spec/specs" || cleanPath === "spec/specs/")) {
      const body = options.body ?? {};
      const newSpec: SpecOverview = {
        id: `spec-${Date.now().toString(36)}`,
        name: body.name || "Untitled Specification",
        status: "draft",
        requirements: body.requirements || [],
        acceptance_criteria: body.acceptance_criteria || [],
        constraints: body.constraints || [],
        decisions: body.decisions || [],
        constitution_refs: body.constitution_refs || ["const-1"],
        repos: body.repos || ["forge-core"],
        execution_mode: body.execution_mode || "single_agent",
        validation: {
          spec_id: `spec-${Date.now().toString(36)}`,
          passed: false,
          coverage: 0,
          checks: [],
          traceability: [],
        },
      };
      mockSpecs.unshift(newSpec);
      return newSpec;
    }

    // Match /spec/specs/:specId/...
    const specActionMatch = cleanPath.match(/^spec\/specs\/([^/]+)(?:\/(.*))?$/);
    if (specActionMatch) {
      const specId = specActionMatch[1];
      const action = specActionMatch[2];
      const target = mockSpecs.find((s) => s.id === specId) ?? mockSpecs[0];

      if (action === "approve") {
        target.status = "approved";
        return target;
      }
      if (action === "clarify") {
        target.status = "clarifying";
        return target;
      }
      if (action === "plan") {
        target.plan_ref = `plan-${specId}-v1`;
        return target;
      }
      if (action === "tasks") {
        target.tasks_ref = `tasks-${specId}-v1`;
        return mockTasks;
      }
      if (action === "validate") {
        target.status = "validated";
        return target.validation ?? { passed: true, coverage: 90, checks: [], traceability: [] };
      }
      if (action === "reject") {
        target.status = "rejected";
        return target;
      }
      if (action === "request-changes") {
        target.status = "changes_requested";
        return target;
      }
      if (action === "markdown") {
        return {
          spec_md: `# ${target.name}\n\n## Status: ${target.status}\n\n## Requirements\n${(target.requirements || [])
            .map((r) => `- **[${r.id}]** ${r.text}`)
            .join("\n")}\n\n## Acceptance Criteria\n${(target.acceptance_criteria || [])
            .map((a) => `- [ ] **[${a.id}]** ${a.text}`)
            .join("\n")}`,
        };
      }
      if (action === "manifest") {
        return target;
      }
      if (action === "versions") {
        return [
          {
            version: 1,
            author: "demo_admin",
            message: "Initial spec authoring & requirements draft",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            version: 2,
            author: "forge_agent",
            message: "Added acceptance criteria & test references",
            created_at: new Date().toISOString(),
          },
        ];
      }

      // Default GET for specific spec
      if (!action) {
        if (method === "PUT" && options.body) {
          Object.assign(target, options.body);
          return target;
        }
        return target;
      }
    }

    if (cleanPath.includes("/manifest")) {
      return mockSpecManifest;
    }
    return mockSpecDashboard;
  }

  // /spec/draft
  if (cleanPath.startsWith("spec/draft")) {
    return {
      spec: {
        id: `spec-draft-${Date.now()}`,
        name: "AI-Drafted System Architecture Spec",
        status: "draft",
        requirements: [
          { id: "REQ-01", text: "Automated test gate enforcement before PR approval" },
        ],
        acceptance_criteria: [
          { id: "AC-01", text: "CI pipeline rejects failing runs with exit code 1" },
        ],
      },
    };
  }

  // /runs
  if (cleanPath.startsWith("runs")) {
    return mockRunTrace;
  }

  // /marketplace/listings
  if (cleanPath.startsWith("marketplace/listings")) {
    return [...mockMarketplaceListings];
  }
  if (cleanPath.startsWith("marketplace/installations")) {
    return mockMarketplaceListings.filter((l: any) => l.installed);
  }
  if (cleanPath.startsWith("marketplace")) {
    return [...mockMarketplaceListings];
  }

  // /public/benchmarks
  if (cleanPath.startsWith("public/benchmarks")) {
    return [mockLeaderboard];
  }
  // /public/leaderboard
  if (cleanPath.startsWith("public/leaderboard") || cleanPath.startsWith("leaderboard")) {
    return mockLeaderboard;
  }

  // /projects/:id/pipeline
  if (cleanPath.match(/^projects\/[^/]+\/pipeline/)) {
    return mockPipeline;
  }

  // /projects/:id/deployments
  if (cleanPath.match(/^projects\/[^/]+\/deployments/)) {
    if (method === "POST") {
      const newDep: DeploymentRead = {
        id: `dep-${Date.now()}`,
        project_id: "default",
        environment_name: options.body?.environment || "staging",
        repo_id: "repo-forge-core",
        commit_sha: options.body?.commit_sha || "9a8b7c6d5e4",
        kind: "promotion",
        state: "awaiting_approval",
        trigger: "manual",
        initiated_by: "usr_demo_admin",
        health_status: "passing",
        requested_at: new Date().toISOString(),
      };
      mockDeployments.unshift(newDep);
      const targetEnv = mockPipeline.environments.find(
        (e) => e.name === newDep.environment_name,
      );
      if (targetEnv) {
        targetEnv.currently_deployed = newDep;
      }
      return newDep;
    }
    return [...mockDeployments];
  }

  // /deployments/:id/decision
  const decisionMatch = cleanPath.match(/^deployments\/([^/]+)\/decision$/);
  if (decisionMatch && method === "POST") {
    const depId = decisionMatch[1];
    const decision = options.body?.decision;
    const dep = mockDeployments.find((d) => d.id === depId);
    if (dep) {
      if (decision === "approve") {
        dep.state = "approved";
      } else if (decision === "reject") {
        dep.state = "gate_rejected";
      } else if (decision === "request_changes") {
        dep.state = "awaiting_approval";
      }
    }
    return getMockDeploymentDetail(depId);
  }

  // /deployments/:id/cancel
  const cancelMatch = cleanPath.match(/^deployments\/([^/]+)\/cancel$/);
  if (cancelMatch && method === "POST") {
    const depId = cancelMatch[1];
    const dep = mockDeployments.find((d) => d.id === depId);
    if (dep) {
      dep.state = "cancelled";
    }
    return getMockDeploymentDetail(depId);
  }

  // /deployments/:id/rollback
  const rollbackMatch = cleanPath.match(/^deployments\/([^/]+)\/rollback$/);
  if (rollbackMatch && method === "POST") {
    const depId = rollbackMatch[1];
    const dep = mockDeployments.find((d) => d.id === depId);
    if (dep) {
      dep.state = "rolled_back";
    }
    return getMockDeploymentDetail(depId);
  }

  // /deployments/:id
  const depDetailMatch = cleanPath.match(/^deployments\/([^/]+)$/);
  if (depDetailMatch && method === "GET") {
    return getMockDeploymentDetail(depDetailMatch[1]);
  }

  // /deployments
  if (cleanPath.startsWith("deployments")) {
    return [...mockDeployments];
  }

  // /cost/summary
  if (cleanPath.startsWith("cost/summary") || cleanPath.startsWith("cost")) {
    return mockCostSummary;
  }

  // /ao/settings
  if (cleanPath.startsWith("ao/settings")) {
    return mockAoSettings;
  }
  if (cleanPath.startsWith("ao/role-config")) {
    return { items: [], total: 0 };
  }
  if (cleanPath.startsWith("ao/self-eval")) {
    return { status: "ready", baseline_pass_rate: 0.94, runs_evaluated: 24 };
  }

  // /cost/summary
  if (cleanPath.startsWith("cost/summary")) {
    return {
      scope: "workspace",
      scope_id: "default",
      total_cost_usd: 12.48,
      total_prompt_tokens: 412000,
      total_completion_tokens: 88500,
      group_by: "provider",
      buckets: [
        { key: "google-gemini", cost_usd: 6.20, prompt_tokens: 220000, completion_tokens: 48000, request_count: 340 },
        { key: "local-spice-engine", cost_usd: 0.00, prompt_tokens: 0, completion_tokens: 0, request_count: 890 },
        { key: "anthropic-claude", cost_usd: 4.10, prompt_tokens: 124000, completion_tokens: 26000, request_count: 110 },
        { key: "openai", cost_usd: 2.18, prompt_tokens: 68000, completion_tokens: 14500, request_count: 75 },
      ],
      from: new Date(Date.now() - 30 * 86400000).toISOString(),
      to: new Date().toISOString(),
    };
  }

  // /cost/timeseries
  if (cleanPath.startsWith("cost/timeseries")) {
    const days = 14;
    const now = Date.now();
    const timestamps = Array.from({ length: days }, (_, i) =>
      new Date(now - (days - 1 - i) * 86400000).toISOString().slice(0, 10)
    );
    return {
      scope: "workspace",
      scope_id: "default",
      bucket: "day",
      group_by: "provider",
      series: {
        "google-gemini": timestamps.map((t, idx) => [t, (0.3 + (idx % 4) * 0.15).toFixed(2)]),
        "anthropic-claude": timestamps.map((t, idx) => [t, (0.2 + (idx % 3) * 0.1).toFixed(2)]),
        "openai": timestamps.map((t, idx) => [t, (0.1 + (idx % 2) * 0.08).toFixed(2)]),
      },
    };
  }

  // /observability/metrics
  if (cleanPath.startsWith("observability/metrics")) {
    return {
      stages: [
        { stage: "datasheet_ocr", meanSeconds: 0.42, throughputPerSec: 14.2 },
        { stage: "schematic_synthesis", meanSeconds: 0.88, throughputPerSec: 8.5 },
        { stage: "spice_simulation", meanSeconds: 0.25, throughputPerSec: 26.0 },
        { stage: "thermal_stress_calc", meanSeconds: 0.18, throughputPerSec: 38.5 },
      ],
      freshness: [
        { connection: "TI Datasheet Index", seconds: 120 },
        { connection: "STMicro Spec MCP", seconds: 240 },
        { connection: "IPC Standard Registry", seconds: 80 },
        { connection: "DigiKey Parametric API", seconds: 600 },
      ],
    };
  }

  // /workflow/editor/catalog
  if (cleanPath === "workflow/editor/catalog") {
    return {
      states: ["draft", "ingested", "simulating", "verified", "passed", "failed"],
      guards: [
        { name: "thermal_within_limits", description: "Junction temperature < max rated Tj", takes_arg: false, is_precondition: true },
        { name: "voltage_derated", description: "Capacitor voltage > 1.5x bus voltage", takes_arg: false, is_precondition: true },
        { name: "ipc_trace_ok", description: "Copper trace width meets IPC-2221 current capacity", takes_arg: false, is_precondition: false },
      ],
      effects: [
        { name: "run_spice_simulation", description: "Execute ngspice transient simulation" },
        { name: "generate_gerbers", description: "Generate RS-274X manufacturing files" },
        { name: "send_approval_request", description: "Request engineering signoff gate" },
      ],
    };
  }

  // /workflow/editor/definitions
  if (cleanPath.startsWith("workflow/editor/definitions") || cleanPath === "workflow/definitions") {
    const defs = [
      {
        name: "pcb-schematic-loop",
        title: "PCB Schematic & Verification Loop",
        description: "Ingests component datasheets, synthesizes schematics, runs SPICE and stress tests.",
        origin: "bundled",
        is_active: true,
        published_revision: 1,
        has_draft: false,
      },
      {
        name: "hardware-ci-pipeline",
        title: "Hardware Multiphysics CI/CD",
        description: "Executes automated electrical and thermal simulations on board revisions.",
        origin: "custom",
        is_active: true,
        published_revision: 2,
        has_draft: true,
      },
      {
        name: "component-qualification",
        title: "AEC-Q100 Component Qualification",
        description: "Automated standard compliance checks against automotive and aerospace rules.",
        origin: "bundled",
        is_active: true,
        published_revision: 1,
        has_draft: false,
      },
    ];

    if (cleanPath.includes("definitions/")) {
      const name = cleanPath.split("definitions/")[1]?.split("/")[0] || "pcb-schematic-loop";
      const found = defs.find((d) => d.name === name) || defs[0];
      return {
        ...found,
        editable: true,
        current_published: {
          revision: found.published_revision || 1,
          status: "published",
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          graph: {
            nodes: [
              { id: "draft", kind: "initial", layout: { x: 80, y: 150 }, label: "Draft" },
              { id: "simulating", kind: "normal", layout: { x: 300, y: 150 }, label: "Simulating" },
              { id: "verified", kind: "normal", layout: { x: 520, y: 150 }, label: "Verified" },
              { id: "passed", kind: "terminal", layout: { x: 740, y: 150 }, label: "Passed" },
            ],
            edges: [
              { id: "e1", from_state: "draft", to_state: "simulating", action: "run_spice_simulation", preconditions: ["voltage_derated"], checks: [] },
              { id: "e2", from_state: "simulating", to_state: "verified", action: null, preconditions: ["thermal_within_limits"], checks: [] },
              { id: "e3", from_state: "verified", to_state: "passed", action: "generate_gerbers", preconditions: ["ipc_trace_ok"], checks: [] },
            ],
          },
          dsl_yaml: "name: " + found.name + "\nversion: 1.0\nstates:\n  - draft\n  - simulating\n  - verified\n  - passed",
          validation_issues: [],
          validation_status: "valid",
        },
      };
    }

    return defs;
  }

  // /workflow (legacy fallback)
  if (cleanPath.startsWith("workflow")) {
    return [
      {
        name: "pcb-schematic-loop",
        title: "PCB Schematic & Verification Loop",
        origin: "bundled",
        is_active: true,
        published_revision: 1,
        has_draft: false,
      },
    ];
  }

  // --- Marketplace & Hardware Procurement (F32) ---
  if (cleanPath === "marketplace/registries") {
    return [
      {
        id: "reg_no_official",
        slug: "no-official",
        name: "NO Engineering Official Registry",
        type: "official",
        url: "https://registry.no-hardware.internal",
        trust_level: "verified",
        enabled: true,
        has_public_key: true,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: "reg_community_hardware",
        slug: "community-hw",
        name: "Global Open Hardware & EDA Registry",
        type: "community",
        url: "https://github.com/no-eda/community-packages",
        trust_level: "community",
        enabled: true,
        has_public_key: true,
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
    ];
  }

  if (cleanPath === "marketplace/installations") {
    return [
      {
        id: "inst_kicad",
        registry_slug: "no-official",
        listing_slug: "kicad-v8-bridge",
        kind: "mcp_connector",
        installed_version: "8.0.4",
        pinned: false,
        target_kind: "system_tool",
        target_object_id: "tool_kicad",
        content_hash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        verification_status: "verified",
        status: "active",
        available_version: "8.0.4",
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: "inst_ngspice",
        registry_slug: "no-official",
        listing_slug: "ngspice-solver-engine",
        kind: "skill_profile",
        installed_version: "42.0.1",
        pinned: true,
        target_kind: "system_tool",
        target_object_id: "tool_ngspice",
        content_hash: "sha256:3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01",
        verification_status: "verified",
        status: "active",
        available_version: "42.0.1",
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
      {
        id: "inst_openfoam",
        registry_slug: "no-official",
        listing_slug: "openfoam-thermal-cfd",
        kind: "mcp_connector",
        installed_version: "11.0.0",
        pinned: false,
        target_kind: "system_tool",
        target_object_id: "tool_openfoam",
        content_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        verification_status: "verified",
        status: "active",
        available_version: "11.0.0",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ];
  }

  if (cleanPath.startsWith("marketplace/listings")) {
    const listings = [
      {
        id: "list_kicad",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "mcp_connector",
        slug: "kicad-v8-bridge",
        name: "KiCad v8 Native Integration",
        summary: "Bidirectional schematic & layout sync engine with IPC-7351 footprint library export and real netlist routing.",
        tags: ["eda", "schematic", "pcb", "kicad", "gerber"],
        latest_version: "8.0.4",
        homepage: "https://kicad.org",
        license: "GPL-3.0",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_ngspice",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "skill_profile",
        slug: "ngspice-solver-engine",
        name: "ngspice 42 Circuit Simulator",
        summary: "Full SPICE mixed-mode simulator executing transient switching ripples, frequency AC poles, and Monte Carlo tolerance analyses.",
        tags: ["simulation", "spice", "transient", "physics", "buck"],
        latest_version: "42.0.1",
        homepage: "https://ngspice.sourceforge.io",
        license: "BSD-3-Clause",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_openfoam",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "mcp_connector",
        slug: "openfoam-thermal-cfd",
        name: "OpenFOAM Multiphysics Thermal CFD",
        summary: "Finite-volume Navier-Stokes thermal solver for natural and forced fan convection cooling across copper planes and component heatsinks.",
        tags: ["cfd", "thermal", "openfoam", "multiphysics", "heat-sink"],
        latest_version: "11.0.0",
        homepage: "https://openfoam.org",
        license: "GPL-3.0",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_femm",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "skill_profile",
        slug: "femm-magnetics-lab",
        name: "FEMM 4.2 Magnetic Field Solver",
        summary: "Finite Element Method Magnetics solver computing inductor flux density (B-field in Tesla), core saturation, and fringing fields.",
        tags: ["magnetics", "femm", "inductor", "b-field", "flux"],
        latest_version: "4.2.1",
        homepage: "https://femm.info",
        license: "Aladdin Free Public License",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_webots",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "mcp_connector",
        slug: "webots-robotics-twin",
        name: "Webots Robotics Digital Twin",
        summary: "Physics-based robotic actuator & BLDC motor simulation connecting Field-Oriented Control (FOC) firmware to 3D joint dynamics.",
        tags: ["robotics", "webots", "foc", "bldc", "kinematics"],
        latest_version: "2023.1",
        homepage: "https://cyberbotics.com",
        license: "Apache-2.0",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_freecad",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "skill_profile",
        slug: "freecad-step-cad",
        name: "FreeCAD Parametric 3D Enclosure Engine",
        summary: "Generates native STEP / STL watertight 3D enclosures with standoff tolerances, snap-fit joints, and connector port cutouts.",
        tags: ["cad", "mechanical", "step", "enclosure", "3d-printing"],
        latest_version: "0.21.2",
        homepage: "https://freecad.org",
        license: "LGPL-2.1",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_digikey_local",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "mcp_connector",
        slug: "digikey-domestic-hub",
        name: "DigiKey Domestic Express Sourcing",
        summary: "Direct US/North American distribution link with guaranteed 24h-48h courier dispatch, real-time reel stock, and local currency pricing.",
        tags: ["sourcing", "local", "digikey", "procurement", "fast-shipping"],
        latest_version: "3.2.0",
        homepage: "https://digikey.com",
        license: "Proprietary API",
        cached_at: new Date().toISOString(),
      },
      {
        id: "list_lcsc_international",
        registry_id: "reg_no_official",
        registry_slug: "no-official",
        trust_level: "verified",
        kind: "mcp_connector",
        slug: "lcsc-global-sourcing",
        name: "LCSC Global Silicon Mega-Distribution",
        summary: "Direct Shenzhen factory-direct inventory connector featuring high-volume cut-tape/reel pricing, JLCPCB turnkey sync, and international freight tracking.",
        tags: ["sourcing", "international", "lcsc", "volume-pricing", "turnkey"],
        latest_version: "2.8.4",
        homepage: "https://lcsc.com",
        license: "Proprietary API",
        cached_at: new Date().toISOString(),
      },
    ];
    return listings;
  }

  // /marketplace/registries/:reg/listings/:slug
  const listingDetailMatch = cleanPath.match(/^marketplace\/registries\/([^/]+)\/listings\/([^/]+)$/);
  if (listingDetailMatch) {
    const slug = listingDetailMatch[2];
    return {
      id: `list_${slug}`,
      registry_id: "reg_no_official",
      registry_slug: "no-official",
      trust_level: "verified",
      kind: "mcp_connector",
      slug,
      name: slug.replace(/-/g, " ").toUpperCase(),
      summary: "Production-verified engineering suite component with hardware hardware integration.",
      tags: ["hardware", "simulation", "verified"],
      latest_version: "1.0.0",
      license: "MIT",
      cached_at: new Date().toISOString(),
      versions: [
        {
          version: "1.0.0",
          content_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          signed: true,
          published_at: new Date().toISOString(),
        },
      ],
    };
  }

  if (cleanPath === "marketplace/preview") {
    return {
      registry_id: "reg_no_official",
      kind: "mcp_connector",
      slug: "package",
      version: "1.0.0",
      verification: {
        status: "verified",
        content_hash_ok: true,
        signature_ok: true,
        detail: "Package cryptographic signature verified against NO Hardware Root CA.",
      },
      resolved_config: {},
      warnings: [],
      requires_admin_followup: [],
      overrides_builtin: false,
      blocked: false,
    };
  }

  if (cleanPath === "marketplace/install") {
    return {
      installation_id: "inst_" + Math.random().toString(36).slice(2, 9),
      target_kind: "system_tool",
      target_object_id: "tool_" + Math.random().toString(36).slice(2, 9),
      status: "active",
      version: "1.0.0",
      verification: {
        status: "verified",
        content_hash_ok: true,
        signature_ok: true,
      },
      warnings: [],
    };
  }

  // Fallback default response
  return { status: "ok", data: [] };
}
