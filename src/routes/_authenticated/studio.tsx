import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Wand2, Loader2 } from "lucide-react";
import { generateContent } from "@/lib/marketgen.functions";

export const Route = createFileRoute("/_authenticated/studio")({ component: Studio });

const TYPES = [
  { id: "social_post", label: "Social post" },
  { id: "ad_copy", label: "Ad copy" },
  { id: "seo_blog", label: "SEO blog" },
  { id: "email", label: "Email campaign" },
  { id: "product_description", label: "Product description" },
  { id: "hashtags", label: "Hashtags" },
  { id: "rewrite", label: "Rewrite / improve" },
] as const;

const LANGS = ["English", "Hindi", "Punjabi", "Urdu", "French", "German", "Spanish", "Arabic", "Chinese"];

type Type = (typeof TYPES)[number]["id"];

const FIELDS: Record<Type, { name: string; label: string; type?: "textarea" | "select"; options?: string[]; placeholder?: string }[]> = {
  social_post: [
    { name: "businessName", label: "Business name", placeholder: "Acme Co." },
    { name: "industry", label: "Industry", placeholder: "SaaS" },
    { name: "platform", label: "Platform", type: "select", options: ["Instagram", "LinkedIn", "Facebook", "Twitter/X", "Threads"] },
    { name: "audience", label: "Target audience", placeholder: "Founders & marketers" },
    { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Witty", "Inspirational", "Bold"] },
    { name: "topic", label: "Topic", type: "textarea", placeholder: "Launching our v2 with AI scoring" },
  ],
  ad_copy: [
    { name: "platform", label: "Platform", type: "select", options: ["Facebook", "Google", "Instagram", "LinkedIn"] },
    { name: "product", label: "Product / offer", placeholder: "AI marketing assistant" },
    { name: "audience", label: "Audience", placeholder: "DTC brands" },
    { name: "benefit", label: "Key benefit", placeholder: "Cut copywriting time by 80%" },
    { name: "tone", label: "Tone", type: "select", options: ["Persuasive", "Urgent", "Friendly", "Bold"] },
  ],
  seo_blog: [
    { name: "topic", label: "Topic", placeholder: "Best AI marketing tools 2026" },
    { name: "keyword", label: "Target keyword", placeholder: "ai marketing tools" },
    { name: "audience", label: "Audience", placeholder: "Small business owners" },
    { name: "wordCount", label: "Word count", placeholder: "800" },
  ],
  email: [
    { name: "brand", label: "Brand", placeholder: "Acme" },
    { name: "emailType", label: "Type", type: "select", options: ["Welcome", "Promotional", "Abandoned cart", "Product launch", "Newsletter"] },
    { name: "goal", label: "Goal", type: "textarea", placeholder: "Drive sign-ups for our webinar" },
    { name: "audience", label: "Audience", placeholder: "Existing subscribers" },
  ],
  product_description: [
    { name: "name", label: "Product name", placeholder: "Aurora desk lamp" },
    { name: "features", label: "Features", type: "textarea", placeholder: "Warm dimmable LED, USB-C, oak base" },
    { name: "audience", label: "Audience", placeholder: "Remote workers" },
  ],
  hashtags: [
    { name: "platform", label: "Platform", type: "select", options: ["Instagram", "TikTok", "LinkedIn", "Twitter/X"] },
    { name: "topic", label: "Topic", placeholder: "Sustainable fashion launch" },
    { name: "niche", label: "Niche", placeholder: "Eco apparel" },
  ],
  rewrite: [
    { name: "text", label: "Text to rewrite", type: "textarea", placeholder: "Paste content here" },
    { name: "tone", label: "Target tone", type: "select", options: ["Professional", "Casual", "Witty", "Bold", "Humanized"] },
    { name: "lengthAction", label: "Length", type: "select", options: ["keep", "shorten", "expand"] },
  ],
};

function Studio() {
  const qc = useQueryClient();
  const generate = useServerFn(generateContent);
  const [type, setType] = useState<Type>("social_post");
  const [language, setLanguage] = useState("English");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ content: string; scores: { seo: number; marketing: number; readability: number; wordCount: number } } | null>(null);

  const m = useMutation({
    mutationFn: async () => generate({ data: { contentType: type, language, inputs } }),
    onSuccess: (r) => { setResult({ content: r.content, scores: r.scores }); qc.invalidateQueries(); toast.success("Generated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleGenerate = () => {
    const fields = FIELDS[type];
    const missing = fields.filter((f) => !inputs[f.name] || inputs[f.name].trim() === "");
    if (missing.length > 0) {
      toast.error(`Please fill out: ${missing.map(f => f.label).join(", ")}`);
      return;
    }
    m.mutate();
  };

  const setT = (t: Type) => { setType(t); setInputs({}); setResult(null); };

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Content Studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select a module and configure your prompt to generate high-converting copy.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Left Column: Tools & Configuration */}
        <div className="space-y-6">
          {/* Tool Selection (Vertical Tabs for Premium Look) */}
          <div className="rounded-xl border border-border bg-surface p-2 shadow-sm">
            <div className="mb-3 px-3 pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Generation Modules</div>
            <div className="flex flex-col space-y-1">
              {TYPES.map((t) => {
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setT(t.id)}
                    className={`relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    }`}
                  >
                    {t.label}
                    {active && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor Pane */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-primary/5 blur-3xl" />
            
            <div className="relative space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</label>
                <div className="relative">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full appearance-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10">
                    {LANGS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">▼</div>
                </div>
              </div>
              
              {FIELDS[type].map((f) => (
                <div key={f.name}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={4} placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full resize-y rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10" />
                  ) : f.type === "select" ? (
                    <div className="relative">
                      <select value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full appearance-none rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10">
                        <option value="">Choose…</option>
                        {f.options!.map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">▼</div>
                    </div>
                  ) : (
                    <input placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10" />
                  )}
                </div>
              ))}

              <div className="pt-4">
                <button onClick={handleGenerate} disabled={m.isPending} className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25 disabled:pointer-events-none disabled:opacity-70">
                  {m.isPending ? (
                    <>
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          {m.isPending ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground animate-pulse">
               <Loader2 className="h-10 w-10 animate-spin text-primary/50 mb-6" />
               <p className="text-sm font-medium">Analyzing parameters...</p>
               <p className="text-xs mt-2 text-muted-foreground/60 max-w-xs">Our AI is crafting high-converting copy based on your specific tone and audience requirements.</p>
            </div>
          ) : result ? (
            <>
              {/* Output Toolbar */}
              <div className="flex items-center justify-between border-b border-border bg-surface-2/50 px-5 py-4">
                <div className="flex gap-6">
                  {[{ k: "SEO Score", v: result.scores.seo }, { k: "Marketing Score", v: result.scores.marketing }].map((s) => (
                    <div key={s.k} className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.k}</span>
                      <span className={`mt-0.5 text-lg font-display font-bold ${s.v > 80 ? 'text-green-600' : s.v > 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {s.v}<span className="text-xs text-muted-foreground/50 ml-0.5">/100</span>
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(result.content); toast.success("Copied to clipboard"); }} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-surface-2 hover:shadow-sm">
                  <Copy className="h-3.5 w-3.5" /> Copy Text
                </button>
              </div>
              
              {/* Rendered Markdown Area */}
              <div className="flex-1 overflow-auto p-6 sm:p-8 bg-surface">
                <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground/90">{result.content}</pre>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-transparent">
                <Wand2 className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Awaiting Instructions</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">Select a module on the left, configure your parameters, and generate AI marketing copy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
