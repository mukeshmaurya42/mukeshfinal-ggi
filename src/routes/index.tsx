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
    <div className="min-h-screen bg-gradient-hero">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Sparkles className="h-5 w-5 text-primary-foreground" /></span>
          MarketGen <span className="text-gradient">AI</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/signup" className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Get started</Link>
        </nav>
      </header>

      <section className="container mx-auto px-6 pt-20 pb-32 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Zap className="h-3.5 w-3.5 text-primary-glow" /> Powered by frontier AI
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.05] md:text-7xl">
          Marketing copy that <span className="text-gradient">actually converts</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Generate social posts, ads, SEO blogs and email campaigns in seconds — scored for SEO, persuasion and readability.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/signup" className="rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]">Start generating free</Link>
          <Link to="/login" className="rounded-lg border border-border bg-surface/50 px-6 py-3 font-medium backdrop-blur hover:bg-surface">Sign in</Link>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 text-left transition hover:-translate-y-1 hover:shadow-glow">
              <f.icon className="mb-4 h-6 w-6 text-primary-glow" />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Globe2 className="h-4 w-4" /> 9 languages · scoring engine · content history
        </div>
      </section>
    </div>
  );
}
