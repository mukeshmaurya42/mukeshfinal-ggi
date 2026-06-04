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

  const setT = (t: Type) => { setType(t); setInputs({}); setResult(null); };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Generator Studio</h1>
      <p className="text-muted-foreground">Pick a content type and craft your prompt.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t.id} onClick={() => setT(t.id)} className={`rounded-full px-4 py-1.5 text-sm transition ${type === t.id ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass hover:bg-surface-2"}`}>{t.label}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass space-y-4 rounded-2xl p-6">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-primary">
              {LANGS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          {FIELDS[type].map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm text-muted-foreground">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea rows={3} placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              ) : f.type === "select" ? (
                <select value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-primary">
                  <option value="">Choose…</option>
                  {f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input placeholder={f.placeholder} value={inputs[f.name] || ""} onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-primary" />
              )}
            </div>
          ))}
          <button onClick={() => m.mutate()} disabled={m.isPending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-3 font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
            {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {m.isPending ? "Generating…" : "Generate"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          {result ? (
            <>
              <div className="mb-4 grid grid-cols-3 gap-2">
                {[{ k: "SEO", v: result.scores.seo }, { k: "Marketing", v: result.scores.marketing }, { k: "Readability", v: result.scores.readability }].map((s) => (
                  <div key={s.k} className="rounded-xl bg-surface-2 p-3 text-center">
                    <div className="font-display text-2xl font-bold text-gradient">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.k}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(result.content); toast.success("Copied"); }} className="mb-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-surface-2"><Copy className="h-3.5 w-3.5" /> Copy</button>
              <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg bg-background/60 p-4 text-sm">{result.content}</pre>
            </>
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center text-center text-muted-foreground">
              <div><Wand2 className="mx-auto mb-3 h-8 w-8 text-primary-glow" />Your generated content will appear here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
