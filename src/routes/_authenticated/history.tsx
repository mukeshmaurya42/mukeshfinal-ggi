import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2, Download } from "lucide-react";
import { listHistory, deleteHistory } from "@/lib/marketgen.functions";

export const Route = createFileRoute("/_authenticated/history")({ component: History });

function History() {
  const qc = useQueryClient();
  const listFn = useServerFn(listHistory);
  const delFn = useServerFn(deleteHistory);
  const q = useQuery({ queryKey: ["history"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries(); toast.success("Deleted"); },
  });

  const items = (q.data?.items || []).filter((i) =>
    !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.content_type.includes(search.toLowerCase())
  );

  const download = (text: string, name: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every piece of content you've generated.</p>
      </header>

      <div className="mb-6 relative max-w-md">
        <input placeholder="Search by title or type…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50" />
        <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-sm transition-colors hover:border-border/80 hover:bg-surface/80">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <button onClick={() => setOpen(open === i.id ? null : i.id)} className="flex min-w-0 flex-1 items-start gap-4 text-left">
                <div className="mt-1 hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted-foreground sm:grid">
                  <span className="text-[10px] font-bold uppercase">{i.content_type.substring(0, 2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold text-foreground">{i.title || i.content_type}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{i.content_type.replace('_', ' ')}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize">{i.language}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(i.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </button>
              
              <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                <div className="mr-2 flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">SEO</span>
                    <span className={`text-sm font-bold ${i.seo_score && i.seo_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{i.seo_score || '-'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">MKT</span>
                    <span className={`text-sm font-bold ${i.marketing_score && i.marketing_score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{i.marketing_score || '-'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button onClick={() => { navigator.clipboard.writeText(i.generated_content); toast.success("Copied"); }} className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"><Copy className="h-4 w-4" /></button>
                  <button onClick={() => download(i.generated_content, i.title || i.content_type)} className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground"><Download className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(i.id)} className="rounded-md p-2 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            
            {open === i.id && (
              <div className="border-t border-border bg-surface-2/30 p-5 sm:p-6">
                <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{i.generated_content}</pre>
              </div>
            )}
          </div>
        ))}
        {!q.isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm font-medium text-foreground">No history found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try generating some content first or adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
