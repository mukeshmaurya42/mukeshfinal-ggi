import { createFileRoute, Link, Outlet, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, LayoutDashboard, Wand2, History, LogOut, Megaphone, Workflow, Users, LineChart, FileText, Blocks, CreditCard, Settings, HelpCircle, Bell, Search } from "lucide-react";
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
  const [out, setOut] = useState(false);
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

  const handleSignOut = async () => {
    setOut(true);
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  if (!ready) return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground"><div className="flex flex-col items-center gap-4"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div><p>Loading your workspace...</p></div></div>;

  const NAV = [
    { section: "General", items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/campaigns", icon: Megaphone, label: "Campaign" },
      { to: "/workflow", icon: Workflow, label: "Workflow" },
      { to: "/studio", icon: Wand2, label: "Content Studio" },
      { to: "/audience", icon: Users, label: "Audience" },
    ]},
    { section: "Analytics", items: [
      { to: "/insights", icon: LineChart, label: "Insights" },
      { to: "/reports", icon: FileText, label: "Reports" },
    ]},
    { section: "Setting", items: [
      { to: "/integrations", icon: Blocks, label: "Integrations" },
      { to: "/billing", icon: CreditCard, label: "Billings" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ]},
    { section: "Support", items: [
      { to: "/help", icon: HelpCircle, label: "Help" },
      { to: "/support", icon: HelpCircle, label: "Support" }, // Using HelpCircle for both since it fits
    ]}
  ];

  return (
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
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
          <nav className="space-y-6">
            {NAV.map((group) => (
              <div key={group.section}>
                <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">{group.section}</div>
                <div className="space-y-1">
                  {group.items.map((n) => (
                    <Link key={n.to} to={n.to} className="[&.active]:bg-primary/10 [&.active]:text-primary [&.active]:font-semibold [&.active]:border-r-4 [&.active]:border-primary flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
                      <n.icon className="h-4 w-4" /> {n.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <button onClick={handleSignOut} disabled={out} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-50">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-8 lg:flex">
          <div className="flex w-96 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 shadow-sm focus-within:border-primary/50 focus-within:bg-surface">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <div className="flex h-5 w-5 items-center justify-center rounded border border-border bg-surface text-[10px] font-medium text-muted-foreground">⌘K</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John" alt="Avatar" className="h-8 w-8 rounded-full border border-border bg-surface-2" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <span className="grid h-7 w-7 place-items-center rounded bg-primary"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></span>
            MarketGen
          </div>
          <button onClick={handleSignOut} className="rounded p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"><LogOut className="h-5 w-5" /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/80 px-4 pb-safe backdrop-blur-lg lg:hidden">
          <div className="flex h-16 items-center justify-around">
            {NAV[0].items.slice(0, 4).map((n) => (
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
