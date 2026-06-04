import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, ChevronDown, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/help")({
  component: HelpPage,
});

const FAQS = [
  { q: "How does content generation work?", a: "Open the Content Studio, pick a module (social post, ad copy, SEO blog, email, and more), fill in the brief, and click Generate. MarketGen uses Google's Gemini model to write the copy and scores it for SEO, marketing, and readability." },
  { q: "What do the SEO and Marketing scores mean?", a: "Each generation is scored 0–100. SEO looks at keyword usage, headings, and meta info; Marketing looks at calls-to-action and persuasive language; Readability estimates how easy the copy is to read. They're heuristics to help you compare drafts at a glance." },
  { q: "Which languages are supported?", a: "You can generate in English, Hindi, Punjabi, Urdu, French, German, Spanish, Arabic, and Chinese. Pick the language at the top of the Studio before generating." },
  { q: "Where is my generated content saved?", a: "Everything you generate is saved automatically to History, where you can search, copy, download as a text file, or delete it." },
  { q: "Can I export my content?", a: "Yes — from History, use the download button on any item to save it as a .txt file, or the copy button to put it on your clipboard." },
  { q: "Is my data private?", a: "Your content is tied to your account and only visible to you. Authentication is handled by Supabase." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><HelpCircle className="h-7 w-7 text-primary" /></div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Help Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">Answers to the most common questions about MarketGen.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="font-semibold text-foreground">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="border-t border-border bg-surface-2/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href="#" className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
          <BookOpen className="h-5 w-5 text-primary" />
          <div><div className="font-semibold text-foreground">Documentation</div><div className="text-xs text-muted-foreground">Guides &amp; tutorials</div></div>
        </a>
        <Link to="/support" className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div><div className="font-semibold text-foreground">Contact support</div><div className="text-xs text-muted-foreground">Still stuck? Reach our team</div></div>
        </Link>
      </div>
    </div>
  );
}
