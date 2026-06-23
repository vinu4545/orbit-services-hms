import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Building2, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Request a Demo · Orbit HMS" },
      { name: "description", content: "Talk to the Orbit Services team. Book a personalized Orbit HMS demo tailored to your hospital." },
      { property: "og:title", content: "Contact Orbit HMS" },
      { property: "og:description", content: "Request a live demo of Orbit HMS." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  organization: z.string().trim().min(2, "Hospital / clinic name").max(120),
  phone: z.string().trim().min(6, "Phone is too short").max(30),
  message: z.string().trim().min(10, "Please share more detail").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      toast.error("Please check the form");
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Demo request received — we'll be in touch within 24h.");
      setForm({ name: "", email: "", organization: "", phone: "", message: "" });
    }, 1100);
  };

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-soft" />
      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Contact</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold">Let's design your <span className="text-gradient">deployment.</span></h1>
          <p className="mt-4 text-muted-foreground max-w-md">Tell us about your hospital. A solutions engineer will walk you through a personalized Orbit HMS demo.</p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> hello@orbitservices.io</li>
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +1 (415) 555-0117</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> 220 Atlantic Ave, Boston MA</li>
            <li className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /> Orbit Services Inc.</li>
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-3xl border bg-card p-7 shadow-elegant space-y-4">
          {([
            ["name", "Your name", "Dr. Jane Doe"],
            ["email", "Work email", "jane@hospital.org"],
            ["organization", "Hospital / Clinic", "City General Hospital"],
            ["phone", "Phone", "+1 555 0117"],
          ] as const).map(([key, label, ph]) => (
            <div key={key}>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={ph}
                className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              {errors[key] && <div className="text-xs text-destructive mt-1">{errors[key]}</div>}
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How can we help?</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              placeholder="Tell us about your current systems and challenges…"
              className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            {errors.message && <div className="text-xs text-destructive mt-1">{errors.message}</div>}
          </div>
          <button disabled={loading} className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60 hover:opacity-90 transition">
            {loading ? "Sending…" : (<>Request Demo <Send className="h-4 w-4" /></>)}
          </button>
        </form>
      </div>
    </section>
  );
}
