import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Mail, Loader2, Send, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/support")({
  component: SupportPage,
});

const SUPPORT_EMAIL = "support@marketgen.app";

function SupportPage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("General question");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Demo submission — no real ticket is created.
    setTimeout(() => {
      setSending(false);
      setSubject(""); setMessage("");
      toast.success("Message sent — we'll reply within 24 hours");
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Contact Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">Open a ticket and our team will get back to you.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
          <div><div className="font-semibold text-foreground">Email us</div><div className="text-xs text-muted-foreground">{SUPPORT_EMAIL}</div></div>
        </a>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Clock className="h-5 w-5 text-primary" /></div>
          <div><div className="font-semibold text-foreground">Avg response</div><div className="text-xs text-muted-foreground">Under 24 hours</div></div>
        </div>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"><MessageSquare className="h-4 w-4 text-primary" /> Send a message</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-primary">
              {["General question", "Billing", "Bug report", "Feature request", "Account"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
            <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" className="w-full resize-y rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <button disabled={sending} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
            {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send message</>}
          </button>
        </div>
      </form>
    </div>
  );
}
