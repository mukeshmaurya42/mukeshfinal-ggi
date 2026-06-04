import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, CreditCard, Download, Lock, Loader2, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/billing")({
  component: BillingPage,
});

type Plan = { id: string; name: string; price: number; tagline: string; features: string[]; highlight?: boolean };

const PLANS: Plan[] = [
  { id: "free", name: "Free", price: 0, tagline: "For trying things out", features: ["20 generations / mo", "3 content modules", "Standard AI model", "Community support"] },
  { id: "pro", name: "Pro", price: 29, tagline: "For growing marketers", highlight: true, features: ["Unlimited generations", "All 7 content modules", "Advanced scoring", "Priority AI queue", "Email support"] },
  { id: "team", name: "Team", price: 99, tagline: "For agencies & teams", features: ["Everything in Pro", "5 team seats", "Shared history & brand kit", "Analytics & exports", "Dedicated support"] },
];

const INVOICES = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: 29, status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: 29, status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: 29, status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: 29, status: "Paid" },
];

function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [checkout, setCheckout] = useState<Plan | null>(null);

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Billing &amp; Plans</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and payment method.</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Demo billing — no real charges are made.
        </span>
      </div>

      {/* Current subscription */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current plan</div>
          <div className="mt-1 flex items-center gap-3">
            <span className="font-display text-2xl font-bold capitalize text-foreground">{currentPlan}</span>
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">Active</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">Renews Jul 1, 2026 · ${PLANS.find((p) => p.id === currentPlan)?.price}/mo</div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-foreground">Visa ending 4242</div>
            <div className="text-xs text-muted-foreground">Expires 09/28</div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => {
          const active = p.id === currentPlan;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all ${p.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-border"} bg-surface`}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Most popular</span>}
              <div className="font-display text-lg font-bold text-foreground">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.tagline}</div>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-display text-4xl font-bold text-foreground">${p.price}</span>
                <span className="mb-1.5 text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={active}
                onClick={() => setCheckout(p)}
                className={`mt-6 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? "cursor-default border border-border bg-surface-2 text-muted-foreground"
                    : p.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-surface text-foreground hover:bg-surface-2"
                }`}
              >
                {active ? "Current plan" : p.price === 0 ? "Downgrade" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="mt-10 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="transition-colors hover:bg-surface-2/50">
                  <td className="py-3.5 font-medium text-foreground">{inv.id}</td>
                  <td className="py-3.5 text-muted-foreground">{inv.date}</td>
                  <td className="py-3.5 text-foreground">${inv.amount}.00</td>
                  <td className="py-3.5"><span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">{inv.status}</span></td>
                  <td className="py-3.5 text-right">
                    <button onClick={() => toast.success(`Receipt ${inv.id} downloaded`)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {checkout && (
        <CheckoutModal
          plan={checkout}
          onClose={() => setCheckout(null)}
          onPaid={() => {
            setCurrentPlan(checkout.id);
            setCheckout(null);
            toast.success(`You're now on the ${checkout.name} plan`);
          }}
        />
      )}
    </div>
  );
}

function CheckoutModal({ plan, onClose, onPaid }: { plan: Plan; onClose: () => void; onPaid: () => void }) {
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Mock payment processing — purely client-side, no real charge.
    setTimeout(() => onPaid(), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-card animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">Upgrade to {plan.name}</h3>
            <p className="text-sm text-muted-foreground">${plan.price}.00 billed monthly</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={pay} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Card number</label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 focus-within:border-primary">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <input required value={card} onChange={(e) => setCard(e.target.value.replace(/[^0-9 ]/g, "").slice(0, 19))} placeholder="4242 4242 4242 4242" className="flex-1 bg-transparent py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expiry</label>
              <input required value={exp} onChange={(e) => setExp(e.target.value.slice(0, 5))} placeholder="MM/YY" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">CVC</label>
              <input required value={cvc} onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))} placeholder="123" className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <button disabled={processing} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
            {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : <>Pay ${plan.price}.00</>}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" /> Demo checkout — no real payment is processed.</p>
        </form>
      </div>
    </div>
  );
}
