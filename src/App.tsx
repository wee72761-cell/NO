import React, { Suspense } from "react";
import { RouterProvider, usePathname } from "@/shims/navigation";
import { QueryProvider } from "@/components/query-provider";
import { CommandPaletteProvider } from "@/components/command-palette";
import { Toaster } from "@/components/ui/toast";
import { AppShell } from "@/components/app-shell";
import { SessionGate } from "@/components/auth/session-gate";

// View components for Forge
import { BoardView } from "@/components/board/board-view";
import { BoardDepth } from "@/components/board/depth/board-depth";
import { RunTraceViewer } from "@/components/run-trace/run-trace-viewer";
import { ApprovalInbox } from "@/components/approvals/approval-inbox";
import { SpecDashboard } from "@/components/spec/spec-dashboard";
import { NewSpecPage } from "@/components/spec-studio/new-spec-page";
import { SpecStudioPage } from "@/components/spec-studio/spec-studio-page";
import { SprintsView } from "@/components/sprints/sprints-view";
import { WorkflowEditor } from "@/components/workflow/workflow-editor";
import { ObservabilityView } from "@/components/observability/observability-view";
import { IncidentsView } from "@/components/incidents/incidents-view";
import { LeaderboardView } from "@/components/benchmarks/leaderboard-view";
import { AuditView } from "@/components/audit/audit-view";
import { DeploymentsView } from "@/components/deployments/deployments-view";
import { MarketplaceView } from "@/components/marketplace/marketplace-view";
import { AoSettingsView } from "@/components/ao-settings/ao-settings-view";
import { SelfEvalPanel } from "@/components/self-eval/self-eval-panel";
import { RbacAdminView } from "@/components/rbac/rbac-admin-view";
import { SsoSettingsView } from "@/components/sso/sso-settings-view";
import { PmIntegrationsView } from "@/components/pm/pm-integrations-view";
import { WalkthroughView } from "@/components/walkthrough/walkthrough-view";
import { PcbStudio } from "@/components/pcb/pcb-studio";
import { ManualView } from "@/components/manual/manual-view";
import { PlayStoreView } from "@/components/play-store/play-store-view";

import { ErrorBoundary } from "./components/error-boundary";

function RouteRenderer() {
  const pathname = usePathname();

  if (pathname === "/pcb") {
    return <PcbStudio />;
  }
  if (pathname === "/manual") {
    return <ManualView />;
  }
  if (pathname === "/play-store") {
    return <PlayStoreView />;
  }
  if (pathname === "/board") {
    return <BoardView initialView="board" />;
  }
  if (pathname === "/depth") {
    return <BoardDepth initialView="board" />;
  }
  if (pathname === "/runs") {
    return <RunTraceViewer />;
  }
  if (pathname.startsWith("/runs/")) {
    const runId = pathname.replace("/runs/", "").split("/")[0];
    return <RunTraceViewer runId={runId} />;
  }
  if (pathname === "/approvals") {
    return <ApprovalInbox />;
  }
  if (pathname === "/specs") {
    return <SpecDashboard />;
  }
  if (pathname === "/specs/new") {
    return (
      <Suspense fallback={null}>
        <NewSpecPage />
      </Suspense>
    );
  }
  if (pathname.startsWith("/specs/")) {
    const specId = pathname.replace("/specs/", "").split("/")[0];
    return <SpecStudioPage specId={specId} />;
  }
  if (pathname === "/sprints") {
    return <SprintsView />;
  }
  if (pathname === "/workflow") {
    return <WorkflowEditor />;
  }
  if (pathname === "/observability") {
    return <ObservabilityView />;
  }
  if (pathname === "/incidents") {
    return <IncidentsView />;
  }
  if (pathname === "/leaderboard") {
    return <LeaderboardView />;
  }
  if (pathname === "/audit") {
    return <AuditView />;
  }
  if (pathname === "/deployments") {
    return <DeploymentsView />;
  }
  if (pathname === "/marketplace") {
    return <MarketplaceView />;
  }
  if (pathname === "/settings/models") {
    return (
      <div className="flex flex-col gap-6">
        <AoSettingsView />
        <SelfEvalPanel />
      </div>
    );
  }
  if (pathname === "/settings/rbac") {
    return <RbacAdminView />;
  }
  if (pathname === "/settings/sso") {
    return <SsoSettingsView />;
  }
  if (pathname === "/settings/integrations") {
    return <PmIntegrationsView />;
  }
  if (pathname === "/walkthrough") {
    return <WalkthroughView />;
  }

  // Default to list view
  return <BoardView initialView="list" />;
}

export default function App() {
  return (
    <RouterProvider>
      <QueryProvider>
        <CommandPaletteProvider>
          <AppShell>
            <SessionGate>
              <ErrorBoundary>
                <RouteRenderer />
              </ErrorBoundary>
            </SessionGate>
          </AppShell>
          <Toaster />
        </CommandPaletteProvider>
      </QueryProvider>
    </RouterProvider>
  );
}
