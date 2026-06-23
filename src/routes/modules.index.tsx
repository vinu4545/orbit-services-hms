import { createFileRoute, Link } from "@tanstack/react-router";
import { MODULES } from "@/components/SiteLayout";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/modules/")({
  head: () => ({
    meta: [
      { title: "Modules — Orbit HMS" },
      { name: "description", content: "Explore every Orbit HMS module: patient registration, OPD/IPD, scheduling, billing, EMR, staff, wards and insurance." },
      { property: "og:title", content: "Orbit HMS Modules" },
      { property: "og:description", content: "All Orbit HMS modules in one place." },
    ],
  }),
  component: ModulesIndex,
});

function ModulesIndex() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-sm font-semibold text-primary uppercase tracking-wider">Modules</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold max-w-3xl">Open any module — they all feel like <span className="text-gradient">real software.</span></h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Click into a module to try it. Each page is an interactive workspace with live forms, tables, reports and downloads.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.slug} to="/modules/$slug" params={{ slug: m.slug }} className="group rounded-2xl border bg-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center group-hover:rotate-6 transition">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-bold">{m.title}</div>
              <div className="mt-2 text-sm text-muted-foreground">Try the live demo — add records, generate reports, download invoices.</div>
              <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary gap-1 group-hover:gap-2 transition-all">Open module <ArrowRight className="h-4 w-4" /></div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
