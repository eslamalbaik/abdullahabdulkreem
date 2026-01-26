import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, LayoutGrid, Package, Palette, Image, Upload, X, Star, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useUpload } from "@/hooks/use-upload";

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

interface ClientLogo {
  id: number;
  name: string;
  image: string;
  order: number;
}

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
}

type Tab = "projects" | "products" | "identities" | "logos" | "testimonials";

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

  const { data: clientLogos = [] } = useQuery<ClientLogo[]>({
    queryKey: ["/api/client-logos"],
    enabled: isAuthenticated,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
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

  const deleteLogoMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/client-logos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/client-logos"] }),
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] }),
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
    { id: "logos" as Tab, label: "شعارات العملاء", icon: Image },
    { id: "testimonials" as Tab, label: "قالوا عن عبدالله", icon: MessageSquare },
  ];

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      if (activeTab === "projects") deleteProjectMutation.mutate(id);
      if (activeTab === "products") deleteProductMutation.mutate(id);
      if (activeTab === "identities") deleteIdentityMutation.mutate(id);
      if (activeTab === "logos") deleteLogoMutation.mutate(id);
      if (activeTab === "testimonials") deleteTestimonialMutation.mutate(id);
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
            {activeTab === "logos" && "شعارات العملاء"}
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

        {activeTab === "logos" && (
          <div className="grid gap-4">
            {clientLogos.map((logo) => (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="w-20 h-12 object-contain rounded-lg bg-white p-1"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{logo.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    الترتيب: {logo.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-edit-logo-${logo.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(logo.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-logo-${logo.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {clientLogos.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                لا توجد شعارات. أضف شعارات عملائك لتظهر في الصفحة الرئيسية.
              </p>
            )}
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRatingDisplay rating={testimonial.rating} />
                      <span className="text-sm text-muted-foreground">({testimonial.rating})</span>
                    </div>
                    <p className="text-foreground mb-2">"{testimonial.text}"</p>
                    <p className="text-sm text-muted-foreground">
                      — {testimonial.author}، {testimonial.role}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`button-edit-testimonial-${testimonial.id}`}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`button-delete-testimonial-${testimonial.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                لا توجد تعليقات. أضف تعليقات العملاء لتظهر في أسفل الصفحة الرئيسية.
              </p>
            )}
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

function StarRatingDisplay({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    } else if (i - 0.5 <= rating) {
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-yellow-500" />
          <div className="absolute overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const handleClick = (starIndex: number, isHalf: boolean) => {
    const rating = isHalf ? starIndex - 0.5 : starIndex;
    onChange(rating);
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <div 
          key={starIndex} 
          className="relative w-8 h-8 cursor-pointer"
          onMouseLeave={() => setHoverValue(null)}
        >
          <div 
            className="absolute inset-0 w-1/2 z-10"
            onMouseEnter={() => setHoverValue(starIndex - 0.5)}
            onClick={() => handleClick(starIndex, true)}
          />
          <div 
            className="absolute inset-0 right-0 w-1/2 mr-4 z-10"
            onMouseEnter={() => setHoverValue(starIndex)}
            onClick={() => handleClick(starIndex, false)}
          />
          {starIndex <= displayValue ? (
            <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
          ) : starIndex - 0.5 <= displayValue ? (
            <div className="relative w-8 h-8">
              <Star className="absolute w-8 h-8 text-yellow-500" />
              <div className="absolute overflow-hidden w-1/2">
                <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
              </div>
            </div>
          ) : (
            <Star className="w-8 h-8 text-gray-300 hover:text-yellow-300" />
          )}
        </div>
      ))}
      <span className="text-sm text-muted-foreground mr-2 self-center">({value})</span>
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  testId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onChange(response.objectPath);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative inline-block">
            <img 
              src={value.startsWith('/objects/') ? value : value} 
              alt="صورة" 
              className="w-24 h-24 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            data-testid={testId}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "جاري الرفع..." : "اختر صورة"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MultiImageUploadField({
  label,
  values,
  onChange,
  testId,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  testId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadCount({ current: 0, total: files.length });

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const response = await fetch("/api/uploads/request-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            contentType: file.type || "application/octet-stream",
          }),
        });

        if (!response.ok) throw new Error("Failed to get upload URL");

        const { uploadURL, objectPath } = await response.json();

        await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });

        setUploadCount(prev => ({ ...prev, current: prev.current + 1 }));
        return objectPath;
      } catch (error) {
        console.error("Upload failed for", file.name, error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((path): path is string => path !== null);
    
    if (successfulUploads.length > 0) {
      onChange([...values, ...successfulUploads]);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url.startsWith('/objects/') ? url : url} 
                  alt={`صورة ${index + 1}`} 
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
            data-testid={testId}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? `جاري رفع ${uploadCount.current}/${uploadCount.total} صور...` : "إضافة صور"}
          </button>
        </div>
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
        images: item?.images || [],
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
    } else if (type === "logos") {
      return {
        name: item?.name || "",
        image: item?.image || "",
        order: item?.order || 0,
      };
    } else if (type === "testimonials") {
      return {
        text: item?.text || "",
        author: item?.author || "",
        role: item?.role || "",
        rating: item?.rating || 5,
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
      const apiType = type === "logos" ? "client-logos" : type;
      const endpoint = `/api/admin/${apiType}${isEditing ? `/${item.id}` : ""}`;
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      const queryKey = type === "logos" ? "/api/client-logos" : `/api/${type}`;
      queryClient.invalidateQueries({ queryKey: [queryKey] });
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
          {type === "logos" && "شعار عميل"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "logos" ? (
            <div>
              <label className="block text-sm font-medium mb-2">اسم العميل</label>
              <input
                type="text"
                value={(formData as any).name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
                data-testid="input-name"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">العنوان</label>
              <input
                type="text"
                value={(formData as any).title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
                data-testid="input-title"
              />
            </div>
          )}

          {type === "logos" && (
            <div>
              <label className="block text-sm font-medium mb-2">الترتيب (رقم)</label>
              <input
                type="number"
                value={(formData as any).order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-order"
              />
            </div>
          )}

          {type === "logos" && (
            <ImageUploadField
              label="الشعار"
              value={(formData as any).image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              testId="input-logo-image"
            />
          )}

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

          {type === "testimonials" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">نص التعليق</label>
                <textarea
                  value={(formData as any).text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  required
                  data-testid="input-testimonial-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اسم العميل</label>
                <input
                  type="text"
                  value={(formData as any).author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-testimonial-author"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={(formData as any).role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-testimonial-role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">التقييم</label>
                <StarRatingInput
                  value={(formData as any).rating}
                  onChange={(rating) => setFormData({ ...formData, rating })}
                />
              </div>
            </>
          )}

          {type !== "logos" && type !== "testimonials" && (
            <>
              <ImageUploadField
                label="الصورة الرئيسية"
                value={(formData as any).image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                testId="input-image"
              />

              {type === "projects" && (
                <MultiImageUploadField
                  label="صور إضافية (اختياري)"
                  values={(formData as any).images || []}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  testId="input-images"
                />
              )}

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
            </>
          )}

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
