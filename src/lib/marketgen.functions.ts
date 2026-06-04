import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GenerateSchema = z.object({
  contentType: z.enum([
    "social_post",
    "ad_copy",
    "seo_blog",
    "email",
    "product_description",
    "hashtags",
    "rewrite",
  ]),
  language: z.string().min(1).max(40).default("English"),
  inputs: z.record(z.string(), z.any()),
});

function buildPrompt(contentType: string, language: string, inputs: Record<string, any>): { system: string; user: string } {
  const sys = `You are MarketGen AI, an elite digital marketing copywriter. Always respond in ${language}. Write copy that converts: punchy, specific, emotionally resonant. Use proven copywriting frameworks (AIDA, PAS). No fluff, no clichés like "unleash" or "dive into".`;

  switch (contentType) {
    case "social_post":
      return {
        system: sys,
        user: `Write a ${inputs.platform || "Instagram"} post for "${inputs.businessName}" (industry: ${inputs.industry || "general"}).
Target audience: ${inputs.audience || "general consumers"}
Tone: ${inputs.tone || "engaging"}
Topic: ${inputs.topic || "general brand awareness"}

Return in this exact format:
POST:
<the post body, optimized for ${inputs.platform}>

CTA:
<one strong call to action>

HASHTAGS:
<8-12 relevant hashtags space-separated>

ENGAGEMENT TIP:
<one short suggestion to boost engagement>`,
      };
    case "ad_copy":
      return {
        system: sys,
        user: `Write ${inputs.platform || "Facebook"} ad copy for: ${inputs.product}
Audience: ${inputs.audience}
Key benefit: ${inputs.benefit}
Tone: ${inputs.tone || "persuasive"}

Format:
HEADLINE: <30 chars max>
PRIMARY TEXT: <125 chars max, hooks attention>
DESCRIPTION: <one sentence value prop>
CTA: <2-3 word action>`,
      };
    case "seo_blog":
      return {
        system: sys,
        user: `Write a complete SEO blog article.
Topic: ${inputs.topic}
Target keyword: ${inputs.keyword}
Audience: ${inputs.audience || "general"}
Target word count: ${inputs.wordCount || 800}

Format with markdown:
# SEO Title (60 chars, includes keyword)
**Meta description:** <155 chars, includes keyword>

## Introduction
<hook + thesis>

## <H2 Section 1>
<content>

## <H2 Section 2>
<content>

## <H2 Section 3>
<content>

## FAQ
**Q:** ...
**A:** ...

## Conclusion
<summary + CTA>

Use the target keyword naturally 4-6 times. Include 2-3 semantic variations.`,
      };
    case "email":
      return {
        system: sys,
        user: `Write a ${inputs.emailType || "promotional"} marketing email.
Brand: ${inputs.brand}
Goal: ${inputs.goal}
Audience: ${inputs.audience || "subscribers"}

Format:
SUBJECT LINE A: <under 50 chars>
SUBJECT LINE B: <alternate>
PREVIEW TEXT: <under 90 chars>

BODY:
<the email, 150-250 words, conversational, one strong CTA>`,
      };
    case "product_description":
      return {
        system: sys,
        user: `Write a product description.
Product: ${inputs.name}
Features: ${inputs.features}
Audience: ${inputs.audience || "general"}

Format:
HEADLINE: <benefit-driven, 8 words max>
DESCRIPTION: <2-3 paragraphs, sensory, story-driven>
KEY BENEFITS:
- ...
- ...
- ...
- ...
WHO IT'S FOR: <one sentence>`,
      };
    case "hashtags":
      return {
        system: sys,
        user: `Generate hashtags for ${inputs.platform || "Instagram"}.
Topic: ${inputs.topic}
Niche: ${inputs.niche || "general"}

Format:
TRENDING (5):
<space separated>

NICHE (10):
<space separated>

BRANDED IDEAS (3):
<space separated>`,
      };
    case "rewrite":
      return {
        system: sys,
        user: `Rewrite the text below. Mode: ${inputs.mode || "improve"}.
Target tone: ${inputs.tone || "professional"}.
${inputs.lengthAction === "shorten" ? "Make it 40% shorter." : inputs.lengthAction === "expand" ? "Expand by 50% with more detail." : ""}

TEXT:
${inputs.text}

Return only the rewritten version.`,
      };
    default:
      return { system: sys, user: JSON.stringify(inputs) };
  }
}

