import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import logo from "@/assets/logo.png";
import {
  Users, BedDouble, Calendar, Receipt, FileHeart, Stethoscope, Hotel, ShieldCheck,
  ChevronDown, Menu, X, Phone, Mail, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MODULES = [
  { slug: "patient-registration", title: "Patient Registration & Management", icon: Users },
  { slug: "opd-ipd", title: "OPD / IPD Management", icon: BedDouble },
  { slug: "appointments", title: "Appointment Scheduling", icon: Calendar },
  { slug: "billing", title: "Billing & Invoice Generation", icon: Receipt },
  { slug: "emr", title: "Electronic Medical Records (EMR)", icon: FileHeart },
  { slug: "staff", title: "Doctor & Staff Management", icon: Stethoscope },
  { slug: "wards", title: "Bed / Ward Management", icon: Hotel },
  { slug: "insurance", title: "Insurance & TPA Management", icon: ShieldCheck },
] as const;

function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/solutions", label: "Solutions" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Orbit HMS logo" className="h-10 w-10 rounded-lg object-contain bg-white p-1 ring-1 ring-border" />
          <div className="leading-tight">
            <div className="font-extrabold text-lg tracking-tight"><span className="text-gradient">Orbit</span> HMS</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">by Orbit Services</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/30",
              pathname === n.to && "text-primary"
            )}>{n.label}</Link>
          ))}

          {/* Modules dropdown */}
          <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <Link to="/modules" className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1 hover:bg-accent/30",
              pathname.startsWith("/modules") && "text-primary"
            )}>
              Modules <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </Link>
            <div className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200",
              open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
            )}>
              <div className="w-[640px] rounded-2xl border border-border bg-popover p-3 shadow-elegant grid grid-cols-2 gap-1">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Link key={m.slug} to="/modules/$slug" params={{ slug: m.slug }} className="group flex items-start gap-3 rounded-xl p-3 hover:bg-accent/20 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft group-hover:scale-110 transition-transform">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{m.title}</div>
                        <div className="text-xs text-muted-foreground">Open module →</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link to="/contact" className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/30",
            pathname === "/contact" && "text-primary"
          )}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contact" className="hidden sm:inline-flex items-center rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90 transition">
            Request Demo
          </Link>
          <button className="lg:hidden p-2" onClick={() => setMobile((v) => !v)} aria-label="Menu">
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="lg:hidden border-t bg-background px-4 py-3 space-y-1">
          {[...nav, { to: "/modules", label: "Modules" }, { to: "/contact", label: "Contact" }].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/30">{n.label}</Link>
          ))}
          <div className="pt-2 border-t mt-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-3 py-1">Modules</div>
            {MODULES.map((m) => (
              <Link key={m.slug} to="/modules/$slug" params={{ slug: m.slug }} onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/20">{m.title}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Orbit HMS" className="h-9 w-9 rounded-lg bg-white p-1 ring-1 ring-border" />
            <div className="font-bold text-lg"><span className="text-gradient">Orbit</span> HMS</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A modern hospital management platform helping clinics & hospitals run smoother every day.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/solutions" className="hover:text-primary">Solutions</Link></li>
            <li><Link to="/modules" className="hover:text-primary">All Modules</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Modules</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {MODULES.slice(0, 4).map((m) => (
              <li key={m.slug}><Link to="/modules/$slug" params={{ slug: m.slug }} className="hover:text-primary">{m.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +1 (415) 555-0117</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@orbitservices.io</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Boston, MA</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Orbit HMS. All rights reserved.</div>
          <div>Developed by <span className="font-semibold text-foreground">Orbit Services</span></div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
