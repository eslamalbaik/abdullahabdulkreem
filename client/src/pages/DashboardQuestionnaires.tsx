import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Trash2, CheckCircle2, ChevronUp, ChevronDown,
  ChevronsUpDown, Mail, Phone, MessageSquare, Calendar,
  AlertTriangle, X, Eye, ChevronLeft, ChevronRight,
  ClipboardList, Clock, CircleCheck, Users, Instagram,
  Briefcase, DollarSign, Building, User,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// ─── Types ───────────────────────────────────────────────────────────────────
type SubmissionStatus = "pending" | "completed";
type SortField = "name" | "createdAt" | "serviceType" | "status";
type SortDir = "asc" | "desc";

interface Submission {
  id: string;
  name: string;
  serviceType: string;
  budget: string;
  projectInfo: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  role?: string;
  companySize?: string;
  contactMethod?: string;
  socialMedia?: string;
  status?: SubmissionStatus;
  createdAt: string;
}

const SERVICE_LABELS: Record<string, string> = {
  identity: "هويّة بصريّة",
  strategy: "استراتيجيّة علامة",
  landing: "صفحة هبوط",
};

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getServiceLabel = (type: string) => SERVICE_LABELS[type] || type;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric", month: "short", day: "numeric",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ar-SA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: SubmissionStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
        <CircleCheck className="w-3 h-3" />
        مكتمل
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/20 whitespace-nowrap">
      <Clock className="w-3 h-3" />
      قيد الانتظار
    </span>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/40" />;
  return dir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
}

