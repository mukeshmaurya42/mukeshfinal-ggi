import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name }, emailRedirectTo: window.location.origin + "/dashboard" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.session) { toast.success("Account created"); navigate({ to: "/dashboard", replace: true }); }
    else toast.success("Check your email to confirm your account");
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/dashboard" } });
    if (error) toast.error("Google sign-in failed: " + error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
          MarketGen <span className="text-gradient">AI</span>
        </Link>
        <div className="glass rounded-2xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free to start. No credit card.</p>
          <button onClick={google} className="mt-6 w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-medium hover:bg-surface-2">Continue with Google</button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" /></div>
          <form onSubmit={submit} className="space-y-3">
            <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-primary" />
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-primary" />
            <input type="password" required minLength={6} placeholder="Password (6+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-primary" />
            <button disabled={loading} className="w-full rounded-lg bg-gradient-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-glow disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">Have an account? <Link to="/login" className="text-primary-glow hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
