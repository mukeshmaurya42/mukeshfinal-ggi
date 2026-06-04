import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Mail, BarChart3, MessageSquare, Slack, Database, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/integrations")({
  component: IntegrationsPage,
});

type Integration = { id: string; name: string; desc: string; icon: typeof ShoppingBag; color: string; connected: boolean };

const INITIAL: Integration[] = [
  { id: "shopify", name: "Shopify", desc: "Sync products, orders, and customers.", icon: ShoppingBag, color: "text-green-600 bg-green-500/10", connected: true },
  { id: "klaviyo", name: "Klaviyo", desc: "Push generated copy into email flows.", icon: Mail, color: "text-purple-600 bg-purple-500/10", connected: true },
  { id: "ga4", name: "Google Analytics", desc: "Track campaign performance & conversions.", icon: BarChart3, color: "text-orange-600 bg-orange-500/10", connected: false },
  { id: "slack", name: "Slack", desc: "Get notified when content is generated.", icon: Slack, color: "text-pink-600 bg-pink-500/10", connected: false },
  { id: "twilio", name: "Twilio SMS", desc: "Send SMS campaigns to your audience.", icon: MessageSquare, color: "text-red-600 bg-red-500/10", connected: false },
  { id: "hubspot", name: "HubSpot CRM", desc: "Two-way sync of contacts and segments.", icon: Database, color: "text-blue-600 bg-blue-500/10", connected: false },
];

function IntegrationsPage() {
  const [items, setItems] = useState(INITIAL);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      const connected = !it.connected;
      toast.success(`${it.name} ${connected ? "connected" : "disconnected"}`);
      return { ...it, connected };
    }));

  const connectedCount = items.filter((i) => i.connected).length;

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">{connectedCount} of {items.length} connected. Wire MarketGen into your stack.</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo connections</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
            <div className="flex items-start gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${it.color}`}><it.icon className="h-5 w-5" /></div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{it.name}</span>
                  {it.connected && <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-600"><Check className="h-2.5 w-2.5" /> Connected</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(it.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${it.connected ? "border border-border bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              {it.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