// ─── Sort Header ──────────────────────────────────────────────────────────────
function SortHeader({ label, field, current, dir, onSort }: {
  label: string; field: SortField; current: SortField; dir: SortDir; onSort: (f: SortField) => void;
}) {
  return (
    <th className="px-4 py-3 text-right">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {label}
        <SortIcon field={field} current={current} dir={dir} />
      </button>
    </th>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ count, onConfirm, onCancel }: {
  count: number; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-base">تأكيد الحذف</h3>
            <p className="text-sm text-muted-foreground">
              هل أنت متأكد من حذف {count === 1 ? "هذا الرد" : `${count} ردود`}؟
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-5 bg-muted/50 rounded-lg p-3 border border-border">
          ⚠️ لا يمكن التراجع عن هذا الإجراء. سيتم حذف البيانات نهائياً.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/50 text-sm font-medium transition-colors">
            إلغاء
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-semibold transition-colors">
            حذف نهائي
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, ltr }: { icon: React.ReactNode; label: string; value?: string; ltr?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-sm font-medium break-words ${ltr ? "dir-ltr text-left" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function DetailModal({ sub, onClose }: { sub: Submission; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-xl w-full z-10 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {sub.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{sub.name}</h2>
              <StatusBadge status={sub.status} />
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="تاريخ الإرسال" value={formatDateTime(sub.createdAt)} />
          <InfoRow icon={<Briefcase className="w-4 h-4" />} label="الخدمة المطلوبة" value={getServiceLabel(sub.serviceType)} />
          <InfoRow icon={<DollarSign className="w-4 h-4" />} label="الميزانية المقترحة" value={sub.budget} />
          <InfoRow icon={<User className="w-4 h-4" />} label="الصفة الوظيفية" value={sub.role} />
          <InfoRow icon={<Building className="w-4 h-4" />} label="حجم الشركة / المشروع" value={sub.companySize} />
          <InfoRow icon={<MessageSquare className="w-4 h-4" />} label="طريقة التواصل المفضلة" value={sub.contactMethod} />
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-muted/20 rounded-xl border border-border">
          <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد الإلكتروني" value={sub.email} ltr />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="رقم الواتساب" value={sub.whatsapp} ltr />
          <InfoRow icon={<Instagram className="w-4 h-4" />} label="حساب إنستغرام" value={sub.instagram} />
        </div>

        {/* Project info */}
        {sub.projectInfo && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 mb-3">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /> نبذة عن المشروع
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{sub.projectInfo}</p>
          </div>
        )}
        {sub.socialMedia && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground mb-1.5">روابط حسابات التواصل الاجتماعي</p>
            <p className="text-sm break-words">{sub.socialMedia}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────
function StatsCards({ data }: { data: Submission[] }) {
  const total = data.length;
  const pending = data.filter(s => !s.status || s.status === "pending").length;
  const completed = data.filter(s => s.status === "completed").length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: "إجمالي الردود", value: total, icon: <ClipboardList className="w-5 h-5" />, color: "text-primary bg-primary/10" },
        { label: "قيد الانتظار", value: pending, icon: <Clock className="w-5 h-5" />, color: "text-amber-500 bg-amber-500/10" },
        { label: "مكتملة", value: completed, icon: <CircleCheck className="w-5 h-5" />, color: "text-emerald-500 bg-emerald-500/10" },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardQuestionnaires() {
  const queryClient = useQueryClient();

  // ── State ──
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | SubmissionStatus>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
  const [detailSub, setDetailSub] = useState<Submission | null>(null);

  // ── Data ──
  const { data: submissions = [], isLoading, error } = useQuery<Submission[]>({
    queryKey: ["/api/admin/questionnaire-submissions"],
  });

  // ── Mutations ──
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubmissionStatus }) =>
      apiRequest("PATCH", `/api/admin/questionnaire-submissions/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/admin/questionnaire-submissions"] });
      const prev = queryClient.getQueryData<Submission[]>(["/api/admin/questionnaire-submissions"]);
      queryClient.setQueryData<Submission[]>(["/api/admin/questionnaire-submissions"], old =>
        (old ?? []).map(s => s.id === id ? { ...s, status } : s)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["/api/admin/questionnaire-submissions"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/questionnaire-submissions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map(id => apiRequest("DELETE", `/api/admin/questionnaire-submissions/${id}`))),
    onSuccess: (_data, ids) => {
      queryClient.setQueryData<Submission[]>(["/api/admin/questionnaire-submissions"], old =>
        (old ?? []).filter(s => !ids.includes(s.id))
      );
      setSelected(new Set());
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/questionnaire-submissions"] }),
  });

  const getStatus = (sub: Submission): SubmissionStatus =>
    (sub.status as SubmissionStatus) ?? "pending";

  // ── Computed ──
  const enriched = useMemo(() =>
    submissions.map(s => ({ ...s, _status: getStatus(s) })),
    [submissions]
  );

  const filtered = useMemo(() => {
    let list = [...enriched];
    if (filterStatus !== "all") list = list.filter(s => s._status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q) ||
        s.serviceType.toLowerCase().includes(q) ||
        (s.projectInfo ?? "").toLowerCase().includes(q) ||
        (s.whatsapp ?? "").includes(q)
      );
    }
    list.sort((a, b) => {
      let va: string, vb: string;
      if (sortField === "createdAt") { va = a.createdAt; vb = b.createdAt; }
      else if (sortField === "status") { va = a._status; vb = b._status; }
      else { va = (a[sortField] ?? "").toLowerCase(); vb = (b[sortField] ?? "").toLowerCase(); }
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [enriched, search, sortField, sortDir, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ──
  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }, [sortField]);

  const handleSelectAll = (checked: boolean) =>
    setSelected(checked ? new Set(paginated.map(s => s.id)) : new Set());

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const requestDelete = (ids: string[]) => { setDeleteTarget(ids); setShowDeleteModal(true); };
  const confirmDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget);
    setShowDeleteModal(false); setDeleteTarget(null);
  };

  const handleBulkComplete = () => {
    selected.forEach(id => updateStatusMutation.mutate({ id, status: "completed" }));
    setSelected(new Set());
  };

  const handleToggleStatus = (sub: Submission) => {
    const curr = getStatus(sub);
    const next: SubmissionStatus = curr === "pending" ? "completed" : "pending";
    updateStatusMutation.mutate({ id: sub.id, status: next });
  };

  const allPageSelected = paginated.length > 0 && paginated.every(s => selected.has(s.id));
  const someSelected = selected.size > 0 && !allPageSelected;

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <div className="space-y-4" dir="rtl">
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-96 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center rounded-xl border border-destructive/30 bg-destructive/5" dir="rtl">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive font-medium">حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5" dir="rtl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ردود الاستبيان</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            عرض وإدارة جميع الردود الواردة من الاستبيانات
          </p>
        </div>

        {/* Stats */}
        <StatsCards data={submissions.map(s => ({ ...s, status: getStatus(s) }))} />

        {/* Table Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="بحث بالاسم، البريد، أو الخدمة..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              {(["all", "pending", "completed"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s === "all" ? "الكل" : s === "pending" ? "قيد الانتظار" : "مكتملة"}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-3 bg-primary/5 border-b border-primary/20 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Users className="w-4 h-4" />
                    <span>تم تحديد {selected.size} {selected.size === 1 ? "رد" : "ردود"}</span>
                  </div>
                  <div className="flex gap-2 mr-auto">
                    <button
                      onClick={handleBulkComplete}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 text-xs font-semibold transition-colors border border-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تعيين كمكتمل
                    </button>
                    <button
                      onClick={() => requestDelete([...selected])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-semibold transition-colors border border-destructive/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف المحدد
                    </button>
                    <button onClick={() => setSelected(new Set())} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">
                {search ? "لا توجد نتائج تطابق بحثك" : "لا توجد ردود مسجلة بعد"}
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="w-12 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={allPageSelected}
                          ref={el => { if (el) el.indeterminate = someSelected; }}
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </th>
                      <SortHeader label="التاريخ" field="createdAt" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <SortHeader label="الاسم" field="name" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <SortHeader label="الخدمة المطلوبة" field="serviceType" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        معلومات التواصل
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider max-w-[220px]">
                        عن المشروع
                      </th>
                      <SortHeader label="الحالة" field="status" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <th className="w-20 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {paginated.map((sub, i) => (
                        <motion.tr
                          key={sub.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`border-b border-border/50 transition-colors cursor-pointer group
                            ${selected.has(sub.id) ? "bg-primary/5" : "hover:bg-muted/40"}`}
                          onClick={() => setDetailSub({ ...sub, status: getStatus(sub) })}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selected.has(sub.id)}
                              onChange={e => handleSelectOne(sub.id, e.target.checked)}
                              className="w-4 h-4 rounded accent-primary cursor-pointer"
                            />
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <div>
                                <div>{formatDate(sub.createdAt)}</div>
                                <div className="text-[10px]">
                                  {new Date(sub.createdAt).toLocaleTimeString("ar-SA")}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {sub.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{sub.name}</span>
                            </div>
                          </td>

                          {/* Service */}
                          <td className="px-4 py-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium whitespace-nowrap">
                              {getServiceLabel(sub.serviceType)}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              {sub.email && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
                                  <Mail className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate max-w-[160px]">{sub.email}</span>
                                </div>
                              )}
                              {sub.whatsapp && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
                                  <Phone className="w-3.5 h-3.5 shrink-0" />
                                  <span>{sub.whatsapp}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Project info */}
                          <td className="px-4 py-3 max-w-[220px]">
                            <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                              {sub.projectInfo}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              className="transition-transform hover:scale-105 active:scale-95"
                              title="اضغط لتغيير الحالة"
                            >
                              <StatusBadge status={getStatus(sub)} />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setDetailSub({ ...sub, status: getStatus(sub) })}
                                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => requestDelete([sub.id])}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden divide-y divide-border">
                {paginated.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-4 transition-colors ${selected.has(sub.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(sub.id)}
                        onChange={e => handleSelectOne(sub.id, e.target.checked)}
                        className="w-4 h-4 mt-1 rounded accent-primary cursor-pointer"
                      />
                      <div className="flex-1 min-w-0" onClick={() => setDetailSub({ ...sub, status: getStatus(sub) })}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {sub.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm">{sub.name}</span>
                          </div>
                          <StatusBadge status={getStatus(sub)} />
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" />{getServiceLabel(sub.serviceType)}
                          </div>
                          {sub.email && (
                            <div className="flex items-center gap-1.5" dir="ltr">
                              <Mail className="w-3 h-3" />{sub.email}
                            </div>
                          )}
                          {sub.whatsapp && (
                            <div className="flex items-center gap-1.5" dir="ltr">
                              <Phone className="w-3 h-3" />{sub.whatsapp}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />{formatDate(sub.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => requestDelete([sub.id])}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length} رد
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                          page === p ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <DeleteModal
            count={deleteTarget.length}
            onConfirm={confirmDelete}
            onCancel={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailSub && (
          <DetailModal sub={detailSub} onClose={() => setDetailSub(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
