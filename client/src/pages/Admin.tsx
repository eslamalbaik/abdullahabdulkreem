import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, LayoutGrid, Package, Palette } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: string;
  description?: string;
  featured: boolean;
}

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  featured: boolean;
}

interface Identity {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  includes: string[];
  featured: boolean;
}

type Tab = "projects" | "products" | "identities";

export default function Admin() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
  });

  const { data: identities = [] } = useQuery<Identity[]>({
    queryKey: ["/api/identities"],
    enabled: isAuthenticated,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/projects"] }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/products"] }),
  });

  const deleteIdentityMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/identities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/identities"] }),
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">لوحة التحكم</h1>
          <p className="text-xl text-muted-foreground mb-8">
            يجب تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
          <a
            href="/api/login"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            data-testid="button-login"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "projects" as Tab, label: "الأعمال", icon: LayoutGrid },
    { id: "products" as Tab, label: "المنتجات", icon: Package },
    { id: "identities" as Tab, label: "الهويات", icon: Palette },
  ];

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      if (activeTab === "projects") deleteProjectMutation.mutate(id);
      if (activeTab === "products") deleteProductMutation.mutate(id);
      if (activeTab === "identities") deleteIdentityMutation.mutate(id);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground">
              مرحباً {user?.firstName || user?.email}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {activeTab === "projects" && "الأعمال"}
            {activeTab === "products" && "المنتجات"}
            {activeTab === "identities" && "الهويات البصرية"}
          </h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-add"
          >
            <Plus className="w-5 h-5" />
            إضافة جديد
          </button>
        </div>

        {activeTab === "projects" && (
          <div className="grid gap-4">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.category} • {project.year}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-edit-project-${project.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-project-${project.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "products" && (
          <div className="grid gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.price} ر.س
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-edit-product-${product.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-product-${product.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "identities" && (
          <div className="grid gap-4">
            {identities.map((identity) => (
              <motion.div
                key={identity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img
                  src={identity.image}
                  alt={identity.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{identity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {identity.price} ر.س
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(identity)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-edit-identity-${identity.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(identity.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-identity-${identity.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showForm && (
          <AdminForm
            type={activeTab}
            item={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function AdminForm({
  type,
  item,
  onClose,
}: {
  type: Tab;
  item: any;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!item;
  
  const [formData, setFormData] = useState(() => {
    if (type === "projects") {
      return {
        title: item?.title || "",
        category: item?.category || "",
        image: item?.image || "",
        year: item?.year || new Date().getFullYear().toString(),
        description: item?.description || "",
        featured: item?.featured || false,
      };
    } else if (type === "products") {
      return {
        title: item?.title || "",
        category: item?.category || "",
        price: item?.price || 0,
        image: item?.image || "",
        description: item?.description || "",
        featured: item?.featured || false,
      };
    } else {
      return {
        title: item?.title || "",
        description: item?.description || "",
        price: item?.price || 0,
        image: item?.image || "",
        includes: item?.includes?.join("\n") || "",
        featured: item?.featured || false,
      };
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = `/api/admin/${type}${isEditing ? `/${item.id}` : ""}`;
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let submitData = { ...formData };
    
    if (type === "identities") {
      submitData = {
        ...formData,
        includes: (formData as any).includes.split("\n").filter((s: string) => s.trim()),
      };
    }
    
    mutation.mutate(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-6">
          {isEditing ? "تعديل" : "إضافة"}{" "}
          {type === "projects" && "عمل"}
          {type === "products" && "منتج"}
          {type === "identities" && "هوية"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">العنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              data-testid="input-title"
            />
          </div>

          {type === "projects" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <input
                  type="text"
                  value={(formData as any).category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">السنة</label>
                <input
                  type="text"
                  value={(formData as any).year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-year"
                />
              </div>
            </>
          )}

          {type === "products" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">التصنيف</label>
                <input
                  type="text"
                  value={(formData as any).category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">السعر (ر.س)</label>
                <input
                  type="number"
                  value={(formData as any).price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-price"
                />
              </div>
            </>
          )}

          {type === "identities" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">السعر (ر.س)</label>
                <input
                  type="number"
                  value={(formData as any).price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">محتويات الهوية (كل عنصر في سطر)</label>
                <textarea
                  value={(formData as any).includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-32"
                  placeholder="الشعار الأساسي&#10;البطاقات الشخصية&#10;دليل الهوية"
                  required
                  data-testid="input-includes"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">رابط الصورة</label>
            <input
              type="url"
              value={(formData as any).image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              data-testid="input-image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الوصف</label>
            <textarea
              value={(formData as any).description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24"
              data-testid="input-description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={(formData as any).featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-border"
              data-testid="input-featured"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              مميز (يظهر في الصفحة الرئيسية)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              data-testid="button-submit"
            >
              {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              data-testid="button-cancel"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
