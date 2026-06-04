import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 py-20">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-transparent">
          <FileText className="h-10 w-10 text-primary/60" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Custom Reports</h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground">
          Export pixel-perfect PDF reports for your clients and stakeholders. Coming soon.
        </p>
      </div>
    </div>
  );
}
