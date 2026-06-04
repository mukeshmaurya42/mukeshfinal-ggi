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
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select a module and configure your prompt.</p>
      </header>

      {/* Swipeable Tool Ribbon */}
      <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <div className="flex w-max gap-2">
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setT(t.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        {/* Editor Pane */}
        <div className="space-y-5 rounded-2xl border border-border bg-surface/50 p-5 shadow-sm sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50">
              {LANGS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          
          {FIELDS[type].map((f) => (
            <div key={f.name}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea rows={4} placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50" />
              ) : f.type === "select" ? (
                <select value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50">
                  <option value="">Choose…</option>
                  {f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50" />
              )}
            </div>
          ))}

          <div className="pt-2">
            <button onClick={handleGenerate} disabled={m.isPending} className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
              {m.isPending ? (
                <>
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-surface/30 shadow-sm">
          {result ? (
            <>
              {/* Output Toolbar */}
              <div className="flex items-center justify-between border-b border-border bg-surface/50 px-4 py-3">
                <div className="flex gap-4">
                  {[{ k: "SEO", v: result.scores.seo }, { k: "Marketing", v: result.scores.marketing }].map((s) => (
                    <div key={s.k} className="flex items-center gap-1.5 text-xs">
                      <span className="font-medium text-muted-foreground">{s.k}:</span>
                      <span className={`font-semibold ${s.v > 80 ? 'text-green-500' : s.v > 50 ? 'text-yellow-500' : 'text-red-500'}`}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(result.content); toast.success("Copied to clipboard"); }} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              
              {/* Rendered Markdown Area (simulated with white-space pre for now) */}
              <div className="flex-1 overflow-auto p-5 sm:p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{result.content}</pre>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <div className="mb-4 rounded-full bg-surface-2 p-4">
                <Wand2 className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">No content generated yet</p>
              <p className="mt-1 max-w-[250px] text-xs">Configure your prompt on the left and click generate to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
