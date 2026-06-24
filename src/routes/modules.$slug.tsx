import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MODULES } from "@/components/SiteLayout";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, Eye, FileDown, FileText, Search, ArrowRight, Check, X,
  Calendar as CalendarIcon, Receipt, BedDouble, Stethoscope, FileHeart, ShieldCheck,
  Loader2, ChevronLeft
} from "lucide-react";
import emrImg from "@/assets/emr.jpg";
import wardImg from "@/assets/ward.jpg";
import apptImg from "@/assets/appointments.jpg";
import receptionImg from "@/assets/reception.jpg";
import teamImg from "@/assets/team.jpg";
import heroDash from "@/assets/hero-dashboard.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/modules/$slug")({
  beforeLoad: ({ params }) => {
    if (!MODULES.find((m) => m.slug === params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const mod = MODULES.find((m) => m.slug === params.slug);
    const title = mod ? `${mod.title} — Orbit HMS` : "Module — Orbit HMS";
    return {
      meta: [
        { title },
        { name: "description", content: `Interactive ${mod?.title ?? "module"} workspace in Orbit HMS — try add, edit, generate reports and downloads.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Try the ${mod?.title} module live.` },
        { property: "og:image", content: heroDash },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Module not found</h1>
      <Link to="/modules" className="mt-4 inline-block text-primary">← Back to modules</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
  component: ModulePage,
});

const VIDEO_A = "https://assets.mixkit.co/videos/preview/mixkit-doctor-with-tablet-in-a-modern-hospital-32517-large.mp4";
const VIDEO_B = "https://assets.mixkit.co/videos/preview/mixkit-medical-staff-talking-in-the-hospital-32519-large.mp4";

const IMAGE_MAP: Record<string, [string, string]> = {
  "patient-registration": [receptionImg, teamImg],
  "opd-ipd": [wardImg, teamImg],
  "appointments": [apptImg, receptionImg],
  "billing": [heroDash, receptionImg],
  "emr": [emrImg, heroDash],
  "staff": [teamImg, receptionImg],
  "wards": [wardImg, heroDash],
  "insurance": [heroDash, teamImg],
};

function downloadFakeFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ModulePage() {
  const { slug } = Route.useParams();
  const mod = MODULES.find((m) => m.slug === slug)!;
  const Icon = mod.icon;
  const [imgA, imgB] = IMAGE_MAP[slug] ?? [heroDash, teamImg];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-12 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center relative">
          <div>
            <Link to="/modules" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> All modules</Link>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium">
              <Icon className="h-3.5 w-3.5 text-primary" /> Live module
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">{mod.title}</h1>
            <p className="mt-4 text-muted-foreground max-w-xl">Real interactive workspace — add records, generate reports and download PDFs. Everything runs locally in this demo.</p>
          </div>
          <div className="rounded-3xl border bg-card shadow-elegant overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
              <div className="ml-3 text-xs text-muted-foreground">orbit-hms.app/{slug}</div>
            </div>
            <video src={VIDEO_A} poster={imgA} autoPlay muted loop playsInline className="w-full aspect-video object-cover" />
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <ModuleWorkspace slug={slug} />
      </section>

      {/* MEDIA & FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-8">
        <img src={imgA} alt={`${mod.title} preview`} loading="lazy" className="rounded-3xl border shadow-elegant object-cover w-full h-72 lg:h-96" />
        <div className="rounded-3xl border bg-card shadow-elegant overflow-hidden">
          <video src={VIDEO_B} poster={imgB} autoPlay muted loop playsInline className="w-full h-72 lg:h-96 object-cover" />
        </div>
      </section>
    </>
  );
}

// ---------------- Workspace router ----------------
function ModuleWorkspace({ slug }: { slug: string }) {
  switch (slug) {
    case "patient-registration": return <PatientModule />;
    case "opd-ipd": return <OpdIpdModule />;
    case "appointments": return <AppointmentsModule />;
    case "billing": return <BillingModule />;
    case "emr": return <EMRModule />;
    case "staff": return <StaffModule />;
    case "wards": return <WardsModule />;
    case "insurance": return <InsuranceModule />;
    default: return null;
  }
}

// ---------------- Reusable UI ----------------
function WorkspaceShell({ title, action, children, tabs, activeTab, onTab }: {
  title: string; action?: React.ReactNode; children: React.ReactNode;
  tabs?: string[]; activeTab?: string; onTab?: (t: string) => void;
}) {
  return (
    <div className="rounded-3xl border bg-card shadow-elegant overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4 bg-muted/30 flex-wrap">
        <div className="font-bold">{title}</div>
        <div className="flex items-center gap-2">{action}</div>
      </div>
      {tabs && (
        <div className="flex gap-1 border-b px-4 pt-3 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => onTab?.(t)} className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
              activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>{t}</button>
          ))}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Active: "bg-success/15 text-success",
    Pending: "bg-warning/20 text-warning-foreground",
    Completed: "bg-primary/15 text-primary",
    Admitted: "bg-accent/30 text-accent-foreground",
    Discharged: "bg-muted text-muted-foreground",
    Paid: "bg-success/15 text-success",
    Unpaid: "bg-destructive/15 text-destructive",
    Approved: "bg-success/15 text-success",
    Rejected: "bg-destructive/15 text-destructive",
    Submitted: "bg-primary/15 text-primary",
    Available: "bg-success/15 text-success",
    Occupied: "bg-destructive/15 text-destructive",
    Cleaning: "bg-warning/20 text-warning-foreground",
    Reserved: "bg-primary/15 text-primary",
    "On Duty": "bg-success/15 text-success",
    Off: "bg-muted text-muted-foreground",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", m[status] ?? "bg-muted text-muted-foreground")}>{status}</span>;
}

function PrimaryBtn({ children, onClick, loading, icon: I, variant = "primary", size = "md" }:
  { children: React.ReactNode; onClick?: () => void; loading?: boolean; icon?: any; variant?: "primary" | "ghost" | "danger"; size?: "sm" | "md" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition disabled:opacity-60";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft",
    ghost: "border bg-card hover:bg-accent/20",
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  };
  return (
    <button disabled={loading} onClick={onClick} className={cn(base, sizes[size], variants[variant])}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : I && <I className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 backdrop-blur-sm p-4 animate-fade-up">
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-elegant">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-bold">{title}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t bg-muted/30 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>}
      <input {...rest} className={cn("mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40", className)} />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

async function simulateAction(label: string, ms = 900) {
  const id = toast.loading(label);
  await new Promise((r) => setTimeout(r, ms));
  toast.dismiss(id);
  return true;
}

// ============== PATIENT REGISTRATION ==============
type Patient = { id: string; name: string; age: number; gender: string; phone: string; status: string; registered: string };
const INIT_PATIENTS: Patient[] = [
  { id: "P-1042", name: "Aarav Mehta", age: 34, gender: "Male", phone: "+91 98000 12345", status: "Active", registered: "2026-06-18" },
  { id: "P-1043", name: "Sara Johnson", age: 29, gender: "Female", phone: "+1 415 555 0181", status: "Pending", registered: "2026-06-19" },
  { id: "P-1044", name: "Ken Watanabe", age: 58, gender: "Male", phone: "+81 90 1234 5678", status: "Active", registered: "2026-06-20" },
  { id: "P-1045", name: "Lila Schmidt", age: 41, gender: "Female", phone: "+49 30 123456", status: "Completed", registered: "2026-06-21" },
];

function PatientModule() {
  const [patients, setPatients] = useState<Patient[]>(INIT_PATIENTS);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewing, setViewing] = useState<Patient | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", phone: "", address: "", blood: "O+", registered: new Date().toISOString().slice(0,10), file: "" });
  const [sortKey, setSortKey] = useState<"name" | "age" | "registered">("registered");

  const filtered = useMemo(() => {
    let r = patients.filter((p) => (p.name + p.id + p.phone).toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) => (a[sortKey] > b[sortKey] ? -1 : 1));
    return r;
  }, [patients, q, sortKey]);

  const submitAdd = () => {
    if (!form.name || !form.age) { toast.error("Name and age are required"); return; }
    const id = `P-${1046 + patients.length}`;
    const p: Patient = { id, name: form.name, age: Number(form.age), gender: form.gender, phone: form.phone || "—", status: "Active", registered: form.registered };
    setPatients((x) => [p, ...x]);
    setAddOpen(false);
    setForm({ name: "", age: "", gender: "Male", phone: "", address: "", blood: "O+", registered: new Date().toISOString().slice(0,10), file: "" });
    toast.success(`Patient ${id} registered${form.file ? ` · uploaded ${form.file}` : ""}`);
  };

  const remove = (id: string) => { setPatients((x) => x.filter((p) => p.id !== id)); toast.success("Patient deleted"); };

  const saveEdit = () => {
    if (!editing) return;
    setPatients((x) => x.map((p) => p.id === editing.id ? editing : p));
    setEditing(null);
    toast.success("Patient updated");
  };

  const generatePdf = async (p: Patient) => {
    await simulateAction("Generating patient report…");
    downloadFakeFile(`${p.id}-report.pdf`, `Orbit HMS — Patient Report\n\nID: ${p.id}\nName: ${p.name}\nAge: ${p.age}\nPhone: ${p.phone}`);
    toast.success("Report downloaded");
  };

  return (
    <WorkspaceShell
      title="Patient Registry"
      action={
        <>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients…" className="pl-8 pr-3 py-2 text-sm rounded-lg border bg-background w-56 outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <Select value={sortKey} onChange={(v) => setSortKey(v as any)} options={["registered", "name", "age"]} />
          <PrimaryBtn icon={Plus} onClick={() => setAddOpen(true)}>Add Patient</PrimaryBtn>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
              <th className="py-3 pr-3">ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Status</th><th>Registered</th><th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-accent/10 cursor-pointer" onClick={() => setViewing(p)}>
                <td className="py-3 pr-3 font-mono text-xs">{p.id}</td>
                <td className="font-semibold">{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td className="text-muted-foreground">{p.phone}</td>
                <td><Badge status={p.status} /></td>
                <td className="text-muted-foreground">{p.registered}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex gap-1">
                    <PrimaryBtn size="sm" variant="ghost" icon={Eye} onClick={() => setViewing(p)}>View</PrimaryBtn>
                    <PrimaryBtn size="sm" variant="ghost" icon={Pencil} onClick={() => setEditing({ ...p })}>Edit</PrimaryBtn>
                    <PrimaryBtn size="sm" variant="ghost" icon={FileDown} onClick={() => generatePdf(p)}>PDF</PrimaryBtn>
                    <PrimaryBtn size="sm" variant="danger" icon={Trash2} onClick={() => remove(p.id)}>Del</PrimaryBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No patients found</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register new patient" footer={
        <><PrimaryBtn variant="ghost" onClick={() => setForm({ name: "", age: "", gender: "Male", phone: "", address: "", blood: "O+", registered: new Date().toISOString().slice(0,10), file: "" })}>Reset</PrimaryBtn><PrimaryBtn variant="ghost" onClick={() => setAddOpen(false)}>Cancel</PrimaryBtn><PrimaryBtn icon={Check} onClick={submitAdd}>Register Patient</PrimaryBtn></>
      }>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Patient Name *" placeholder="Full legal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Age *" type="number" placeholder="In years" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <Select label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={["Male", "Female", "Other"]} />
          <Input label="Contact Number" placeholder="+91 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="Blood Group" value={form.blood} onChange={(v) => setForm({ ...form, blood: v })} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} />
          <Input label="Registration Date" type="date" value={form.registered} onChange={(e) => setForm({ ...form, registered: e.target.value })} />
          <div className="col-span-2"><Input label="Address" placeholder="House, street, city" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <label className="col-span-2 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upload Medical File</span>
            <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name ?? "" })} className="mt-1 w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-1.5 file:text-xs file:font-semibold rounded-lg border bg-background px-3 py-2" />
            {form.file && <span className="text-xs text-success mt-1 block">✓ {form.file}</span>}
          </label>
        </div>
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `${viewing.name} — ${viewing.id}` : ""} footer={
        viewing && <><PrimaryBtn variant="ghost" onClick={() => setViewing(null)}>Close</PrimaryBtn><PrimaryBtn icon={FileDown} onClick={() => generatePdf(viewing)}>Generate Report</PrimaryBtn></>
      }>
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-xs text-muted-foreground">Age</div><div className="font-semibold">{viewing.age}</div></div>
              <div><div className="text-xs text-muted-foreground">Gender</div><div className="font-semibold">{viewing.gender}</div></div>
              <div><div className="text-xs text-muted-foreground">Phone</div><div className="font-semibold">{viewing.phone}</div></div>
              <div><div className="text-xs text-muted-foreground">Status</div><Badge status={viewing.status} /></div>
            </div>
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Visit history</div>
              <ul className="text-sm space-y-1">
                <li>• 2026-06-15 — General checkup with Dr. Patel</li>
                <li>• 2026-04-02 — Blood panel (normal)</li>
                <li>• 2026-01-22 — Cardiology consult</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit patient" footer={
        <><PrimaryBtn variant="ghost" onClick={() => setEditing(null)}>Cancel</PrimaryBtn><PrimaryBtn icon={Check} onClick={saveEdit}>Save</PrimaryBtn></>
      }>
        {editing && (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Age" type="number" value={String(editing.age)} onChange={(e) => setEditing({ ...editing, age: Number(e.target.value) })} />
            <Input label="Phone" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
            <Select label="Status" value={editing.status} onChange={(v) => setEditing({ ...editing, status: v })} options={["Active", "Pending", "Completed"]} />
          </div>
        )}
      </Modal>
    </WorkspaceShell>
  );
}

// ============== OPD / IPD ==============
type Visit = { id: string; patient: string; type: "OPD" | "IPD"; doctor: string; ward?: string; status: string };
function OpdIpdModule() {
  const [tab, setTab] = useState("OPD Queue");
  const [visits, setVisits] = useState<Visit[]>([
    { id: "V-201", patient: "Aarav Mehta", type: "OPD", doctor: "Dr. Patel", status: "Pending" },
    { id: "V-202", patient: "Sara Johnson", type: "OPD", doctor: "Dr. Kapoor", status: "Active" },
    { id: "V-203", patient: "Ken Watanabe", type: "IPD", doctor: "Dr. Singh", ward: "Ward A · Bed 4", status: "Admitted" },
    { id: "V-204", patient: "Lila Schmidt", type: "IPD", doctor: "Dr. Iyer", ward: "Ward B · Bed 12", status: "Admitted" },
  ]);
  const [admitOpen, setAdmitOpen] = useState(false);
  const [adm, setAdm] = useState({ patientId: "", patient: "", type: "IPD" as "OPD"|"IPD", ward: "Ward A · Bed 1", doctor: "Dr. Patel", admission: new Date().toISOString().slice(0,10), discharge: "", notes: "" });

  const opd = visits.filter(v => v.type === "OPD");
  const ipd = visits.filter(v => v.type === "IPD");

  const setStatus = (id: string, s: string) => setVisits(x => x.map(v => v.id === id ? { ...v, status: s } : v));

  const admit = (id: string) => { setStatus(id, "Admitted"); toast.success("Patient admitted to ward"); };
  const discharge = (id: string) => { setStatus(id, "Discharged"); toast.success("Patient discharged"); };

  const submitAdmit = async () => {
    if (!adm.patient || !adm.patientId) { toast.error("Patient ID and name required"); return; }
    await simulateAction("Admitting patient…");
    const id = `V-${205 + visits.length}`;
    setVisits(x => [{ id, patient: adm.patient, type: adm.type, doctor: adm.doctor, ward: adm.type === "IPD" ? adm.ward : undefined, status: adm.type === "IPD" ? "Admitted" : "Pending" }, ...x]);
    setAdmitOpen(false);
    toast.success(`${adm.patient} admitted · ${id}`);
  };

  return (
    <WorkspaceShell
      title="OPD / IPD Console"
      tabs={["OPD Queue", "IPD Inpatients"]}
      activeTab={tab}
      onTab={setTab}
      action={<>
        <PrimaryBtn icon={Plus} onClick={() => setAdmitOpen(true)}>Admit Patient</PrimaryBtn>
        <PrimaryBtn variant="ghost" icon={FileDown} onClick={async () => { await simulateAction("Exporting daily report…"); downloadFakeFile("opd-ipd-report.pdf", "OPD/IPD daily summary"); toast.success("Report exported"); }}>Export Report</PrimaryBtn>
      </>}
    >
      {tab === "OPD Queue" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
              <th className="py-3 pr-3">Visit</th><th>Patient</th><th>Doctor</th><th>Status</th><th className="text-right">Actions</th>
            </tr></thead>
            <tbody>
              {opd.map(v => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-accent/10">
                  <td className="py-3 pr-3 font-mono text-xs">{v.id}</td>
                  <td className="font-semibold">{v.patient}</td>
                  <td>{v.doctor}</td>
                  <td><Badge status={v.status} /></td>
                  <td className="text-right">
                    <div className="inline-flex gap-1">
                      <PrimaryBtn size="sm" variant="ghost" onClick={() => setStatus(v.id, "Active")}>Mark Active</PrimaryBtn>
                      <PrimaryBtn size="sm" variant="ghost" onClick={() => setStatus(v.id, "Completed")}>Complete</PrimaryBtn>
                      <PrimaryBtn size="sm" icon={BedDouble} onClick={() => admit(v.id)}>Admit to IPD</PrimaryBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {ipd.map(v => (
            <div key={v.id} className="rounded-2xl border p-5 bg-card hover:shadow-elegant transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{v.id}</div>
                  <div className="font-bold text-lg">{v.patient}</div>
                  <div className="text-sm text-muted-foreground">Under {v.doctor}</div>
                </div>
                <Badge status={v.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Select label="Ward Allocation" value={v.ward ?? "Ward A · Bed 1"} onChange={(val) => setVisits(x => x.map(p => p.id === v.id ? { ...p, ward: val } : p))} options={["Ward A · Bed 1","Ward A · Bed 4","Ward B · Bed 12","Ward C · Bed 7","ICU · Bed 2"]} />
                <Select label="Status" value={v.status} onChange={(val) => setStatus(v.id, val)} options={["Admitted", "Discharged"]} />
              </div>
              <div className="mt-4 flex gap-2">
                <PrimaryBtn icon={Check} onClick={() => discharge(v.id)}>Discharge</PrimaryBtn>
                <PrimaryBtn variant="ghost" icon={FileDown} onClick={async () => { await simulateAction("Generating discharge summary…"); downloadFakeFile(`${v.id}-summary.pdf`, "Discharge summary"); toast.success("Summary downloaded"); }}>Summary PDF</PrimaryBtn>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={admitOpen} onClose={() => setAdmitOpen(false)} title="Admit / Register Visit" footer={
        <><PrimaryBtn variant="ghost" onClick={() => setAdmitOpen(false)}>Cancel</PrimaryBtn><PrimaryBtn icon={BedDouble} onClick={submitAdmit}>{adm.type === "IPD" ? "Admit Patient" : "Add to Queue"}</PrimaryBtn></>
      }>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Patient ID *" placeholder="P-1042" value={adm.patientId} onChange={(e) => setAdm({ ...adm, patientId: e.target.value })} />
          <Input label="Patient Name *" value={adm.patient} onChange={(e) => setAdm({ ...adm, patient: e.target.value })} />
          <Select label="Admission Type" value={adm.type} onChange={(v) => setAdm({ ...adm, type: v as "OPD"|"IPD" })} options={["OPD","IPD"]} />
          <Select label="Ward Selection" value={adm.ward} onChange={(v) => setAdm({ ...adm, ward: v })} options={["Ward A · Bed 1","Ward A · Bed 4","Ward B · Bed 12","Ward C · Bed 7","ICU · Bed 2"]} />
          <Select label="Doctor Assigned" value={adm.doctor} onChange={(v) => setAdm({ ...adm, doctor: v })} options={["Dr. Patel","Dr. Kapoor","Dr. Singh","Dr. Iyer","Dr. Lee"]} />
          <Input label="Admission Date" type="date" value={adm.admission} onChange={(e) => setAdm({ ...adm, admission: e.target.value })} />
          <Input label="Expected Discharge" type="date" value={adm.discharge} onChange={(e) => setAdm({ ...adm, discharge: e.target.value })} />
          <div className="col-span-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clinical Notes</span>
              <textarea value={adm.notes} onChange={(e) => setAdm({ ...adm, notes: e.target.value })} rows={3} placeholder="Reason for admission, observations…" className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </label>
          </div>
        </div>
      </Modal>
    </WorkspaceShell>
  );
}

// ============== APPOINTMENTS ==============
type Appt = { id: string; patient: string; doctor: string; date: string; slot: string; status: string };
function AppointmentsModule() {
  const today = new Date();
  const [day, setDay] = useState(today.toISOString().slice(0, 10));
  const [doctor, setDoctor] = useState("Dr. Patel");
  const [appts, setAppts] = useState<Appt[]>([
    { id: "A-501", patient: "Aarav Mehta", doctor: "Dr. Patel", date: today.toISOString().slice(0,10), slot: "10:00", status: "Active" },
    { id: "A-502", patient: "Sara Johnson", doctor: "Dr. Kapoor", date: today.toISOString().slice(0,10), slot: "11:30", status: "Pending" },
  ]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patient, setPatient] = useState("");

  const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00"];
  const booked = new Set(appts.filter(a => a.date === day && a.doctor === doctor).map(a => a.slot));

  const book = () => {
    if (!selectedSlot || !patient) { toast.error("Pick a slot and enter patient name"); return; }
    const id = `A-${503 + appts.length}`;
    setAppts(x => [...x, { id, patient, doctor, date: day, slot: selectedSlot, status: "Pending" }]);
    setSelectedSlot(null); setPatient("");
    toast.success(`Appointment ${id} booked at ${selectedSlot}`);
  };

  const cancel = (id: string) => { setAppts(x => x.filter(a => a.id !== id)); toast.success("Appointment cancelled"); };

  return (
    <WorkspaceShell
      title="Appointment Scheduler"
      action={<>
        <Input label="Date" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
        <Select label="Doctor" value={doctor} onChange={setDoctor} options={["Dr. Patel","Dr. Kapoor","Dr. Singh","Dr. Iyer"]} />
      </>}
    >
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div>
          <div className="text-sm font-semibold mb-3">Available slots — {doctor}</div>
          <div className="grid grid-cols-4 gap-2">
            {SLOTS.map(s => {
              const isBooked = booked.has(s);
              const isSel = selectedSlot === s;
              return (
                <button key={s} disabled={isBooked} onClick={() => setSelectedSlot(s)} className={cn(
                  "rounded-lg border px-3 py-3 text-sm font-semibold transition",
                  isBooked ? "bg-muted text-muted-foreground line-through cursor-not-allowed" :
                  isSel ? "bg-gradient-primary text-primary-foreground border-transparent" :
                  "hover:border-primary hover:text-primary"
                )}>{s}</button>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl border p-4 bg-muted/30 space-y-3">
            <Input label="Patient" placeholder="Patient name" value={patient} onChange={(e) => setPatient(e.target.value)} />
            <PrimaryBtn icon={CalendarIcon} onClick={book}>Book Appointment</PrimaryBtn>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Today's appointments</div>
          <div className="space-y-2">
            {appts.filter(a => a.date === day).length === 0 && <div className="text-sm text-muted-foreground">No appointments on this date.</div>}
            {appts.filter(a => a.date === day).map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/10">
                <div>
                  <div className="font-semibold">{a.patient}</div>
                  <div className="text-xs text-muted-foreground">{a.doctor} · {a.slot}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={a.status} />
                  <PrimaryBtn size="sm" variant="danger" icon={X} onClick={() => cancel(a.id)}>Cancel</PrimaryBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}

// ============== BILLING ==============
type Bill = { id: string; patient: string; amount: number; status: "Paid" | "Unpaid"; date: string };
function BillingModule() {
  const [bills, setBills] = useState<Bill[]>([
    { id: "INV-9011", patient: "Aarav Mehta", amount: 1240, status: "Paid", date: "2026-06-21" },
    { id: "INV-9012", patient: "Sara Johnson", amount: 560, status: "Unpaid", date: "2026-06-22" },
    { id: "INV-9013", patient: "Ken Watanabe", amount: 3120, status: "Unpaid", date: "2026-06-22" },
  ]);
  const [preview, setPreview] = useState<Bill | null>(null);
  const [genOpen, setGenOpen] = useState(false);
  const [form, setForm] = useState({ patient: "", amount: "" });

  const toggle = (id: string) => setBills(x => x.map(b => b.id === id ? { ...b, status: b.status === "Paid" ? "Unpaid" : "Paid" } : b));

  const generate = () => {
    if (!form.patient || !form.amount) { toast.error("Patient and amount required"); return; }
    const b: Bill = { id: `INV-${9014 + bills.length}`, patient: form.patient, amount: Number(form.amount), status: "Unpaid", date: new Date().toISOString().slice(0,10) };
    setBills(x => [b, ...x]); setGenOpen(false); setForm({ patient: "", amount: "" });
    setPreview(b);
  };

  const download = async (b: Bill) => {
    await simulateAction("Building invoice PDF…");
    downloadFakeFile(`${b.id}.pdf`, `Orbit HMS — Invoice ${b.id}\n\nPatient: ${b.patient}\nAmount: $${b.amount}\nStatus: ${b.status}`);
    toast.success("Invoice downloaded");
  };

  const total = bills.reduce((s, b) => s + b.amount, 0);
  const unpaid = bills.filter(b => b.status === "Unpaid").reduce((s,b)=>s+b.amount,0);

  return (
    <WorkspaceShell title="Billing & Invoices" action={<PrimaryBtn icon={Plus} onClick={() => setGenOpen(true)}>Generate Invoice</PrimaryBtn>}>
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl border p-4"><div className="text-xs uppercase text-muted-foreground">Total billed</div><div className="text-2xl font-extrabold text-gradient">${total.toLocaleString()}</div></div>
        <div className="rounded-2xl border p-4"><div className="text-xs uppercase text-muted-foreground">Outstanding</div><div className="text-2xl font-extrabold text-destructive">${unpaid.toLocaleString()}</div></div>
        <div className="rounded-2xl border p-4"><div className="text-xs uppercase text-muted-foreground">Invoices</div><div className="text-2xl font-extrabold">{bills.length}</div></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
            <th className="py-3 pr-3">Invoice</th><th>Patient</th><th>Date</th><th>Amount</th><th>Status</th><th className="text-right">Actions</th>
          </tr></thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-accent/10">
                <td className="py-3 pr-3 font-mono text-xs">{b.id}</td>
                <td className="font-semibold">{b.patient}</td>
                <td className="text-muted-foreground">{b.date}</td>
                <td className="font-bold">${b.amount.toLocaleString()}</td>
                <td><button onClick={() => toggle(b.id)} className="cursor-pointer"><Badge status={b.status} /></button></td>
                <td className="text-right">
                  <div className="inline-flex gap-1">
                    <PrimaryBtn size="sm" variant="ghost" icon={Eye} onClick={() => setPreview(b)}>Preview</PrimaryBtn>
                    <PrimaryBtn size="sm" variant="ghost" icon={FileDown} onClick={() => download(b)}>Download</PrimaryBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="New invoice" footer={
        <><PrimaryBtn variant="ghost" onClick={() => setGenOpen(false)}>Cancel</PrimaryBtn><PrimaryBtn icon={Receipt} onClick={generate}>Generate</PrimaryBtn></>
      }>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
          <Input label="Amount (USD)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview ? `Invoice ${preview.id}` : ""} footer={
        preview && <><PrimaryBtn variant="ghost" onClick={() => setPreview(null)}>Close</PrimaryBtn><PrimaryBtn icon={FileDown} onClick={() => download(preview)}>Download PDF</PrimaryBtn></>
      }>
        {preview && (
          <div className="rounded-xl border p-5 bg-muted/30 font-mono text-xs space-y-2">
            <div className="text-base font-bold font-sans">Orbit HMS</div>
            <div>Invoice: {preview.id}</div>
            <div>Patient: {preview.patient}</div>
            <div>Date: {preview.date}</div>
            <div className="border-t pt-2 mt-2">Consultation ............ $80</div>
            <div>Diagnostics ............ $180</div>
            <div>Procedure ............... ${preview.amount - 260}</div>
            <div className="border-t pt-2 mt-2 text-base font-bold font-sans">Total: ${preview.amount.toLocaleString()}</div>
            <div>Status: {preview.status}</div>
          </div>
        )}
      </Modal>
    </WorkspaceShell>
  );
}

// ============== EMR ==============
function EMRModule() {
  const patients = ["Aarav Mehta", "Sara Johnson", "Ken Watanabe"];
  const [patient, setPatient] = useState(patients[0]);
  const [tab, setTab] = useState("Diagnosis");

  const data: Record<string, Record<string, string[]>> = {
    "Aarav Mehta": {
      Diagnosis: ["Type 2 Diabetes (E11.9)", "Hypertension (I10)"],
      Prescription: ["Metformin 500mg — twice daily", "Amlodipine 5mg — once daily"],
      "Lab Reports": ["CBC — 2026-06-18 (normal)", "HbA1c — 7.2% (slightly elevated)"],
    },
    "Sara Johnson": {
      Diagnosis: ["Acute Bronchitis (J20.9)"],
      Prescription: ["Azithromycin 500mg — 5-day course"],
      "Lab Reports": ["Chest X-ray — Clear"],
    },
    "Ken Watanabe": {
      Diagnosis: ["Coronary Artery Disease (I25.10)"],
      Prescription: ["Atorvastatin 40mg", "Aspirin 75mg"],
      "Lab Reports": ["ECG — Abnormal ST changes", "Lipid panel — LDL 165"],
    },
  };

  const download = async () => {
    await simulateAction("Compiling EMR report…");
    downloadFakeFile(`${patient.replace(/\s/g, "_")}-EMR.pdf`, `EMR Report — ${patient}\n\n${tab}:\n${data[patient][tab].join("\n")}`);
    toast.success("EMR report downloaded");
  };

  return (
    <WorkspaceShell
      title="Electronic Medical Records"
      tabs={["Diagnosis","Prescription","Lab Reports"]}
      activeTab={tab}
      onTab={setTab}
      action={<>
        <Select value={patient} onChange={setPatient} options={patients} />
        <PrimaryBtn icon={FileDown} onClick={download}>Download Report</PrimaryBtn>
      </>}
    >
      <div className="grid md:grid-cols-[280px_1fr] gap-5">
        <div className="rounded-2xl border p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{patient.split(" ").map(n=>n[0]).join("")}</div>
            <div>
              <div className="font-bold">{patient}</div>
              <div className="text-xs text-muted-foreground">EMR · last updated today</div>
            </div>
          </div>
          <ul className="mt-4 text-sm space-y-1">
            <li className="flex justify-between"><span className="text-muted-foreground">BP</span><span className="font-semibold">128/82</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Pulse</span><span className="font-semibold">76 bpm</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Temp</span><span className="font-semibold">98.4°F</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">SpO₂</span><span className="font-semibold">97%</span></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 flex items-center gap-2"><FileHeart className="h-4 w-4 text-primary" /> {tab}</div>
          <ul className="space-y-2">
            {data[patient][tab].map((entry, i) => (
              <li key={i} className="rounded-xl border p-3 hover:bg-accent/10 flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">{i+1}</div>
                <div className="text-sm">{entry}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WorkspaceShell>
  );
}

// ============== STAFF ==============
type Staff = { id: string; name: string; role: string; dept: string; status: "On Duty" | "Off"; duty?: string };
function StaffModule() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: "S-01", name: "Dr. Anjali Patel", role: "Cardiologist", dept: "Cardiology", status: "On Duty", duty: "OPD-3" },
    { id: "S-02", name: "Dr. Rohan Kapoor", role: "Pediatrician", dept: "Pediatrics", status: "On Duty", duty: "Ward B" },
    { id: "S-03", name: "Nurse Lina Park", role: "Senior Nurse", dept: "ICU", status: "Off" },
    { id: "S-04", name: "Dr. Marcus Lee", role: "Surgeon", dept: "Surgery", status: "On Duty", duty: "OT-1" },
  ]);
  const [assignOpen, setAssignOpen] = useState<Staff | null>(null);
  const [duty, setDuty] = useState("");

  const toggleAttendance = (id: string) => setStaff(x => x.map(s => s.id === id ? { ...s, status: s.status === "On Duty" ? "Off" : "On Duty" } : s));
  const assign = () => {
    if (!assignOpen) return;
    setStaff(x => x.map(s => s.id === assignOpen.id ? { ...s, duty, status: "On Duty" } : s));
    setAssignOpen(null); setDuty("");
    toast.success("Duty assigned");
  };

  return (
    <WorkspaceShell title="Doctor & Staff Roster" action={<PrimaryBtn icon={FileDown} onClick={async () => { await simulateAction("Generating duty roster…"); downloadFakeFile("duty-roster.pdf", "Duty Roster"); toast.success("Roster exported"); }}>Export Roster</PrimaryBtn>}>
      <div className="grid md:grid-cols-2 gap-4">
        {staff.map(s => (
          <div key={s.id} className="rounded-2xl border p-5 bg-card hover:shadow-elegant transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{s.name.split(" ").slice(-1)[0][0]}</div>
                <div>
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role} · {s.dept}</div>
                  {s.duty && <div className="text-xs mt-1">Duty: <span className="font-semibold">{s.duty}</span></div>}
                </div>
              </div>
              <Badge status={s.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PrimaryBtn size="sm" icon={Stethoscope} onClick={() => { setAssignOpen(s); setDuty(s.duty || ""); }}>Assign Duty</PrimaryBtn>
              <PrimaryBtn size="sm" variant="ghost" onClick={() => toggleAttendance(s.id)}>{s.status === "On Duty" ? "Mark Off" : "Mark On Duty"}</PrimaryBtn>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!assignOpen} onClose={() => setAssignOpen(null)} title={assignOpen ? `Assign duty — ${assignOpen.name}` : ""} footer={
        <><PrimaryBtn variant="ghost" onClick={() => setAssignOpen(null)}>Cancel</PrimaryBtn><PrimaryBtn icon={Check} onClick={assign}>Assign</PrimaryBtn></>
      }>
        <Select label="Location" value={duty || "OPD-1"} onChange={setDuty} options={["OPD-1","OPD-2","OPD-3","Ward A","Ward B","ICU","OT-1","OT-2","Emergency"]} />
      </Modal>
    </WorkspaceShell>
  );
}

// ============== WARDS ==============
type Bed = { id: string; ward: string; status: "Available" | "Occupied" | "Cleaning" | "Reserved"; patient?: string };
function WardsModule() {
  const initBeds: Bed[] = [];
  ["Ward A","Ward B","ICU"].forEach(w => {
    for (let i=1; i<=8; i++) {
      const r = Math.random();
      const s: Bed["status"] = r < 0.45 ? "Occupied" : r < 0.7 ? "Available" : r < 0.85 ? "Cleaning" : "Reserved";
      initBeds.push({ id: `${w[0]}-${i}`, ward: w, status: s, patient: s === "Occupied" ? "Patient" : undefined });
    }
  });
  const [beds, setBeds] = useState<Bed[]>(initBeds);
  const [selected, setSelected] = useState<Bed | null>(null);

  const cycle = (id: string) => {
    const order: Bed["status"][] = ["Available", "Reserved", "Occupied", "Cleaning"];
    setBeds(x => x.map(b => {
      if (b.id !== id) return b;
      const next = order[(order.indexOf(b.status) + 1) % order.length];
      return { ...b, status: next, patient: next === "Occupied" ? "New patient" : undefined };
    }));
    toast.success("Bed status updated");
  };

  const counts = beds.reduce<Record<string, number>>((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});

  return (
    <WorkspaceShell title="Bed & Ward Manager" action={<PrimaryBtn icon={FileDown} onClick={async () => { await simulateAction("Generating occupancy report…"); downloadFakeFile("occupancy.pdf", "Bed occupancy report"); toast.success("Report ready"); }}>Occupancy PDF</PrimaryBtn>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {(["Available","Occupied","Cleaning","Reserved"] as const).map(s => (
          <div key={s} className="rounded-2xl border p-4">
            <div className="text-xs uppercase text-muted-foreground">{s}</div>
            <div className="text-2xl font-extrabold mt-1">{counts[s] ?? 0}</div>
          </div>
        ))}
      </div>
      {["Ward A","Ward B","ICU"].map(w => (
        <div key={w} className="mb-6">
          <div className="font-semibold mb-2">{w}</div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {beds.filter(b => b.ward === w).map(b => {
              const color = {
                Available: "bg-success/15 border-success/40 hover:bg-success/25",
                Occupied: "bg-destructive/15 border-destructive/40 hover:bg-destructive/25",
                Cleaning: "bg-warning/20 border-warning/40 hover:bg-warning/30",
                Reserved: "bg-primary/15 border-primary/40 hover:bg-primary/25",
              }[b.status];
              return (
                <button key={b.id} onClick={() => setSelected(b)} className={cn("rounded-xl border-2 p-3 text-left transition", color)}>
                  <BedDouble className="h-4 w-4 mb-1" />
                  <div className="text-xs font-mono">{b.id}</div>
                  <div className="text-[10px] font-semibold uppercase">{b.status}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Bed ${selected.id} — ${selected.ward}` : ""} footer={
        selected && <><PrimaryBtn variant="ghost" onClick={() => setSelected(null)}>Close</PrimaryBtn><PrimaryBtn onClick={() => { cycle(selected.id); setSelected(null); }}>Cycle Status</PrimaryBtn></>
      }>
        {selected && <div className="space-y-3">
          <div className="flex items-center justify-between">Status <Badge status={selected.status} /></div>
          {selected.patient && <div className="text-sm text-muted-foreground">Currently: {selected.patient}</div>}
          <Select label="Set status" value={selected.status} onChange={(v) => setBeds(x => x.map(b => b.id === selected.id ? { ...b, status: v as Bed["status"] } : b))} options={["Available","Occupied","Cleaning","Reserved"]} />
        </div>}
      </Modal>
    </WorkspaceShell>
  );
}

// ============== INSURANCE / TPA ==============
type Claim = { id: string; patient: string; provider: string; amount: number; status: "Submitted" | "Approved" | "Rejected" | "Paid" };
function InsuranceModule() {
  const [claims, setClaims] = useState<Claim[]>([
    { id: "CL-77001", patient: "Aarav Mehta", provider: "BlueCross", amount: 1240, status: "Approved" },
    { id: "CL-77002", patient: "Sara Johnson", provider: "Aetna", amount: 540, status: "Submitted" },
    { id: "CL-77003", patient: "Ken Watanabe", provider: "Cigna", amount: 3120, status: "Rejected" },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient: "", provider: "BlueCross", amount: "" });

  const submit = async () => {
    if (!form.patient || !form.amount) { toast.error("Fill all fields"); return; }
    await simulateAction("Submitting claim…");
    const c: Claim = { id: `CL-${77004 + claims.length}`, patient: form.patient, provider: form.provider, amount: Number(form.amount), status: "Submitted" };
    setClaims(x => [c, ...x]); setOpen(false); setForm({ patient: "", provider: "BlueCross", amount: "" });
    toast.success(`Claim ${c.id} submitted`);
  };

  const setStatus = (id: string, s: Claim["status"]) => { setClaims(x => x.map(c => c.id === id ? { ...c, status: s } : c)); toast.success(`Marked ${s}`); };

  return (
    <WorkspaceShell title="Insurance & TPA" action={<PrimaryBtn icon={ShieldCheck} onClick={() => setOpen(true)}>New Claim</PrimaryBtn>}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
            <th className="py-3 pr-3">Claim ID</th><th>Patient</th><th>Provider</th><th>Amount</th><th>Status</th><th className="text-right">Actions</th>
          </tr></thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-accent/10">
                <td className="py-3 pr-3 font-mono text-xs">{c.id}</td>
                <td className="font-semibold">{c.patient}</td>
                <td>{c.provider}</td>
                <td className="font-bold">${c.amount.toLocaleString()}</td>
                <td><Badge status={c.status} /></td>
                <td className="text-right">
                  <div className="inline-flex gap-1">
                    {c.status === "Submitted" && <>
                      <PrimaryBtn size="sm" icon={Check} onClick={() => setStatus(c.id, "Approved")}>Approve</PrimaryBtn>
                      <PrimaryBtn size="sm" variant="danger" icon={X} onClick={() => setStatus(c.id, "Rejected")}>Reject</PrimaryBtn>
                    </>}
                    {c.status === "Approved" && <PrimaryBtn size="sm" onClick={() => setStatus(c.id, "Paid")}>Mark Paid</PrimaryBtn>}
                    <PrimaryBtn size="sm" variant="ghost" icon={FileDown} onClick={async () => { await simulateAction("Generating claim form…"); downloadFakeFile(`${c.id}.pdf`, "Claim form"); toast.success("Downloaded"); }}>PDF</PrimaryBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Submit insurance claim" footer={
        <><PrimaryBtn variant="ghost" onClick={() => setOpen(false)}>Cancel</PrimaryBtn><PrimaryBtn icon={ArrowRight} onClick={submit}>Submit</PrimaryBtn></>
      }>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
          <Select label="Provider" value={form.provider} onChange={(v) => setForm({ ...form, provider: v })} options={["BlueCross","Aetna","Cigna","UnitedHealth","Star Health"]} />
          <Input label="Amount (USD)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
      </Modal>
    </WorkspaceShell>
  );
}
