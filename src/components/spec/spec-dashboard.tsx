"use client";

import {
  CircleDot,
  FileText,
  Landmark,
  ListChecks,
  Pencil,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Stamp,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useRegisterCommands } from "@/components/command-palette";
import { SpecStudio } from "@/components/spec-studio/spec-studio";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Loading, Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { apiClient, type ForgeApiClient } from "@/lib/api/client";
import { specKeys, useApproveSpec, useSpecOverview } from "@/lib/api/spec";
import type { SpecDashboard as SpecDashboardType, SpecOverview } from "@/lib/api/types";
import { cn } from "@/lib/utils";

import { ConstitutionPanel } from "./constitution-panel";
import { LifecycleStepper } from "./lifecycle-stepper";
import { ManifestPanel } from "./manifest-panel";
import { SuggestionsPanel } from "./suggestions-panel";
import {
  formatCoverage,
  gateSummary,
  isApprovable,
  statusBadgeClass,
  STATUS_LABELS,
  type GateSummary,
} from "./spec-meta";
import { TraceabilityMatrix } from "./traceability-matrix";

/** Placeholder project until project routing lands (F02). */
export const DEFAULT_PROJECT_ID = "default";

type TabId = "traceability" | "suggestions" | "manifest" | "constitution" | "studio";

