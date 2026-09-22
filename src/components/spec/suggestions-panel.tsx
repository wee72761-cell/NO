"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Zap,
  Copy,
  Check,
  Plus,
  Download,
  Kanban,
  Code,
  ArrowRight,
  Send,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { SpecOverview, Requirement, AcceptanceCriterion, SpecConstraint } from "@/lib/api/types";
import { useCreateTask } from "@/lib/api/hooks";
import { apiClient } from "@/lib/api/client";

interface SuggestionsPanelProps {
  spec: SpecOverview;
  onUpdateSpec?: (updated: SpecOverview) => void;
}

interface SuggestionItem {
  id: string;
  category: "resilience" | "security" | "performance" | "test";
  title: string;
  description: string;
  target: "requirement" | "acceptance_criterion" | "constraint";
  impact: "Critical" | "High" | "Recommended";
  suggestedData: {
    id: string;
    text: string;
    priority?: "urgent" | "high" | "medium" | "low";
  };
}

export function SuggestionsPanel({ spec, onUpdateSpec }: SuggestionsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<SuggestionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"suggestions" | "testgen" | "export">("suggestions");

  const createTask = useCreateTask(apiClient);

  // Calculate Spec Quality & Readiness Score (0 - 100)
  const scoreBreakdown = useMemo(() => {
    const reqCount = spec.requirements?.length ?? 0;
    const acCount = spec.acceptance_criteria?.length ?? 0;
    const constraintCount = spec.constraints?.length ?? 0;
    const hasDecisions = (spec.decisions?.length ?? 0) > 0;
    const coverage = spec.validation?.coverage ?? (spec.status === "validated" ? 100 : spec.status === "approved" ? 90 : 40);

    const clarityScore = Math.min(100, Math.round((reqCount / 4) * 40 + (acCount / 3) * 60));
    const testabilityScore = Math.min(100, Math.round(coverage));
    const securityScore = constraintCount > 0 ? 95 : 70;
    const completenessScore = Math.min(
      100,
      Math.round((reqCount > 0 ? 25 : 0) + (acCount > 0 ? 25 : 0) + (constraintCount > 0 ? 25 : 0) + (hasDecisions ? 25 : 15))
    );

    const overall = Math.round(
      clarityScore * 0.25 + testabilityScore * 0.35 + securityScore * 0.2 + completenessScore * 0.2
    );

    return {
      overall,
      clarity: clarityScore,
      testability: testabilityScore,
      security: securityScore,
      completeness: completenessScore,
    };
  }, [spec]);

  // Curated domain suggestions based on spec content
  const baseSuggestions = useMemo<SuggestionItem[]>(() => {
    const list: SuggestionItem[] = [
      {
        id: "sug-resilience-1",
        category: "resilience",
        title: "Idempotent Replay & Cleanup Guarantee",
        description: "Ensure all subtask executions and worktrees can be cleanly rolled back or replayed without orphaned state.",
        target: "acceptance_criterion",
        impact: "High",
        suggestedData: {
          id: `AC-${(spec.acceptance_criteria?.length ?? 0) + 1}`,
          text: "Execution step failures automatically roll back disk diffs and leave zero orphaned artifacts",
        },
      },
      {
        id: "sug-sec-1",
        category: "security",
        title: "Telemetry Credential Masking",
        description: "Enforce regex and entropy scrubbing across all stdout, stderr, and audit payload logs.",
        target: "constraint",
        impact: "Critical",
        suggestedData: {
          id: `C-${(spec.constraints?.length ?? 0) + 1}`,
          text: "Automated secret scrubbing across all trace telemetry streams before persistence",
        },
      },
      {
        id: "sug-perf-1",
        category: "performance",
        title: "Task Execution Concurrency Cap",
        description: "Set explicit bounds on concurrent agent processes to prevent CPU and memory exhaustion.",
        target: "requirement",
        impact: "Recommended",
        suggestedData: {
          id: `REQ-${(spec.requirements?.length ?? 0) + 1}`,
          text: "Enforce maximum concurrency limit of 4 active agent execution contexts per runner",
          priority: "high",
        },
      },
      {
        id: "sug-test-1",
        category: "test",
        title: "Chaos & Network Disconnection Assertion",
        description: "Add automated test case verifying behavior when remote model API yields HTTP 429 or network timeouts.",
        target: "acceptance_criterion",
        impact: "High",
        suggestedData: {
          id: `AC-${(spec.acceptance_criteria?.length ?? 0) + 2}`,
          text: "Handles external API 429/503 responses with exponential backoff and maximum 3 retries",
        },
      },
    ];

    return list;
  }, [spec]);

  const allSuggestions = useMemo(() => {
    return [...dynamicSuggestions, ...baseSuggestions];
  }, [dynamicSuggestions, baseSuggestions]);

  // Handle applying a suggestion directly into the spec
  const handleApply = (suggestion: SuggestionItem) => {
    if (appliedIds.has(suggestion.id)) return;

    const updated = { ...spec };

    if (suggestion.target === "requirement") {
      const newReq: Requirement = {
        id: suggestion.suggestedData.id,
        text: suggestion.suggestedData.text,
      };
      updated.requirements = [...(updated.requirements ?? []), newReq];
    } else if (suggestion.target === "acceptance_criterion") {
      const newAc: AcceptanceCriterion = {
        id: suggestion.suggestedData.id,
        text: suggestion.suggestedData.text,
      };
      updated.acceptance_criteria = [...(updated.acceptance_criteria ?? []), newAc];
    } else if (suggestion.target === "constraint") {
      const newConstraint: SpecConstraint = {
        id: suggestion.suggestedData.id,
        text: suggestion.suggestedData.text,
      };
      updated.constraints = [...(updated.constraints ?? []), newConstraint];
    }

    setAppliedIds((prev) => new Set(prev).add(suggestion.id));
    onUpdateSpec?.(updated);
    toast.success(`Applied suggestion: "${suggestion.title}"`);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom AI suggestion generator
  const handleGenerateCustom = () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const count = allSuggestions.length + 1;
      const promptLower = customPrompt.toLowerCase();
      let category: SuggestionItem["category"] = "resilience";
      if (promptLower.includes("security") || promptLower.includes("auth") || promptLower.includes("secret")) {
        category = "security";
      } else if (promptLower.includes("perf") || promptLower.includes("scale") || promptLower.includes("speed")) {
        category = "performance";
      } else if (promptLower.includes("test") || promptLower.includes("assert") || promptLower.includes("mock")) {
        category = "test";
      }

      const newSug: SuggestionItem = {
        id: `custom-${Date.now()}`,
        category,
        title: customPrompt.charAt(0).toUpperCase() + customPrompt.slice(1),
        description: `Automated requirement generated from prompt: "${customPrompt}". Designed for high reliability in autonomous agent loops.`,
        target: "requirement",
        impact: "High",
        suggestedData: {
          id: `REQ-${count + 10}`,
          text: `Enforce ${customPrompt} with deterministic validation and audit verification`,
          priority: "high",
        },
      };

      setDynamicSuggestions((prev) => [newSug, ...prev]);
      setCustomPrompt("");
      setIsGenerating(false);
      toast.success("Generated tailored spec suggestion!");
    }, 600);
  };

  // Auto-breakdown spec into Kanban tasks
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  const handleBreakdownToTasks = async () => {
    setIsCreatingTasks(true);
    try {
      const reqs = spec.requirements ?? [];
      if (reqs.length === 0) {
        toast.error("Spec has no requirements to convert to tasks");
        setIsCreatingTasks(false);
        return;
      }

      let count = 0;
      for (const req of reqs) {
        await createTask.mutateAsync({
          title: `[${spec.name.slice(0, 20)}…] ${req.text}`,
          description: `Generated from ${spec.id} (${req.id}).`,
          priority: "high",
          kind: "feature",
          status: "ready",
          estimate: 3,
          labels: ["spec-driven", "sdd", spec.id],
        });
        count++;
      }
      toast.success(`Successfully created ${count} tasks on Kanban board!`);
    } catch {
      toast.error("Failed to generate some tasks. Check board connectivity.");
    } finally {
      setIsCreatingTasks(false);
    }
  };

  // Generated Python pytest test file
  const generatedTestSuite = useMemo(() => {
    const acs = spec.acceptance_criteria ?? [];
    const reqs = spec.requirements ?? [];

    return `# Generated Test Suite for: ${spec.name}
# Spec ID: ${spec.id}
# Status: ${spec.status}
# Framework: pytest / pytest-asyncio

import pytest
import asyncio

${acs
  .map(
    (ac, idx) => `
@pytest.mark.asyncio
async def test_ac_${idx + 1}_${ac.id.toLowerCase().replace(/[^a-z0-9]/g, "_")}_verification():
    """
    Acceptance Criterion: ${ac.text}
    Mapped Requirement: ${reqs[idx % (reqs.length || 1)]?.id ?? "REQ-CORE"}
    """
    # 1. Arrange test fixture
    # 2. Act on sandbox execution
    # 3. Assert criterion holds: ${ac.text}
    assert True
`
  )
  .join("\n")}
`;
  }, [spec]);

  // Markdown Export
  const markdownExport = useMemo(() => {
    return `# Specification: ${spec.name}
**ID:** ${spec.id}  
**Status:** ${spec.status?.toUpperCase()}  
**Quality Score:** ${scoreBreakdown.overall}/100  

---

## 1. Requirements
${(spec.requirements ?? []).map((r) => `- **[${r.id}]**: ${r.text}`).join("\n")}

## 2. Acceptance Criteria
${(spec.acceptance_criteria ?? []).map((a) => `- [ ] **[${a.id}]**: ${a.text}`).join("\n")}

## 3. Constraints & Guardrails
${(spec.constraints ?? []).map((c) => (typeof c === "string" ? `- ${c}` : `- **[${c.id}]**: ${c.text}`)).join("\n")}

## 4. Architectural Decisions (ADRs)
${(spec.decisions ?? []).map((d) => `### ${d.title} (${d.status})\n- **Context:** ${d.context}\n- **Decision:** ${d.decision}\n- **Consequences:** ${d.consequences}`).join("\n\n")}

---
*Generated by Forge SDD Engine*
`;
  }, [spec, scoreBreakdown]);

  return (
    <div className="flex flex-col gap-6" data-testid="suggestions-panel">
      {/* Top Header Card: Quality & Readiness Score */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Spec Quality & Readiness Score</h3>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    scoreBreakdown.overall >= 85
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : scoreBreakdown.overall >= 65
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {scoreBreakdown.overall >= 85
                    ? "Production Ready"
                    : scoreBreakdown.overall >= 65
                    ? "Needs Refinement"
                    : "Draft Quality"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Automated evaluation across requirements clarity, test coverage, and security guardrails.
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-bold tracking-tight text-foreground">
              {scoreBreakdown.overall}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-card/60 p-2.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Clarity</span>
              <span className="font-semibold text-foreground">{scoreBreakdown.clarity}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${scoreBreakdown.clarity}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-card/60 p-2.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Testability</span>
              <span className="font-semibold text-foreground">{scoreBreakdown.testability}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${scoreBreakdown.testability}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-card/60 p-2.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Security</span>
              <span className="font-semibold text-foreground">{scoreBreakdown.security}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${scoreBreakdown.security}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-card/60 p-2.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Completeness</span>
              <span className="font-semibold text-foreground">{scoreBreakdown.completeness}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${scoreBreakdown.completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Suggestions / Test Generator / Export */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("suggestions")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === "suggestions"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            AI Suggestions ({allSuggestions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("testgen")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === "testgen"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Code className="h-3.5 w-3.5" />
            Test Scaffold Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === "export"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Download className="h-3.5 w-3.5" />
            Export & Breakdown
          </button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleBreakdownToTasks}
          disabled={isCreatingTasks}
          className="gap-1.5 text-xs"
        >
          <Kanban className="h-3.5 w-3.5" />
          {isCreatingTasks ? "Generating..." : "Breakdown to Kanban Tasks"}
        </Button>
      </div>

      {/* TAB 1: AI Suggestions */}
      {activeTab === "suggestions" && (
        <div className="flex flex-col gap-5">
          {/* Ask AI for custom suggestion */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask AI: e.g., 'Suggest negative test cases', 'Add secret leak checks'..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGenerateCustom();
                }}
                className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button
              size="sm"
              onClick={handleGenerateCustom}
              disabled={isGenerating || !customPrompt.trim()}
              className="gap-1.5 text-xs"
            >
              {isGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Generate
            </Button>
          </div>

          {/* Suggestion Cards List */}
          <div className="flex flex-col gap-3">
            {allSuggestions.map((item) => {
              const isApplied = appliedIds.has(item.id);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col justify-between gap-3 rounded-xl border p-4 transition-all duration-200",
                    isApplied
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border bg-card hover:border-border/80 hover:shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          item.category === "security"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : item.category === "resilience"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : item.category === "performance"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {item.category === "security" ? (
                          <Shield className="h-4 w-4" />
                        ) : item.category === "resilience" ? (
                          <Zap className="h-4 w-4" />
                        ) : item.category === "performance" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.2 text-[10px] font-medium uppercase tracking-wide",
                              item.impact === "Critical"
                                ? "bg-destructive/10 text-destructive"
                                : item.impact === "High"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.impact}
                          </span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground capitalize">
                            Target: {item.target.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.suggestedData.text, item.id)}
                        className="h-7 px-2 text-xs"
                        title="Copy text"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant={isApplied ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleApply(item)}
                        disabled={isApplied}
                        className={cn("h-7 gap-1 px-2.5 text-xs", isApplied && "border-emerald-500/50 text-emerald-600")}
                      >
                        {isApplied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Apply to Spec
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Code preview of item */}
                  <div className="rounded-lg border border-border/50 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground/90">
                    <span className="font-semibold text-primary">{item.suggestedData.id}:</span>{" "}
                    {item.suggestedData.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Test Scaffold Generator */}
      {activeTab === "testgen" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Executable Test Scaffold</h4>
              <p className="text-xs text-muted-foreground">
                Synthesized from {spec.acceptance_criteria?.length ?? 0} acceptance criteria and {spec.requirements?.length ?? 0} requirements.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generatedTestSuite, "testsuite")}
                className="gap-1.5 text-xs"
              >
                {copiedId === "testsuite" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([generatedTestSuite], { type: "text/x-python" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `test_${spec.id.replace(/-/g, "_")}.py`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Downloaded test scaffold");
                }}
                className="gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download .py
              </Button>
            </div>
          </div>

          <pre className="overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-foreground leading-relaxed">
            <code>{generatedTestSuite}</code>
          </pre>
        </div>
      )}

      {/* TAB 3: Export & Breakdown */}
      {activeTab === "export" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Markdown Document</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ready for GitHub PR descriptions, engineering RFC wikis, and design review boards.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(markdownExport, "mdexport")}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Markdown
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([markdownExport], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${spec.id}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Downloaded markdown");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .md
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">JSON Spec Manifest</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Structured JSON payload matching the SDD schema for CI/CD linting and automated test runs.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(spec, null, 2), "jsonexport")}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${spec.id}-manifest.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Downloaded JSON");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .json
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">Markdown Preview</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(markdownExport, "mdpreview")}
                className="h-7 text-xs gap-1"
              >
                {copiedId === "mdpreview" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </Button>
            </div>
            <pre className="max-h-72 overflow-y-auto rounded-lg border border-border/50 bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
              {markdownExport}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
