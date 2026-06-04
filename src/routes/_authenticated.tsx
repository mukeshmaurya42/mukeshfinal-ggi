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
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar (FlowPilot Style) */}
      <aside className="hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded bg-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></span>
            MarketGen
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">General</div>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="[&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-semibold flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
          <button onClick={handleSignOut} disabled={out} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-50">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <span className="grid h-7 w-7 place-items-center rounded bg-primary"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></span>
            MarketGen
          </div>
          <button onClick={handleSignOut} className="rounded p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"><LogOut className="h-5 w-5" /></button>
        </header>

        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/80 px-4 pb-safe backdrop-blur-lg lg:hidden">
          <div className="flex h-16 items-center justify-around">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="[&.active]:text-primary flex flex-col items-center justify-center gap-1.5 px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
                <n.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{n.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