function scoreContent(text: string, contentType: string, keyword?: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen = sentences.length ? wordCount / sentences.length : 0;

  // Readability (Flesch-ish, simplified)
  let readability = 100 - Math.max(0, avgSentenceLen - 14) * 3;
  readability = Math.max(40, Math.min(100, Math.round(readability)));

  // SEO
  let seo = 60;
  const lower = text.toLowerCase();
  if (keyword) {
    const occ = (lower.match(new RegExp(keyword.toLowerCase(), "g")) || []).length;
    const density = occ / Math.max(wordCount, 1);
    if (density > 0.005 && density < 0.03) seo += 20;
    else if (occ > 0) seo += 10;
  }
  if (/^#\s|^##\s/m.test(text)) seo += 10;
  if (/meta description/i.test(text)) seo += 10;
  seo = Math.min(100, seo);

  // Marketing
  const ctaWords = /\b(get|try|start|claim|join|shop|buy|download|book|discover|unlock|grab|save)\b/gi;
  const emotionWords = /\b(amazing|exclusive|free|new|proven|guaranteed|secret|powerful|effortless|premium|love|trust)\b/gi;
  const ctaHits = (text.match(ctaWords) || []).length;
  const emoHits = (text.match(emotionWords) || []).length;
  let marketing = 50 + Math.min(25, ctaHits * 5) + Math.min(25, emoHits * 3);
  marketing = Math.min(100, marketing);

  return { seo, marketing, readability, wordCount };
}

export const generateContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GenerateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    if (!openaiKey && !geminiKey && !groqKey) {
      throw new Error(
        "AI is not configured. Set GROQ_API_KEY, OPENAI_API_KEY, OR GEMINI_API_KEY in your .env file, then restart the dev server."
      );
    }

    const { system, user } = buildPrompt(data.contentType, data.language, data.inputs);

    let text = "";

    if (groqKey) {
      // Direct Groq API
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("Groq error", res.status, t);
        throw new Error(`Groq API error: ${res.status}`);
      }
      const payload = await res.json();
      text = payload.choices?.[0]?.message?.content ?? "";
    } else if (openaiKey) {
      // Direct OpenAI API (ChatGPT)
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("OpenAI error", res.status, t);
        throw new Error(`OpenAI API error: ${res.status}`);
      }
      const payload = await res.json();
      text = payload.choices?.[0]?.message?.content ?? "";
    } else if (geminiKey) {
      // Direct Google Gemini API (free key from Google AI Studio) — works locally
      const model = "gemini-2.5-flash"; // higher free-tier limits than 2.0-flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("Gemini error", res.status, t);
        throw new Error(`Gemini API error: ${res.status}`);
      }
      const payload = await res.json();
      text = payload.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
    }

    const scores = scoreContent(text, data.contentType, data.inputs.keyword);

    // Persist to history
    const title = data.inputs.topic || data.inputs.product || data.inputs.name || data.inputs.brand || data.inputs.businessName || data.contentType;
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("content_history")
      .insert({
        user_id: userId,
        content_type: data.contentType,
        title: String(title).slice(0, 200),
        prompt_input: data.inputs,
        generated_content: text,
        language: data.language,
        seo_score: scores.seo,
        marketing_score: scores.marketing,
        readability_score: scores.readability,
        word_count: scores.wordCount,
      })
      .select()
      .single();
    if (error) console.error("history insert", error);

    return { content: text, scores, id: row?.id ?? null };
  });

export const listHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("content_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const deleteHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("content_history").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("content_history")
      .select("seo_score,marketing_score,readability_score,word_count,content_type,created_at");
    if (error) throw new Error(error.message);
    const items = data ?? [];
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const avg = (k: "seo_score" | "marketing_score" | "readability_score") => {
      const v = items.map((i) => i[k] || 0);
      return v.length ? Math.round(sum(v) / v.length) : 0;
    };
    return {
      total: items.length,
      totalWords: sum(items.map((i) => i.word_count || 0)),
      avgSeo: avg("seo_score"),
      avgMarketing: avg("marketing_score"),
      avgReadability: avg("readability_score"),
      byType: items.reduce<Record<string, number>>((acc, i) => {
        acc[i.content_type] = (acc[i.content_type] || 0) + 1;
        return acc;
      }, {}),
      recent: items.slice(0, 7).map((i) => ({ date: i.created_at, seo: i.seo_score || 0 })),
    };
  });
