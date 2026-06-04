import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, User, Bell, Shield, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({ productEmails: true, weeklyReport: true, marketingTips: false });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setEmail(u.email ?? "");
      const meta = u.user_metadata as { full_name?: string; name?: string } | undefined;
      setName(meta?.full_name || meta?.name || u.email?.split("@")[0] || "");
    });
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Real update: persists display name to the Supabase auth user metadata.
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast.success("Preference saved");
  };

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      {/* Profile — real */}
      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"><User className="h-4 w-4 text-primary" /> Profile</h2>
        <form onSubmit={saveProfile} className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary" placeholder="Your name" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input value={email} readOnly className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground outline-none" />
            <p className="mt-1 text-xs text-muted-foreground">Your account email can't be changed here.</p>
          </div>
          <button disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
          </button>
        </form>
      </section>

      {/* Notifications — mock */}
      <section className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"><Bell className="h-4 w-4 text-primary" /> Notifications
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3 w-3" /> Demo</span>
        </h2>
        <div className="mt-4 divide-y divide-border">
          {([
            { key: "productEmails", label: "Product updates", desc: "News about new features and modules." },
            { key: "weeklyReport", label: "Weekly summary", desc: "A digest of your content activity." },
            { key: "marketingTips", label: "Marketing tips", desc: "Occasional copywriting tips from our team." },
          ] as const).map((row) => (
            <div key={row.key} className="flex items-center justify-between py-4">
              <div>
                <div className="text-sm font-medium text-foreground">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.desc}</div>
              </div>
              <button
                onClick={() => togglePref(row.key)}
                role="switch"
                aria-checked={prefs[row.key]}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prefs[row.key] ? "bg-primary" : "bg-surface-2 border border-border"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[row.key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Security — mock */}
      <section className="mt-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"><Shield className="h-4 w-4 text-primary" /> Security</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => toast.success("Password reset link sent to your email")} className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-2">Change password</button>
          <button onClick={() => toast("Two-factor auth is coming soon")} className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-2">Enable 2FA</button>
        </div>
      </section>
    </div>
  );
}
