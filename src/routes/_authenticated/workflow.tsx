import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Workflow as WorkflowIcon, Plus, Zap, Clock, Mail, GitBranch, Users, Sparkles, Play, Pause } from "lucide-react";

export const Route = createFileRoute("/_authenticated/workflow")({
  component: WorkflowPage,
});

type Flow = { id: number; name: string; trigger: string; status: "Live" | "Paused"; runs: number; steps: { icon: typeof Zap; label: string }[] };

const FLOWS: Flow[] = [
  {
    id: 1, name: "Welcome Onboarding", trigger: "New signup", status: "Live", runs: 1240,
    steps: [{ icon: Users, label: "Signup" }, { icon: Clock, label: "Wait 1h" }, { icon: Mail, label: "Welcome email" }, { icon: Clock, label: "Wait 2d" }, { icon: Mail, label: "Tips email" }],
  },
  {
    id: 2, name: "Abandoned Cart", trigger: "Cart abandoned", status: "Live", runs: 860,
    steps: [{ icon: Zap, label: "Cart left" }, { icon: Clock, label: "Wait 4h" }, { icon: Mail, label: "Reminder" }, { icon: GitBranch, label: "If no buy" }, { icon: Mail, label: "10% off" }],
  },
  {
    id: 3, name: "Re-engagement", trigger: "30 days inactive", status: "Paused", runs: 410,
    steps: [{ icon: Clock, label: "Inactive 30d" }, { icon: Mail, label: "We miss you" }, { icon: GitBranch, label: "If opened" }, { icon: Mail, label: "Offer" }],
  },
];

function WorkflowPage() {
  const [flows, setFlows] = useState(FLOWS);

  const toggle = (id: number) =>
    setFlows((prev) => prev.map((f) => {
      if (f.id !== id) return f;
      const status = f.status === "Live" ? "Paused" : "Live";
      toast.success(`${f.name} ${status === "Live" ? "activated" : "paused"}`);
      return { ...f, status };
    }));

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Automation Workflows</h1>
          <p className="mt-1 text-sm text-muted-foreground">Build visual sequences that run on their own.</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo data</span>
        </div>
        <button onClick={() => toast.success("New workflow draft created")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Workflow
        </button>
      </div>

      <div className="space-y-5">
        {flows.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><WorkflowIcon className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">{f.name}</div>
                  <div className="text-xs text-muted-foreground">Trigger: {f.trigger} · {f.runs.toLocaleString()} runs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${f.status === "Live" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"}`}>{f.status}</span>
                <button onClick={() => toggle(f.id)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2">
                  {f.status === "Live" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Activate</>}
                </button>
              </div>
            </div>

            {/* Visual sequence */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
              {f.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex min-w-[96px] flex-col items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-3 text-center">
                    <step.icon className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-medium text-foreground">{step.label}</span>
                  </div>
                  {i < f.steps.length - 1 && <div className="h-px w-6 shrink-0 bg-border" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
