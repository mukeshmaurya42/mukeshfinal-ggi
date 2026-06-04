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
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your marketing engine at a glance.</p>
        </div>
        <Link to="/studio" className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-glow"><Wand2 className="h-4 w-4" /> New generation</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <c.icon className="h-5 w-5 text-primary-glow" />
            <div className="mt-3 font-display text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold">Recent content</h2>
        <div className="glass rounded-2xl divide-y divide-border">
          {history.data?.items.slice(0, 6).map((i) => (
            <div key={i.id} className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <div className="truncate font-medium">{i.title || i.content_type}</div>
                <div className="text-xs text-muted-foreground">{i.content_type} · {i.language} · {new Date(i.created_at).toLocaleString()}</div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-surface-2 px-2 py-1">SEO {i.seo_score}</span>
                <span className="rounded-full bg-surface-2 px-2 py-1">MKT {i.marketing_score}</span>
              </div>
            </div>
          ))}
          {!history.isLoading && (history.data?.items.length ?? 0) === 0 && (
            <div className="p-8 text-center text-muted-foreground">No content yet. <Link to="/studio" className="text-primary-glow hover:underline">Generate your first piece</Link>.</div>
          )}
        </div>
      </div>
    </div>
  );
}
