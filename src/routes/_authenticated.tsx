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
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-sidebar/80 backdrop-blur md:block">
        <div className="flex h-full flex-col p-5">
          <Link to="/dashboard" className="mb-8 flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Sparkles className="h-4 w-4 text-primary-foreground" /></span>
            MarketGen <span className="text-gradient">AI</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                  <n.icon className="h-4 w-4" />{n.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/", replace: true }); }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="md:pl-60"><div className="mx-auto max-w-6xl px-6 py-10"><Outlet /></div></main>
    </div>
  );
}
