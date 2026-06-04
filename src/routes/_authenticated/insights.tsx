import { createFileRoute } from "@tanstack/react-router";
import { LineChart as LineIcon, TrendingUp, Sparkles, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/_authenticated/insights")({
  component: InsightsPage,
});

const TREND = [
  { month: "Jan", engagement: 32, conversions: 12 },
  { month: "Feb", engagement: 41, conversions: 15 },
  { month: "Mar", engagement: 38, conversions: 14 },
  { month: "Apr", engagement: 52, conversions: 21 },
  { month: "May", engagement: 61, conversions: 27 },
  { month: "Jun", engagement: 74, conversions: 34 },
];

const CHANNELS = [
  { name: "Email", value: 44, color: "#FF5E1E" },
  { name: "Social", value: 28, color: "#3B82F6" },
  { name: "SEO", value: 18, color: "#10B981" },
  { name: "Ads", value: 10, color: "#A855F7" },
];

const PREDICTIONS = [
  { title: "Email is your strongest channel", body: "It drives 44% of engagement. Shift 15% more budget here for an estimated +8% conversions." },
  { title: "Send on Tuesday mornings", body: "Opens peak at 9–11am Tuesday. Scheduling sends here could lift open rate by ~6%." },
  { title: "Your CTAs are underperforming", body: "Posts with action verbs convert 2.3× better. Add a clear CTA to your last 3 drafts." },
];

function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">AI Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">Predictive analytics across your marketing performance.</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo data</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground"><LineIcon className="mr-2 inline h-4 w-4 text-primary" />Engagement &amp; Conversions</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600"><TrendingUp className="h-3.5 w-3.5" /> +21% vs last period</span>
          </div>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5E1E" stopOpacity={0.3} /><stop offset="95%" stopColor="#FF5E1E" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="engagement" stroke="#FF5E1E" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="conversions" stroke="#3B82F6" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-foreground">Channel Mix</h3>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHANNELS} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {CHANNELS.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 className="mb-4 mt-8 font-display text-lg font-semibold text-foreground"><Lightbulb className="mr-2 inline h-4 w-4 text-primary" />AI Recommendations</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {PREDICTIONS.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
            <div className="font-semibold text-foreground">{p.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
