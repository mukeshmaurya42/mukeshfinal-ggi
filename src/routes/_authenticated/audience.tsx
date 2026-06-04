import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserPlus, Search, Sparkles, Mail, Smartphone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/audience")({
  component: AudiencePage,
});

const SEGMENTS = [
  { name: "High-Intent Buyers", count: 1240, growth: 12, color: "bg-primary" },
  { name: "Newsletter Subscribers", count: 8460, growth: 8, color: "bg-blue-500" },
  { name: "Trial Users", count: 320, growth: -3, color: "bg-orange-500" },
  { name: "Churned (win-back)", count: 540, growth: 2, color: "bg-muted-foreground/40" },
];

const CONTACTS = [
  { name: "Aisha Khan", email: "aisha@example.com", segment: "High-Intent Buyers", channel: "Email", joined: "Jun 2, 2026" },
  { name: "Marcus Lee", email: "marcus@example.com", segment: "Trial Users", channel: "SMS", joined: "Jun 1, 2026" },
  { name: "Priya Nair", email: "priya@example.com", segment: "Newsletter Subscribers", channel: "Email", joined: "May 30, 2026" },
  { name: "Diego Sanz", email: "diego@example.com", segment: "High-Intent Buyers", channel: "Email", joined: "May 28, 2026" },
  { name: "Yuki Tanaka", email: "yuki@example.com", segment: "Churned (win-back)", channel: "SMS", joined: "May 25, 2026" },
  { name: "Emma Wright", email: "emma@example.com", segment: "Newsletter Subscribers", channel: "Email", joined: "May 21, 2026" },
];

function AudiencePage() {
  const [q, setQ] = useState("");
  const contacts = CONTACTS.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q.toLowerCase()));
  const total = SEGMENTS.reduce((a, s) => a + s.count, 0);

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Audience</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total.toLocaleString()} contacts across {SEGMENTS.length} segments.</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo data</span>
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
          <UserPlus className="h-4 w-4" /> Add Contact
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SEGMENTS.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground"><span className={`h-2.5 w-2.5 rounded-full ${s.color}`} /> {s.name}</div>
            <div className="mt-3 font-display text-2xl font-bold text-foreground">{s.count.toLocaleString()}</div>
            <div className={`mt-1 text-xs font-semibold ${s.growth >= 0 ? "text-green-600" : "text-red-500"}`}>{s.growth >= 0 ? "↗" : "↘"} {Math.abs(s.growth)}% this month</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search contacts…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="py-3 font-medium">Segment</th>
                <th className="py-3 font-medium">Channel</th>
                <th className="px-5 py-3 text-right font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contacts.map((c) => (
                <tr key={c.email} className="transition-colors hover:bg-surface-2/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                      <div>
                        <div className="font-semibold text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-muted-foreground">{c.segment}</td>
                  <td className="py-4"><span className="inline-flex items-center gap-1.5 text-muted-foreground">{c.channel === "Email" ? <Mail className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />} {c.channel}</span></td>
                  <td className="px-5 py-4 text-right text-xs text-muted-foreground">{c.joined}</td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-sm text-muted-foreground"><Users className="mx-auto mb-2 h-5 w-5 opacity-40" /> No contacts match “{q}”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
