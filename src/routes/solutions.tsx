import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Stethoscope, Hospital, Microscope, Ambulance, GraduationCap } from "lucide-react";
import ward from "@/assets/ward.jpg";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Orbit HMS" },
      { name: "description", content: "Tailored Orbit HMS deployments for multi-specialty hospitals, clinics, diagnostic labs, emergency networks and more." },
      { property: "og:title", content: "Orbit HMS Solutions" },
      { property: "og:description", content: "Solutions tailored to every healthcare segment." },
      { property: "og:image", content: ward },
    ],
  }),
  component: Solutions,
});

const SOLUTIONS = [
  { icon: Hospital, title: "Multi-specialty Hospitals", desc: "Run hundreds of beds, OTs and OPDs from a single console." },
  { icon: Stethoscope, title: "Clinics & Polyclinics", desc: "Quick check-ins, appointments and digital prescriptions." },
  { icon: Microscope, title: "Diagnostic Labs", desc: "Sample tracking, automated reports and direct EMR sync." },
  { icon: Ambulance, title: "Emergency Networks", desc: "Ambulance dispatch, ER triage and live bed availability." },
  { icon: GraduationCap, title: "Teaching Hospitals", desc: "Resident workflows, case logs and audit-ready records." },
  { icon: Building2, title: "Hospital Chains", desc: "Multi-branch dashboards with consolidated analytics." },
];

function Solutions() {
  return (
    <>
      <section className="relative bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Solutions</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold max-w-3xl">One platform, <span className="text-gradient">configured for every kind of care.</span></h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">From a 12-bed clinic to a 1,200-bed teaching hospital — Orbit HMS adapts to your scale, workflows and compliance needs.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl border bg-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-semibold">{s.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl overflow-hidden border shadow-elegant grid lg:grid-cols-2">
          <img src={ward} alt="Modern hospital ward" loading="lazy" width={1200} height={800} className="object-cover h-full w-full" />
          <div className="p-10 bg-card flex flex-col justify-center">
            <h3 className="text-2xl font-extrabold">Built to integrate with your stack</h3>
            <p className="mt-3 text-muted-foreground">HL7, FHIR, DICOM, custom APIs — we plug into PACS, lab analyzers, payment gateways and government insurance schemes out of the box.</p>
            <Link to="/contact" className="mt-6 inline-flex w-fit rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Talk to sales</Link>
          </div>
        </div>
      </section>
    </>
  );
}
