import { createFileRoute } from "@tanstack/react-router";
import team from "@/assets/team.jpg";
import reception from "@/assets/reception.jpg";
import { Building2, Heart, Award, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Orbit HMS by Orbit Services" },
      { name: "description", content: "Orbit Services builds Orbit HMS — modern, secure hospital software trusted by 120+ healthcare providers." },
      { property: "og:title", content: "About Orbit Services" },
      { property: "og:description", content: "Meet the team building the modern hospital management platform." },
      { property: "og:image", content: team },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">About Orbit Services</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight">
              We build software that helps <span className="text-gradient">hospitals heal faster.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Founded by clinicians and engineers, Orbit Services has spent the last decade in operating rooms, ICUs and front-desks — building the software we wish we had.
            </p>
          </div>
          <video
            className="w-full rounded-3xl border shadow-elegant aspect-video object-cover"
            src="https://assets.mixkit.co/videos/preview/mixkit-medical-staff-talking-in-the-hospital-32519-large.mp4"
            poster={team}
            autoPlay muted loop playsInline
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Building2, k: "120+", v: "Hospitals served" },
            { icon: Heart, k: "3.4M", v: "Patient records" },
            { icon: Award, k: "ISO 27001", v: "Certified" },
            { icon: Target, k: "99.9%", v: "Uptime SLA" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border bg-card p-6 text-center hover:shadow-elegant transition">
              <s.icon className="h-6 w-6 text-primary mx-auto" />
              <div className="mt-3 text-3xl font-extrabold text-gradient">{s.k}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <img src={reception} alt="Modern hospital reception" loading="lazy" width={1200} height={800} className="rounded-3xl border shadow-elegant" />
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Our mission</h2>
            <p className="mt-4 text-muted-foreground">To remove the friction between care teams and the technology meant to support them. Every screen, button and report in Orbit HMS exists to give clinicians their time back.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Designed with 200+ practicing clinicians",
                "Deployable on cloud or on-premise",
                "Open APIs to integrate any device or lab system",
                "24/7 support team in 3 time zones",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-gradient-primary" />{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
