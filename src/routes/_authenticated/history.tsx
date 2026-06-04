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
    <div>
      <h1 className="font-display text-3xl font-bold">History</h1>
      <p className="text-muted-foreground">Every piece of content you've generated.</p>

      <input placeholder="Search by title or type…" value={search} onChange={(e) => setSearch(e.target.value)} className="mt-6 w-full max-w-md rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-primary" />

      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="glass rounded-2xl">
            <div className="flex items-center justify-between p-4">
              <button onClick={() => setOpen(open === i.id ? null : i.id)} className="min-w-0 flex-1 text-left">
                <div className="truncate font-medium">{i.title || i.content_type}</div>
                <div className="text-xs text-muted-foreground">{i.content_type} · {i.language} · {new Date(i.created_at).toLocaleString()}</div>
              </button>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface-2 px-2 py-1 text-xs">SEO {i.seo_score}</span>
                <span className="rounded-full bg-surface-2 px-2 py-1 text-xs">MKT {i.marketing_score}</span>
                <button onClick={() => { navigator.clipboard.writeText(i.generated_content); toast.success("Copied"); }} className="rounded-md p-2 hover:bg-surface-2"><Copy className="h-4 w-4" /></button>
                <button onClick={() => download(i.generated_content, i.title || i.content_type)} className="rounded-md p-2 hover:bg-surface-2"><Download className="h-4 w-4" /></button>
                <button onClick={() => del.mutate(i.id)} className="rounded-md p-2 text-destructive hover:bg-surface-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {open === i.id && (
              <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap border-t border-border bg-background/40 p-4 text-sm">{i.generated_content}</pre>
            )}
          </div>
        ))}
        {!q.isLoading && items.length === 0 && <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No content yet.</div>}
      </div>
    </div>
  );
}