const TABS: { id: TabId; label: string; icon: typeof Route }[] = [
  { id: "traceability", label: "Traceability", icon: Route },
  { id: "suggestions", label: "Suggestions & AI", icon: Sparkles },
  { id: "manifest", label: "Manifest", icon: FileText },
  { id: "constitution", label: "Constitution", icon: Landmark },
  { id: "studio", label: "Studio", icon: Pencil },
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export interface SpecDashboardProps {
  projectId?: string;
  client?: ForgeApiClient;
}

/**
 * The spec-validation dashboard (F23). A risk-ordered list of specs beside the
 * selected spec's SDD lifecycle rail, validation gates, and the
 * requirement->task->test traceability matrix — with the manifest and project
 * constitution one tab away. Keyboard-first: `j/k` move the spec selection and
 * the single ember action approves the spec at the human gate (optimistically).
 */
export function SpecDashboard({
  projectId = DEFAULT_PROJECT_ID,
  client = apiClient,
}: SpecDashboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("traceability");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryClient = useQueryClient();
  const overviewQuery = useSpecOverview(projectId, client);
  const approve = useApproveSpec(client);

  const specs = useMemo(
    () => overviewQuery.data?.specs ?? [],
    [overviewQuery.data],
  );
  const constitution = overviewQuery.data?.constitution ?? null;

  // Filtered specs based on search and status
  const filteredSpecs = useMemo(() => {
    return specs.filter((s) => {
      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.requirements ?? []).some((r) =>
          (r.text || "").toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [specs, searchQuery, statusFilter]);

  // Effective selection derived during render (no syncing effect): honour the
  // explicit pick, else fall back to the first spec.
  const explicitIndex = selectedId
    ? filteredSpecs.findIndex((s) => s.id === selectedId)
    : -1;
  const effectiveIndex =
    explicitIndex >= 0 ? explicitIndex : filteredSpecs.length > 0 ? 0 : -1;
  const selected = effectiveIndex >= 0 ? filteredSpecs[effectiveIndex] : null;

  const moveSelection = useCallback(
    (delta: number) => {
      if (filteredSpecs.length === 0) return;
      const base = effectiveIndex < 0 ? 0 : effectiveIndex;
      const next = Math.min(Math.max(base + delta, 0), filteredSpecs.length - 1);
      setSelectedId(filteredSpecs[next].id);
    },
    [filteredSpecs, effectiveIndex],
  );

  const onApprove = useCallback(() => {
    if (!selected || !isApprovable(selected.status) || approve.isPending) return;
    approve.mutate(
      { specId: selected.id },
      { onSuccess: () => toast.success("Spec approved") },
    );
  }, [approve, selected]);

  const onUpdateSpec = useCallback(
    (updated: SpecOverview) => {
      queryClient.setQueriesData<SpecDashboardType>(
        { queryKey: specKeys.overviews() },
        (old) =>
          old
            ? {
                ...old,
                specs: (old.specs ?? []).map((s) =>
                  s.id === updated.id ? updated : s
                ),
              }
            : old,
      );
    },
    [queryClient],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (isEditableTarget(event.target)) return;
      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1);
      }
    },
    [moveSelection],
  );

  // Command-palette contribution (stable ref → latest handler).
  const approveRef = useRef(onApprove);
  useEffect(() => {
    approveRef.current = onApprove;
  }, [onApprove]);
  const commands = useMemo(
    () => [
      {
        id: "approve-spec",
        label: "Approve spec",
        group: "Specs",
        icon: <Stamp />,
        shortcut: "⇧A",
        run: () => approveRef.current(),
      },
    ],
    [],
  );
  useRegisterCommands("specs", commands);

  const isLoading = overviewQuery.isLoading;
  const isEmpty = !isLoading && specs.length === 0;

  return (
    <div
      data-testid="spec-dashboard"
      role="application"
      aria-label="Spec validation dashboard"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex h-full flex-col gap-4 outline-none"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xl font-semibold tracking-tight">
            Spec validation
          </h1>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {specs.length} {specs.length === 1 ? "spec" : "specs"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" data-testid="new-spec-link">
            <Link href="/specs/new">
              <Plus className="h-4 w-4" aria-hidden />
              New spec
            </Link>
          </Button>
          {selected ? (
          <div className="flex items-center gap-3">
            <span
              data-testid="selected-status"
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                statusBadgeClass(selected.status),
              )}
            >
              {STATUS_LABELS[selected.status ?? "draft"]}
            </span>
            {isApprovable(selected.status) ? (
              <Button
                size="sm"
                onClick={onApprove}
                disabled={approve.isPending}
                data-testid="approve-spec"
              >
                <Stamp className="h-4 w-4" aria-hidden />
                {approve.isPending ? "Approving…" : "Approve spec"}
              </Button>
            ) : null}
          </div>
          ) : null}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(15rem,20rem)_1fr]">
        {/* Spec list */}
        <div className="flex min-h-0 flex-col overflow-y-auto rounded-lg border border-border bg-card/40 p-2">
          {isLoading ? (
            <ListSkeleton />
          ) : isEmpty ? (
            <EmptyList />
          ) : (
            <SpecList
              specs={filteredSpecs}
              totalCount={specs.length}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          )}
          {overviewQuery.isError ? (
            <ErrorState
              data-testid="specs-error"
              title="Live specs are unavailable"
              description="The SDD engine may be offline. Check your connection and try again."
              onRetry={() => overviewQuery.refetch()}
              className="mt-2 border-none bg-transparent p-3 text-left"
            />
          ) : null}
        </div>

        {/* Detail */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
          {selected ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="flex flex-col gap-2 border-b border-border px-6 py-4">
                <h2 className="font-display text-lg font-semibold leading-tight text-foreground">
                  {selected.name}
                </h2>
                <LifecycleStepper spec={selected} client={client} />
              </div>

              <div className="border-b border-border px-6 py-4">
                <GateTiles gate={gateSummary(selected)} />
              </div>

              <div className="flex flex-col gap-4 px-6 py-4">
                <TabBar active={tab} onChange={setTab} />
                <div>
                  {tab === "traceability" ? (
                    <TraceabilityMatrix
                      traces={selected.validation?.traceability ?? []}
                    />
                  ) : null}
                  {tab === "suggestions" ? (
                    <SuggestionsPanel
                      spec={selected}
                      onUpdateSpec={onUpdateSpec}
                    />
                  ) : null}
                  {tab === "manifest" ? <ManifestPanel spec={selected} /> : null}
                  {tab === "constitution" ? (
                    <ConstitutionPanel constitution={constitution} />
                  ) : null}
                  {tab === "studio" ? <SpecStudio specId={selected.id} client={client} /> : null}
                </div>
              </div>
            </div>
          ) : (
            <NoSelection loading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Spec list ------------------------------------------------------------ //

function SpecList({
  specs,
  totalCount,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  specs: SpecOverview[];
  totalCount: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
}) {
  const filterOptions = ["all", "draft", "clarifying", "approved", "validated"];

  return (
    <div className="flex flex-col gap-2.5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Filter specs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-1">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onStatusFilterChange(opt)}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
              statusFilter === opt
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      {specs.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground">
          No specs match your filters.
        </div>
      ) : (
        <ul className="flex flex-col gap-1" aria-label="Specs">
          {specs.map((spec) => {
            const gate = gateSummary(spec);
            const active = spec.id === selectedId;
            const pct =
              gate.reqsTotal > 0
                ? (gate.reqsSatisfied / gate.reqsTotal) * 100
                : 0;
            return (
              <li key={spec.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(spec.id)}
                  className={cn(
                    "flex w-full flex-col gap-2 rounded-md border px-3 py-2.5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary/40 bg-accent"
                      : "border-transparent hover:bg-accent/50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {spec.name}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium capitalize",
                        statusBadgeClass(spec.status),
                      )}
                    >
                      {STATUS_LABELS[spec.status ?? "draft"]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Requirements sealed"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          pct >= 100 ? "bg-success" : "bg-primary",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {gate.reqsSatisfied}/{gate.reqsTotal}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// --- Gate tiles ----------------------------------------------------------- //

function GateTiles({ gate }: { gate: GateSummary }) {
  return (
    <div
      data-testid="gate-tiles"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
    >
      <StatTile
        label="Validation"
        icon={
          gate.passed === false ? (
            <XCircle className="h-4 w-4 text-danger" aria-hidden />
          ) : (
            <ShieldCheck
              className={cn(
                "h-4 w-4",
                gate.passed ? "text-success" : "text-muted-foreground",
              )}
              aria-hidden
            />
          )
        }
      >
        <span
          className={cn(
            "text-lg font-semibold",
            gate.passed == null && "text-muted-foreground",
            gate.passed === true && "text-success",
            gate.passed === false && "text-danger",
          )}
        >
          {gate.passed == null ? "Not run" : gate.passed ? "Passing" : "Failing"}
        </span>
      </StatTile>

      <StatTile label="Coverage">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-lg font-semibold text-foreground">
            {formatCoverage(gate.coverage)}
          </span>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full",
                (gate.coverage ?? 0) >= 80 ? "bg-success" : "bg-warning",
              )}
              style={{ width: `${gate.coverage ?? 0}%` }}
            />
          </div>
        </div>
      </StatTile>

      <StatTile
        label="Checks"
        icon={<ListChecks className="h-4 w-4 text-muted-foreground" aria-hidden />}
      >
        <span className="font-mono text-lg font-semibold text-foreground">
          {gate.checksPassed}
          <span className="text-sm text-muted-foreground">/{gate.checksTotal}</span>
        </span>
      </StatTile>

      <StatTile
        label="Requirements"
        icon={<Stamp className="h-4 w-4 text-muted-foreground" aria-hidden />}
      >
        <span className="font-mono text-lg font-semibold text-foreground">
          {gate.reqsSatisfied}
          <span className="text-sm text-muted-foreground">/{gate.reqsTotal}</span>
        </span>
      </StatTile>

      <StatTile
        label="Open questions"
        icon={
          <CircleDot
            className={cn(
              "h-4 w-4",
              gate.openQuestions > 0 ? "text-warning" : "text-muted-foreground",
            )}
            aria-hidden
          />
        }
      >
        <span
          className={cn(
            "text-lg font-semibold",
            gate.openQuestions > 0 ? "text-warning" : "text-foreground",
          )}
        >
          {gate.openQuestions}
        </span>
      </StatTile>
    </div>
  );
}

function StatTile({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

// --- Tab bar -------------------------------------------------------------- //

function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === active);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange(TABS[(index + 1) % TABS.length].id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(TABS[(index - 1 + TABS.length) % TABS.length].id);
    }
  };
  return (
    <div
      role="tablist"
      aria-label="Spec detail views"
      onKeyDown={onKeyDown}
      className="inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-muted/50 p-1"
    >
      {TABS.map((t) => {
        const selected = t.id === active;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// --- Empty / loading states ----------------------------------------------- //

function EmptyList() {
  return (
    <EmptyState
      data-testid="empty-specs"
      icon={<ListChecks />}
      title="No specs yet"
      description="Create a spec from an epic to start the SDD lifecycle — draft, clarify, approve, then validate."
      action={
        <Button asChild size="sm" variant="outline" data-testid="empty-new-spec-link">
          <Link href="/specs/new">
            <Plus className="h-4 w-4" aria-hidden />
            New spec
          </Link>
        </Button>
      }
      className="flex-1 border-none bg-transparent"
    />
  );
}

function NoSelection({ loading }: { loading: boolean }) {
  return (
    <EmptyState
      icon={<Route />}
      title={loading ? "Loading specs…" : "Select a spec"}
      description={
        loading ? undefined : "Trace its requirements, tasks and tests, or open Spec Studio to edit it."
      }
      className="h-full border-none bg-transparent"
    />
  );
}

function ListSkeleton() {
  return (
    <Loading data-testid="list-skeleton" label="Loading specs…" className="flex flex-col gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md px-3 py-2.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-1.5 w-full" />
        </div>
      ))}
    </Loading>
  );
}
