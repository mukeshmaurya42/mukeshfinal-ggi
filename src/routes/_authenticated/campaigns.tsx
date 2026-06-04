import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Megaphone, Mail, MessageSquare, Plus, Play, Pause, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/campaigns")({
  component: Campaigns,
});

type Status = "Active" | "Scheduled" | "Paused" | "Draft";
type Campaign = { id: number; name: string; channel: "Email" | "SMS" | "Social"; status: Status; audience: string; sent: number; openRate: number; updated: string };

const INITIAL: Campaign[] = [
  { id: 1, name: "Spring Launch Sequence", channel: "Email", status: "Active", audience: "All subscribers", sent: 5240, openRate: 42, updated: "2h ago" },
  { id: 2, name: "Cart Recovery", channel: "SMS", status: "Active", audience: "Abandoned carts", sent: 1180, openRate: 71, updated: "5h ago" },
  { id: 3, name: "Webinar Invite", channel: "Email", status: "Scheduled", audience: "High-intent leads", sent: 0, openRate: 0, updated: "1d ago" },
  { id: 4, name: "Black Friday Teaser", channel: "Social", status: "Draft", audience: "Instagram followers", sent: 0, openRate: 0, updated: "3d ago" },
  { id: 5, name: "Win-back Flow", channel: "Email", status: "Paused", audience: "Churned users", sent: 860, openRate: 28, updated: "1w ago" },
];

const STATUS_STYLES: Record<Status, string> = {
  Active: "bg-green-500/10 text-green-600",
  Scheduled: "bg-blue-500/10 text-blue-600",
  Paused: "bg-orange-500/10 text-orange-600",
  Draft: "bg-muted text-muted-foreground",
};

const CHANNEL_ICON = { Email: Mail, SMS: MessageSquare, Social: Megaphone };

function Campaigns() {
  const [list, setList] = useState(INITIAL);

  const toggle = (id: number) =>
    setList((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next: Status = c.status === "Active" ? "Paused" : "Active";
        toast.success(`${c.name} ${next === "Active" ? "resumed" : "paused"}`);
        return { ...c, status: next };
      })
    );

  const create = () => {
    const id = Math.max(...list.map((c) => c.id)) + 1;
    setList([{ id, name: `New Campaign ${id}`, channel: "Email", status: "Draft", audience: "Unassigned", sent: 0, openRate: 0, updated: "just now" }, ...list]);
    toast.success("Draft campaign created");
  };

  const totalSent = list.reduce((a, c) => a + c.sent, 0);
  const active = list.filter((c) => c.status === "Active").length;
  const avgOpen = Math.round(list.filter((c) => c.sent > 0).reduce((a, c) => a + c.openRate, 0) / Math.max(list.filter((c) => c.sent > 0).length, 1));

  const stats = [
    { label: "Active campaigns", value: active, icon: Play },
    { label: "Messages sent", value: totalSent.toLocaleString(), icon: TrendingUp },
    { label: "Avg open rate", value: `${avgOpen}%`, icon: Mail },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">Orchestrate multi-channel marketing campaigns.</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo data</span>
        </div>
        <button onClick={create} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><s.icon className="h-4 w-4" /><span className="text-sm font-medium text-foreground">{s.label}</span></div>
            <div className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="py-4 font-medium">Channel</th>
                <th className="py-4 font-medium">Status</th>
                <th className="py-4 font-medium">Audience</th>
                <th className="py-4 text-right font-medium">Sent</th>
                <th className="py-4 text-right font-medium">Open rate</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((c) => {
                const Icon = CHANNEL_ICON[c.channel];
                return (
                  <tr key={c.id} className="transition-colors hover:bg-surface-2/40">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Updated {c.updated}</div>
                    </td>
                    <td className="py-4"><span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon className="h-4 w-4" /> {c.channel}</span></td>
                    <td className="py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[c.status]}`}>{c.status}</span></td>
                    <td className="py-4 text-muted-foreground">{c.audience}</td>
                    <td className="py-4 text-right font-medium text-foreground">{c.sent.toLocaleString()}</td>
                    <td className="py-4 text-right font-medium text-foreground">{c.sent ? `${c.openRate}%` : "—"}</td>
                    <td className="px-6 py-4 text-right">
                      {(c.status === "Active" || c.status === "Paused") ? (
                        <button onClick={() => toggle(c.id)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2">
                          {c.status === "Active" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
