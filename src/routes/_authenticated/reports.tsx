import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, Plus, Calendar, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

type Report = { id: number; name: string; period: string; type: string; generated: string; size: string };

const REPORTS: Report[] = [
  { id: 1, name: "Monthly Performance — May 2026", period: "May 2026", type: "Performance", generated: "Jun 1, 2026", size: "1.2 MB" },
  { id: 2, name: "Campaign ROI Breakdown", period: "Q2 2026", type: "ROI", generated: "May 28, 2026", size: "840 KB" },
  { id: 3, name: "Audience Growth Report", period: "Apr 2026", type: "Audience", generated: "May 2, 2026", size: "610 KB" },
  { id: 4, name: "Content Scoring Summary", period: "Apr 2026", type: "Content", generated: "May 1, 2026", size: "520 KB" },
];

function ReportsPage() {
  const [downloading, setDownloading] = useState<number | null>(null);

  const download = (r: Report) => {
    setDownloading(r.id);
    setTimeout(() => {
      setDownloading(null);
      // Mock export: generate a small text file client-side.
      const blob = new Blob([`MarketGen Report\n${r.name}\nPeriod: ${r.period}\nGenerated: ${r.generated}\n\n(Demo report — sample data.)`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${r.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Export shareable reports for clients and stakeholders.</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo data</span>
        </div>
        <button onClick={() => toast.success("New report queued — you'll be notified when it's ready")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Generate Report
        </button>
      </div>

      <div className="space-y-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="font-semibold text-foreground">{r.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 font-medium">{r.type}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {r.generated}</span>
                  <span>· {r.size}</span>
                </div>
              </div>
            </div>
            <button onClick={() => download(r)} disabled={downloading === r.id} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-70 sm:w-auto">
              {downloading === r.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing…</> : <><Download className="h-4 w-4" /> Download</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
