import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Sparkles, BarChart3, Type, Wand2 } from "lucide-react";
import { getStats, listHistory } from "@/lib/marketgen.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const statsFn = useServerFn(getStats);
  const histFn = useServerFn(listHistory);
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => statsFn() });
  const history = useQuery({ queryKey: ["history"], queryFn: () => histFn() });

  const cards = [
    { icon: FileText, label: "Content generated", value: stats.data?.total ?? 0 },
    { icon: Type, label: "Words generated", value: (stats.data?.totalWords ?? 0).toLocaleString() },
    { icon: Sparkles, label: "Avg SEO score", value: stats.data?.avgSeo ?? 0 },
    { icon: BarChart3, label: "Avg marketing score", value: stats.data?.avgMarketing ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your content generation command center.</p>
        </div>
        <Link to="/studio" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Wand2 className="h-4 w-4" /> New generation
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="group overflow-hidden rounded-2xl border border-border bg-surface/50 p-5 shadow-sm transition-all hover:border-primary/50 hover:bg-surface">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-surface-2 p-2 text-muted-foreground transition-colors group-hover:text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">{c.label}</div>
            </div>
            <div className="mt-4 font-display text-3xl font-bold tracking-tight">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">Recent Activity</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/30 shadow-sm">
          {history.data?.items.slice(0, 6).map((i, idx) => (
            <div key={i.id} className={`flex items-center justify-between p-4 transition-colors hover:bg-surface/50 ${idx !== 0 ? 'border-t border-border' : ''}`}>
              <div className="min-w-0 pr-4">
                <div className="truncate text-sm font-semibold">{i.title || i.content_type}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{i.content_type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{new Date(i.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">SEO</span>
                    <span className={`text-xs font-bold ${i.seo_score && i.seo_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{i.seo_score || '-'}</span>
                  </div>
                  <div className="hidden h-3 w-px bg-border sm:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">MKT</span>
                    <span className={`text-xs font-bold ${i.marketing_score && i.marketing_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{i.marketing_score || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!history.isLoading && (history.data?.items.length ?? 0) === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-surface-2 p-4 text-muted-foreground"><FileText className="h-6 w-6" /></div>
              <p className="text-sm font-medium text-foreground">No activity yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Link to="/studio" className="font-medium text-primary hover:underline">Create your first piece of content</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
