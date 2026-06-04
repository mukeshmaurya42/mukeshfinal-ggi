import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Zap, BarChart3, Globe2, PenLine, Megaphone, Mail, Hash } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: PenLine, title: "Social posts", desc: "Instagram, LinkedIn, X, Facebook — on brand, every time." },
  { icon: Megaphone, title: "Ad copy", desc: "Facebook, Google & LinkedIn ads with proven frameworks." },
  { icon: Sparkles, title: "SEO blogs", desc: "Full articles with meta, H2s, FAQs and keyword density." },
  { icon: Mail, title: "Email campaigns", desc: "Subject lines, body, CTAs — A/B variants included." },
  { icon: Hash, title: "Hashtags", desc: "Trending + niche tags scored for reach." },
  { icon: BarChart3, title: "Content scoring", desc: "SEO, marketing & readability scores on every output." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* Floating Header Pill */}
      <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
        <header className="flex h-14 w-full max-w-4xl items-center justify-between rounded-full border border-border bg-surface/80 px-6 shadow-sm backdrop-blur-lg">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            DUNA
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">Products</a>
            <a href="#" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">Customers</a>
            <a href="#" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">Resources</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Log in</Link>
            <Link to="/signup" className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90">Sign up</Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center sm:pt-48">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
            Trusted by 10,000+ modern marketers
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-6xl font-medium tracking-tight text-foreground sm:text-8xl">
            Grow Your Marketing <br /> Presence 10X Faster
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The all-in-one platform to automate content marketing, <br className="hidden sm:block" />
            track audience analytics, and drive conversions.
          </p>
          <div className="mt-12 flex justify-center">
            <Link to="/signup" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-semibold text-background shadow-lg transition-all hover:scale-105 hover:bg-foreground/90">
              <Sparkles className="h-4 w-4" /> Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trusted by companies that dominate</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:border-border/80 hover:shadow-card">
              <div className="mb-6 inline-flex rounded-xl bg-surface-2 p-3 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
