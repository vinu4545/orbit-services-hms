import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, ShieldCheck, Sparkles, Clock, Users, BarChart3, Stethoscope, Zap } from "lucide-react";
import hero from "@/assets/hero-dashboard.jpg";
import team from "@/assets/team.jpg";
import { MODULES } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit HMS — Hospital Management Software by Orbit Services" },
      { name: "description", content: "Run your hospital end-to-end with Orbit HMS. EMR, OPD/IPD, billing, scheduling, ward, insurance and more in one beautiful platform." },
      { property: "og:title", content: "Orbit HMS — Modern Hospital Management" },
      { property: "og:description", content: "End-to-end hospital management with EMR, billing, OPD/IPD and more." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Home,
});

const HERO_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-doctor-walking-through-the-corridors-of-a-hospital-32525-large.mp4";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-card/60 backdrop-blur p-5 text-center">
      <div className="text-3xl font-extrabold text-gradient">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" /> New · Orbit HMS 2026 release
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              The complete <span className="text-gradient">Hospital Management</span> platform.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Orbit HMS unifies patient records, OPD/IPD, billing, scheduling, ward operations and insurance into one calm, fast workspace — built by Orbit Services for modern healthcare teams.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:-translate-y-0.5 transition">
                Request Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/modules" className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent/20 transition">
                Explore Modules
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              <Stat value="120+" label="Hospitals" />
              <Stat value="3.4M" label="Patients" />
              <Stat value="99.9%" label="Uptime" />
            </div>
          </div>
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl border bg-card shadow-elegant overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/40">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <div className="ml-3 text-xs text-muted-foreground">orbit-hms.app/dashboard</div>
              </div>
              <video
                className="w-full aspect-video object-cover"
                src={HERO_VIDEO}
                poster={hero}
                autoPlay muted loop playsInline
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft animate-float">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground"><Activity className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Today admissions</div>
                <div className="font-bold">+24 patients</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 hidden md:flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft animate-float [animation-delay:1s]">
              <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-accent-foreground"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">HIPAA ready</div>
                <div className="font-bold">Secured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">Modules</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Everything your hospital runs on.</h2>
          </div>
          <Link to="/modules" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all modules <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <Link key={m.slug} to="/modules/$slug" params={{ slug: m.slug }} className="group rounded-2xl border bg-card p-5 hover:shadow-elegant hover:-translate-y-1 transition-all">
                <div className="h-11 w-11 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4 group-hover:rotate-6 transition">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-semibold">{m.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">Interactive {i % 2 === 0 ? "workspace" : "console"} with live actions.</div>
                <div className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open <ArrowRight className="h-3 w-3" /></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <img src={team} alt="Hospital staff using Orbit HMS" loading="lazy" width={1400} height={900} className="rounded-3xl border shadow-elegant" />
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">Why Orbit HMS</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Built for clinicians. Loved by admins.</h2>
            <p className="mt-4 text-muted-foreground">A single source of truth for clinical and operational data — no more juggling spreadsheets, PDFs and legacy software.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Clock, title: "Save 6+ hrs / week", desc: "Per practitioner, by removing duplicate data entry." },
                { icon: ShieldCheck, title: "HIPAA & ISO 27001", desc: "Enterprise-grade security by default." },
                { icon: BarChart3, title: "Live analytics", desc: "From bed occupancy to TPA claim turnaround." },
                { icon: Zap, title: "Goes live in days", desc: "Migration tooling for legacy databases." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border bg-card p-4">
                  <f.icon className="h-5 w-5 text-primary" />
                  <div className="mt-2 font-semibold">{f.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-hero p-10 sm:p-14 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">See Orbit HMS in action</h3>
              <p className="mt-2 opacity-90 max-w-xl">Book a 30-minute live walkthrough tailored to your hospital's workflow.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:scale-105 transition">
              Request Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
