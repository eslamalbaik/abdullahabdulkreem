import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Search, Trash2, CheckCircle2, ChevronUp, ChevronDown,
  ChevronsUpDown, Mail, Phone, MessageSquare, Calendar,
  AlertTriangle, X, Eye, ChevronLeft, ChevronRight,
  Inbox, Clock, CircleCheck, Users,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// ─── Types ───────────────────────────────────────────────────────────────────
type ContactStatus = 'pending' | 'completed';
type SortField = 'name' | 'createdAt' | 'projectType' | 'status';
type SortDir = 'asc' | 'desc';

interface Contact {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ContactStatus }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
        <CircleCheck className="w-3 h-3" />
        مكتمل
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/20">
      <Clock className="w-3 h-3" />
      قيد الانتظار
    </span>
  );
};

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon: React.FC<{ field: SortField; current: SortField; dir: SortDir }> = ({ field, current, dir }) => {
  if (field !== current) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/40" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
    : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal: React.FC<{
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ count, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-base">تأكيد الحذف</h3>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف {count === 1 ? 'هذه الرسالة' : `${count} رسائل`}؟
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-5 bg-muted/50 rounded-lg p-3 border border-border">
        ⚠️ لا يمكن التراجع عن هذا الإجراء. سيتم حذف البيانات نهائياً.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/50 text-sm font-medium transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-semibold transition-colors"
        >
          حذف نهائي
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal: React.FC<{ contact: Contact; onClose: () => void }> = ({ contact, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-lg w-full z-10 max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{contact.name}</h2>
            <StatusBadge status={contact.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        <DetailRow icon={<Mail className="w-4 h-4" />} label="البريد الإلكتروني" value={contact.email} ltr />
        <DetailRow icon={<MessageSquare className="w-4 h-4" />} label="نوع الخدمة" value={contact.projectType} />
        <DetailRow
          icon={<Calendar className="w-4 h-4" />}
          label="تاريخ الإرسال"
          value={format(new Date(contact.createdAt), 'dd MMMM yyyy • HH:mm', { locale: ar })}
        />
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            الرسالة
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string; ltr?: boolean }> = ({
  icon, label, value, ltr
}) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border">
    <span className="text-muted-foreground shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-medium truncate ${ltr ? 'dir-ltr text-left' : ''}`}>{value}</p>
    </div>
  </div>
);

// ─── Stats Cards ──────────────────────────────────────────────────────────────
const StatsCards: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const total = contacts.length;
  const pending = contacts.filter(c => c.status === 'pending').length;
  const completed = contacts.filter(c => c.status === 'completed').length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: 'إجمالي الرسائل', value: total, icon: <Inbox className="w-5 h-5" />, color: 'text-primary bg-primary/10' },
        { label: 'قيد الانتظار', value: pending, icon: <Clock className="w-5 h-5" />, color: 'text-amber-500 bg-amber-500/10' },
        { label: 'مكتملة', value: completed, icon: <CircleCheck className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-500/10' },
      ].map(({ label, value, icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardContacts: React.FC = () => {
  const queryClient = useQueryClient();

  // ── State ──
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | ContactStatus>('all');

  // ── Data ──
  const { data: contacts = [], isLoading, error } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
  });

  // ── Mutations ──
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      apiRequest('PATCH', `/api/admin/contacts/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['/api/admin/contacts'] });
      const prev = queryClient.getQueryData<Contact[]>(['/api/admin/contacts']);
      queryClient.setQueryData<Contact[]>(['/api/admin/contacts'], old =>
        (old ?? []).map(c => c.id === id ? { ...c, status } : c)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['/api/admin/contacts'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map(id => apiRequest('DELETE', `/api/admin/contacts/${id}`))),
    onSuccess: (_data, ids) => {
      queryClient.setQueryData<Contact[]>(['/api/admin/contacts'], old =>
        (old ?? []).filter(c => !ids.includes(c.id))
      );
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
    },
  });

  // ── Computed Data ──
  const filtered = useMemo(() => {
    let list = [...contacts];
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.projectType.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let valA: string, valB: string;
      if (sortField === 'createdAt') {
        valA = a.createdAt; valB = b.createdAt;
      } else {
        valA = (a[sortField] ?? '').toLowerCase();
        valB = (b[sortField] ?? '').toLowerCase();
      }
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    return list;
  }, [contacts, search, sortField, sortDir, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Handlers ──
  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  }, [sortField]);

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(paginated.map(c => c.id)) : new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const requestDelete = (ids: string[]) => {
    setDeleteTarget(ids);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget);
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleBulkComplete = () => {
    selected.forEach(id => updateStatusMutation.mutate({ id, status: 'completed' }));
    setSelected(new Set());
  };

  const handleToggleStatus = (contact: Contact) => {
    const next: ContactStatus = contact.status === 'pending' ? 'completed' : 'pending';
    updateStatusMutation.mutate({ id: contact.id, status: next });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const allPageSelected = paginated.length > 0 && paginated.every(c => selected.has(c.id));
  const someSelected = selected.size > 0 && !allPageSelected;

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-[400px] rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center rounded-xl border border-destructive/30 bg-destructive/5">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive font-medium">حدث خطأ أثناء تحميل الرسائل</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">رسائل التواصل</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              إدارة الرسائل الواردة من العملاء
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsCards contacts={contacts} />

        {/* Table Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="بحث بالاسم، البريد، أو نوع الخدمة..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 shrink-0">
              {(['all', 'pending', 'completed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {s === 'all' ? 'الكل' : s === 'pending' ? 'قيد الانتظار' : 'مكتملة'}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-3 bg-primary/5 border-b border-primary/20 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Users className="w-4 h-4" />
                    <span>تم تحديد {selected.size} {selected.size === 1 ? 'رسالة' : 'رسائل'}</span>
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
                    <button
                      onClick={() => setSelected(new Set())}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table (desktop) / Cards (mobile) */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <Inbox className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">لا توجد رسائل{search ? ' تطابق بحثك' : ''}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {/* Checkbox */}
                      <th className="w-12 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={allPageSelected}
                          ref={el => { if (el) el.indeterminate = someSelected; }}
                          onChange={e => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </th>
                      <SortHeader label="الاسم" field="name" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <SortHeader label="الخدمة المطلوبة" field="projectType" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        معلومات التواصل
                      </th>
                      <SortHeader label="الحالة" field="status" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <SortHeader label="التاريخ" field="createdAt" current={sortField} dir={sortDir} onSort={toggleSort} />
                      <th className="w-24 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {paginated.map((contact, i) => (
                        <motion.tr
                          key={contact.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`border-b border-border/50 transition-colors cursor-pointer group
                            ${selected.has(contact.id) ? 'bg-primary/5' : 'hover:bg-muted/40'}
                          `}
                          onClick={() => setDetailContact(contact)}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selected.has(contact.id)}
                              onChange={e => handleSelectOne(contact.id, e.target.checked)}
                              className="w-4 h-4 rounded accent-primary cursor-pointer"
                            />
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {contact.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{contact.name}</span>
                            </div>
                          </td>

                          {/* Service */}
                          <td className="px-4 py-3">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">
                              {contact.projectType}
                            </span>
                          </td>

                          {/* Contact info */}
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate max-w-[180px]">{contact.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleStatus(contact)}
                              className="transition-transform hover:scale-105 active:scale-95"
                              title="اضغط لتغيير الحالة"
                            >
                              <StatusBadge status={contact.status ?? 'pending'} />
                            </button>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              {format(new Date(contact.createdAt), 'dd MMM yyyy', { locale: ar })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setDetailContact(contact)}
                                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                title="عرض التفاصيل"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => requestDelete([contact.id])}
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

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-border">
                {paginated.map((contact, i) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-4 transition-colors ${selected.has(contact.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(contact.id)}
                        onChange={e => handleSelectOne(contact.id, e.target.checked)}
                        className="w-4 h-4 mt-1 rounded accent-primary cursor-pointer"
                      />
                      <div className="flex-1 min-w-0" onClick={() => setDetailContact(contact)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm">{contact.name}</span>
                          </div>
                          <StatusBadge status={contact.status ?? 'pending'} />
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5" dir="ltr">
                            <Mail className="w-3 h-3" />{contact.email}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" />{contact.projectType}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(contact.createdAt), 'dd MMM yyyy', { locale: ar })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => requestDelete([contact.id])}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length} رسالة
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
                          page === p
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground'
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

      {/* Modals */}
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
        {detailContact && (
          <DetailModal contact={detailContact} onClose={() => setDetailContact(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Sort Header Helper ───────────────────────────────────────────────────────
const SortHeader: React.FC<{
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
}> = ({ label, field, current, dir, onSort }) => (
  <th className="px-4 py-3 text-right">
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
    >
      {label}
      <SortIcon field={field} current={current} dir={dir} />
    </button>
  </th>
);

export default DashboardContacts;
