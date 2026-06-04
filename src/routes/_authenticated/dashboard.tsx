import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Type, Search, Megaphone, Sparkles, Wand2, ArrowRight, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getStats, listHistory } from "@/lib/marketgen.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const TYPE_LABELS: Record<string, string> = {
  social_post: "Social posts",
  ad_copy: "Ad copy",
  seo_blog: "SEO blogs",
  email: "Email",
  product_description: "Product desc.",
  hashtags: "Hashtags",
  rewrite: "Rewrites",
};

function scoreColor(v: number) {
  return v >= 80 ? "text-green-600" : v >= 50 ? "text-orange-500" : "text-red-500";
}

function Dashboard() {
  const statsFn = useServerFn(getStats);
  const listFn = useServerFn(listHistory);
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => statsFn() });
  const history = useQuery({ queryKey: ["history"], queryFn: () => listFn() });

  const s = stats.data;
  const items = history.data?.items ?? [];
  const loading = stats.isLoading || history.isLoading;
  const error = stats.error || history.error;

  const cards = [
    { label: "Total Generations", value: s ? s.total.toLocaleString() : "—", icon: Sparkles, suffix: "" },
    { label: "Words Written", value: s ? s.totalWords.toLocaleString() : "—", icon: Type, suffix: "" },
    { label: "Avg SEO Score", value: s ? String(s.avgSeo) : "—", icon: Search, suffix: "/100" },
    { label: "Avg Marketing Score", value: s ? String(s.avgMarketing) : "—", icon: Megaphone, suffix: "/100" },
  ];

  const barData = s
    ? Object.entries(s.byType)
        .map(([k, v]) => ({ name: TYPE_LABELS[k] ?? k, value: v }))
        .sort((a, b) => b.value - a.value)
    : [];

  const scoreBars = s
    ? [
        { label: "SEO", value: s.avgSeo },
        { label: "Marketing", value: s.avgMarketing },
        { label: "Readability", value: s.avgReadability },
      ]
    : [];

  const isEmpty = !loading && s && s.total === 0;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl pb-20">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Failed to load dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your real content generation activity at a glance.</p>
        </div>
        <Link to="/studio" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Wand2 className="h-4 w-4" /> Generate Content
        </Link>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl border border-border bg-surface p-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading your data...</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-transparent">
            <Wand2 className="h-8 w-8 text-primary/60" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">No content yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Generate your first piece in the Content Studio and your real stats will appear here.</p>
          <Link to="/studio" className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <Wand2 className="h-4 w-4" /> Open Studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <c.icon className="h-4 w-4" />
                  <span className="text-sm font-medium text-foreground">{c.label}</span>
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <div className="font-display text-3xl font-bold tracking-tight text-foreground">{c.value}</div>
                  {c.suffix && <span className="mb-1 text-sm text-muted-foreground/60">{c.suffix}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Content by type */}
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-foreground">Content by Type</h3>
              <p className="text-xs text-muted-foreground">What you've generated across all modules.</p>
              <div className="mt-6 h-64 w-full">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} dy={10} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#FF5E1E" : "#E5E7EB"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
                )}
              </div>
            </div>

            {/* Average scores */}
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-foreground">Average Quality Scores</h3>
              <p className="text-xs text-muted-foreground">Across every piece you've generated.</p>
              <div className="mt-8 space-y-6">
                {scoreBars.map((b) => (
                  <div key={b.label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{b.label}</span>
                      <span className={`text-sm font-bold ${scoreColor(b.value)}`}>
                        {b.value}
                        <span className="text-xs text-muted-foreground/50">/100</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary/40 to-primary transition-all" style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent generations */}
          <div className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">Recent Generations</h3>
              <Link to="/history" className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto pb-2">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Language</th>
                    <th className="pb-3 font-medium text-right">SEO</th>
                    <th className="pb-3 font-medium text-right">Marketing</th>
                    <th className="pb-3 font-medium text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.slice(0, 6).map((i) => (
                    <tr key={i.id} className="transition-colors hover:bg-surface-2/50">
                      <td className="max-w-[220px] truncate py-4 font-semibold text-foreground">{i.title || i.content_type}</td>
                      <td className="py-4 capitalize text-muted-foreground">{i.content_type.replace("_", " ")}</td>
                      <td className="py-4 text-muted-foreground">{i.language}</td>
                      <td className={`py-4 text-right font-medium ${scoreColor(i.seo_score || 0)}`}>{i.seo_score ?? "-"}</td>
                      <td className={`py-4 text-right font-medium ${scoreColor(i.marketing_score || 0)}`}>{i.marketing_score ?? "-"}</td>
                      <td className="py-4 text-right text-xs text-muted-foreground">
                        {new Date(i.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        <FileText className="mx-auto mb-2 h-5 w-5 opacity-40" /> No generations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
