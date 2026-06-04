import { createFileRoute, Link, Outlet, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, LayoutDashboard, Wand2, History, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // Client-side guard: redirect before rendering if not authenticated
    if (typeof window !== "undefined") {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        throw redirect({
          to: "/login",
          search: { redirect: location.pathname },
        });
      }
    }
  },
  component: Layout,
});

function Layout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/login", replace: true, search: { redirect: path } });
      } else {
        setReady(true);
      }
    });
  }, [navigate, path]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-gradient-hero text-muted-foreground"><div className="flex flex-col items-center gap-4"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div><p>Loading your workspace...</p></div></div>;

  const nav = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/studio", icon: Wand2, label: "Generator Studio" },
    { to: "/history", icon: History, label: "History" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></span>
          MarketGen
        </Link>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/", replace: true }); }} className="rounded-full p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar/95 backdrop-blur md:flex">
        <div className="flex h-full flex-col p-6">
          <Link to="/dashboard" className="mb-10 flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Sparkles className="h-4 w-4 text-primary-foreground" /></span>
            MarketGen <span className="text-gradient">AI</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-2">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                  <n.icon className="h-5 w-5" />{n.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/", replace: true }); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground">
            <LogOut className="h-5 w-5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl p-4 md:p-8"><Outlet /></div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background/90 px-2 backdrop-blur-md pb-safe md:hidden">
        {nav.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to} className={`flex w-full flex-col items-center justify-center gap-1 py-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
              <n.icon className={`h-6 w-6 ${active ? "drop-shadow-[0_0_8px_var(--color-primary)]" : ""}`} />
              <span className="text-[10px] font-medium">{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
