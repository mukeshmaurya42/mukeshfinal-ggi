import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownRight, Users, Mail, MousePointerClick, Zap, MoreHorizontal, ShoppingCart, Share2, Link as LinkIcon, RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const cards = [
    { label: "Total Leads", value: "12,480", change: "+8.4%", positive: true, icon: Users, desc: "More traffic coming from organic search." },
    { label: "Email Open Rate", value: "42.2%", change: "+3.1%", positive: true, icon: Mail, desc: "Your welcome sequence is above average." },
    { label: "Conversion Rate", value: "7.9%", change: "-0.4%", positive: false, icon: MousePointerClick, desc: "Retargeting boosted conversions this week." },
    { label: "Active Automations", value: "14", change: "Stable", positive: true, icon: Zap, desc: "3 workflows need optimization." },
  ];

  const barData = [
    { name: "SMS", value: 2800 },
    { name: "Meta Ads", value: 2100 },
    { name: "Email", value: 5200 },
    { name: "Google Ads", value: 1600 },
  ];

  const campaigns = [
    { name: "Welcome Flow", type: "Email", status: "Active", audience: "New Users", openRate: "46%", time: "2 hours ago" },
    { name: "Spring Promotion", type: "Email", status: "Active", audience: "All Subscribers", openRate: "38%", time: "5 hours ago" },
    { name: "Cart Recovery", type: "SMS", status: "Scheduled", audience: "Abandoned Carts", openRate: "72%", time: "1 day ago" },
  ];

  const activities = [
    { icon: ShoppingCart, text: "Triggered: Abandoned Cart Flow sent 1 message.", time: "5 min ago", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Users, text: "New lead added to segment: High Intent Buyers.", time: "12 min ago", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: LinkIcon, text: "A/B test started for Promo Email #3.", time: "1 hour ago", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: RefreshCcw, text: "Campaign 'Spring Sale' finished.", time: "2 hours ago", color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">A quick look at how your marketing is performing today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium transition-colors hover:bg-surface-2">
            Today <ArrowDownRight className="ml-2 h-4 w-4" />
          </button>
          <button className="flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Export Summary
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <c.icon className="h-4 w-4" />
                <span className="text-sm font-medium text-foreground">{c.label}</span>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <div className="font-display text-3xl font-bold tracking-tight text-foreground">{c.value}</div>
              <div className={`mb-1 flex items-center text-xs font-semibold ${c.positive ? 'text-green-600' : 'text-red-500'}`}>
                {c.change !== "Stable" && (c.positive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />)}
                {c.change}
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-gradient-to-r from-primary/20 to-primary w-[70%]" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">Top Performing Channels</h3>
            <span className="text-xs font-semibold text-green-600">+12% this week</span>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Email' ? '#FF5E1E' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-1"></span> Email is generating the highest engagement this week.
          </div>
        </div>

        {/* Audience Growth pseudo-chart (Responsive) */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Audience Growth</h3>
              <p className="text-xs text-muted-foreground"><span className="font-semibold text-green-600">380+</span> new contact this week</p>
            </div>
            <button className="text-xs font-semibold text-muted-foreground transition hover:text-foreground hidden sm:block">View Detailed Analytics →</button>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0 sm:h-64">
            <div className="relative flex h-48 sm:h-full w-full flex-1 items-center justify-center">
              {/* Bubble 1 */}
              <div className="absolute top-0 right-4 sm:top-4 sm:right-12 z-10 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-xl sm:text-2xl font-bold text-white shadow-lg">
                245
                <span className="absolute -left-12 -top-4 sm:-left-16 whitespace-nowrap rounded-full border border-border bg-surface px-2 py-1 text-[10px] text-muted-foreground shadow-sm">Email Subscribers</span>
              </div>
              {/* Bubble 2 */}
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-0 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-surface-2 text-lg sm:text-xl font-bold text-foreground shadow-sm border border-border">
                89
                <span className="absolute -left-8 -top-4 sm:-left-12 whitespace-nowrap rounded-full border border-border bg-surface px-2 py-1 text-[10px] text-muted-foreground shadow-sm">SMS Subscribers</span>
              </div>
              {/* Bubble 3 */}
              <div className="absolute bottom-0 right-4 sm:bottom-4 sm:right-8 z-20 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted text-base sm:text-lg font-bold text-foreground shadow-sm border border-border">
                46
                <span className="absolute -right-2 -bottom-6 sm:-right-4 whitespace-nowrap text-[10px] text-muted-foreground">Trial Users</span>
              </div>
            </div>
            
            <div className="flex w-full sm:w-40 flex-col justify-center gap-6 border-t border-border pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground">Email Subscribers</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold">245</span>
                  <span className="text-xs text-muted-foreground">(57%)</span>
                  <span className="text-xs font-bold text-green-600">↗ 12%</span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-surface-2"><div className="h-full w-[57%] rounded-full bg-primary"></div></div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground">SMS Subscribers</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold">89</span>
                  <span className="text-xs text-muted-foreground">(28%)</span>
                  <span className="text-xs font-bold text-green-600">↗ 8%</span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-surface-2"><div className="h-full w-[28%] rounded-full bg-muted-foreground/30"></div></div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground">Trial Users</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold">46</span>
                  <span className="text-xs text-muted-foreground">(15%)</span>
                  <span className="text-xs font-bold text-green-600">↗ 12%</span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-surface-2"><div className="h-full w-[15%] rounded-full bg-muted-foreground/30"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent Campaigns Table */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Recent Campaigns</h3>
            <button className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">View All →</button>
          </div>
          <div className="overflow-x-auto pb-2">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Audience</th>
                  <th className="pb-3 font-medium text-right">Open Rate</th>
                  <th className="pb-3 font-medium text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((c, i) => (
                  <tr key={i} className="transition-colors hover:bg-surface-2/50">
                    <td className="py-4 font-semibold text-foreground">{c.name}</td>
                    <td className="py-4 text-muted-foreground">{c.type}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">{c.audience}</td>
                    <td className="py-4 text-right font-medium text-foreground">{c.openRate}</td>
                    <td className="py-4 text-right text-xs text-muted-foreground">{c.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Activity Feed</h3>
            <button className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">View All →</button>
          </div>
          <div className="space-y-6">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.bg} ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight text-foreground">{a.text}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
