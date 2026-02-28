import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, LayoutGrid, Package, Palette, Image, Upload, X, Star, MessageSquare, GraduationCap, Play, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useUpload } from "@/hooks/use-upload";

interface Course {
  id: number;
  title: string;
  description?: string;
  image?: string;
  price: number;
  published: boolean;
}

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  attachments?: Array<{name: string, url: string}>;
}

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

type Tab = "projects" | "products" | "identities" | "logos" | "testimonials" | "courses";

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

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
    enabled: isAuthenticated,
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLessonsManager, setShowLessonsManager] = useState(false);
  const [showTestimonialsManager, setShowTestimonialsManager] = useState(false);

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

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/courses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] }),
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
    { id: "courses" as Tab, label: "الدورات", icon: GraduationCap },
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
      if (activeTab === "courses") deleteCourseMutation.mutate(id);
    }
  };

  const handleManageLessons = (course: Course) => {
    setSelectedCourse(course);
    setShowLessonsManager(true);
  };

  const handleManageTestimonials = (course: Course) => {
    setSelectedCourse(course);
    setShowTestimonialsManager(true);
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
            {activeTab === "testimonials" && "قالوا عن عبدالله"}
            {activeTab === "courses" && "الدورات التعليمية"}
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
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                )}
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
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                )}
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
                {identity.image ? (
                  <img
                    src={identity.image}
                    alt={identity.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                )}
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
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="w-20 h-12 object-contain rounded-lg bg-white p-1"
                  />
                ) : (
                  <div className="w-20 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">بدون صورة</div>
                )}
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

        {activeTab === "courses" && (
          <div className="grid gap-4">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                )}
                {!course.image && (
                  <div className="w-20 h-16 bg-secondary rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.price} ر.س • {course.published ? "منشور" : "مسودة"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleManageLessons(course)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    data-testid={`button-lessons-course-${course.id}`}
                  >
                    <Play className="w-4 h-4" />
                    الدروس
                  </button>
                  <button
                    onClick={() => handleManageTestimonials(course)}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    data-testid={`button-testimonials-course-${course.id}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    التقييمات
                  </button>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-edit-course-${course.id}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-course-${course.id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                لا توجد دورات. أضف دورات تعليمية لتظهر في صفحة الدورات.
              </p>
            )}
          </div>
        )}

        {showLessonsManager && selectedCourse && (
          <LessonsManager
            course={selectedCourse}
            onClose={() => {
              setShowLessonsManager(false);
              setSelectedCourse(null);
            }}
          />
        )}

        {showTestimonialsManager && selectedCourse && (
          <CourseTestimonialsManager
            course={selectedCourse}
            onClose={() => {
              setShowTestimonialsManager(false);
              setSelectedCourse(null);
            }}
          />
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
            {value && <img 
              src={value} 
              alt="صورة" 
              className="w-24 h-24 object-cover rounded-lg border border-border"
            />}
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
                {url && <img 
                  src={url} 
                  alt={`صورة ${index + 1}`} 
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />}
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
    } else if (type === "courses") {
      return {
        title: item?.title || "",
        description: item?.description || "",
        price: item?.price || 0,
        image: item?.image || "",
        published: item?.published || false,
        totalHours: item?.totalHours || null,
        devices: item?.devices || "",
        certificates: item?.certificates || "",
        courseInfo: item?.courseInfo || "",
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
      const queryKey = type === "logos" ? "/api/client-logos" : type === "courses" ? "/api/admin/courses" : `/api/${type}`;
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
          {type === "testimonials" && "تعليق"}
          {type === "courses" && "دورة"}
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

          {type === "courses" && (
            <>
              <ImageUploadField
                label="صورة الدورة"
                value={(formData as any).image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                testId="input-course-image"
              />
              <div>
                <label className="block text-sm font-medium mb-2">السعر (ر.س)</label>
                <input
                  type="number"
                  value={(formData as any).price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-course-price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  value={(formData as any).description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  data-testid="input-course-description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عدد الساعات</label>
                <input
                  type="number"
                  value={(formData as any).totalHours || ""}
                  onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) || null })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: 10"
                  data-testid="input-course-hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الأجهزة المدعومة</label>
                <input
                  type="text"
                  value={(formData as any).devices || ""}
                  onChange={(e) => setFormData({ ...formData, devices: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: كمبيوتر، جوال، تابلت"
                  data-testid="input-course-devices"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الشهادات</label>
                <input
                  type="text"
                  value={(formData as any).certificates || ""}
                  onChange={(e) => setFormData({ ...formData, certificates: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: شهادة إتمام الدورة"
                  data-testid="input-course-certificates"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">معلومات إضافية</label>
                <textarea
                  value={(formData as any).courseInfo || ""}
                  onChange={(e) => setFormData({ ...formData, courseInfo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  placeholder="معلومات تفصيلية عن الدورة"
                  data-testid="input-course-info"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={(formData as any).published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                  data-testid="input-course-published"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  منشور (يظهر في صفحة الدورات)
                </label>
              </div>
            </>
          )}

          {type !== "logos" && type !== "testimonials" && type !== "courses" && (
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

function LessonsManager({ course, onClose }: { course: Course; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: [`/api/admin/courses/${course.id}/lessons`],
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/lessons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${course.id}/lessons`] }),
  });

  const handleDeleteLesson = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الدرس؟")) {
      deleteLessonMutation.mutate(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">دروس: {course.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => { setEditingLesson(null); setShowLessonForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mb-4"
          data-testid="button-add-lesson"
        >
          <Plus className="w-5 h-5" />
          إضافة درس
        </button>

        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {lesson.order}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {lesson.duration ? `${Math.floor(lesson.duration / 60)} دقيقة` : "بدون مدة"} 
                  {lesson.videoUrl && " • فيديو متاح"}
                  {lesson.attachments && lesson.attachments.length > 0 && ` • ${lesson.attachments.length} مرفق`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingLesson(lesson); setShowLessonForm(true); }}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`button-edit-lesson-${lesson.id}`}
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  data-testid={`button-delete-lesson-${lesson.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {lessons.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              لا توجد دروس. أضف دروس لهذه الدورة.
            </p>
          )}
        </div>

        {showLessonForm && (
          <LessonForm
            courseId={course.id}
            lesson={editingLesson}
            nextOrder={lessons.length + 1}
            onClose={() => { setShowLessonForm(false); setEditingLesson(null); }}
          />
        )}
      </motion.div>
    </div>
  );
}

interface CourseTestimonial {
  id: number;
  courseId: number;
  userId?: string;
  name: string;
  image?: string;
  title?: string;
  rating: number;
  comment: string;
  adminReply?: string;
}

function CourseTestimonialsManager({ course, onClose }: { course: Course; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: testimonials = [] } = useQuery<CourseTestimonial[]>({
    queryKey: [`/api/courses/${course.id}/testimonials`],
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, adminReply }: { id: number; adminReply: string }) =>
      apiRequest("PATCH", `/api/admin/testimonials/${id}/reply`, { adminReply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${course.id}/testimonials`] });
      setReplyingTo(null);
      setReplyText("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/course-testimonials/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/courses/${course.id}/testimonials`] }),
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleReply = (id: number) => {
    if (replyText.trim()) {
      replyMutation.mutate({ id, adminReply: replyText });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">تقييمات: {course.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد تقييمات لهذه الدورة بعد.
            </p>
          ) : (
            testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 bg-secondary/30 rounded-xl"
                data-testid={`admin-testimonial-${testimonial.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary shrink-0">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h5 className="font-semibold">{testimonial.name}</h5>
                        {testimonial.title && (
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${testimonial.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mt-2">{testimonial.comment}</p>
                    
                    {testimonial.adminReply ? (
                      <div className="mt-3 pr-4 border-r-2 border-primary/50 bg-primary/5 rounded-lg p-3">
                        <p className="text-sm font-semibold text-primary mb-1">ردك:</p>
                        <p className="text-sm text-muted-foreground">{testimonial.adminReply}</p>
                      </div>
                    ) : replyingTo === testimonial.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="اكتب ردك هنا..."
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                          data-testid={`input-reply-${testimonial.id}`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(testimonial.id)}
                            disabled={replyMutation.isPending || !replyText.trim()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
                            data-testid={`button-send-reply-${testimonial.id}`}
                          >
                            {replyMutation.isPending ? "جاري الإرسال..." : "إرسال الرد"}
                          </button>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(testimonial.id)}
                        className="mt-3 text-sm text-primary hover:underline"
                        data-testid={`button-reply-${testimonial.id}`}
                      >
                        الرد على التعليق
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function LessonForm({
  courseId,
  lesson,
  nextOrder,
  onClose,
}: {
  courseId: number;
  lesson: Lesson | null;
  nextOrder: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!lesson;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [formData, setFormData] = useState({
    courseId,
    title: lesson?.title || "",
    description: lesson?.description || "",
    videoUrl: lesson?.videoUrl || "",
    duration: lesson?.duration || 0,
    order: lesson?.order || nextOrder,
    attachments: lesson?.attachments || [],
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isEditing ? `/api/admin/lessons/${lesson.id}` : "/api/admin/lessons";
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${courseId}/lessons`] });
      onClose();
    },
  });

  const handleAddAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
      await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream" } });
      
      setFormData({
        ...formData,
        attachments: [...formData.attachments, { name: file.name, url: objectPath }],
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleAddLink = () => {
    if (linkName.trim() && linkUrl.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, { name: linkName.trim(), url: linkUrl.trim() }],
      });
      setLinkName("");
      setLinkUrl("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-6">
          {isEditing ? "تعديل" : "إضافة"} درس
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">عنوان الدرس</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              data-testid="input-lesson-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">وصف الدرس</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-24"
              data-testid="input-lesson-description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رابط الفيديو</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://..."
              data-testid="input-lesson-video"
            />
            <p className="text-xs text-muted-foreground mt-1">يمكنك استخدام روابط YouTube أو Vimeo أو أي رابط فيديو مباشر</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">المدة (بالثواني)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-lesson-duration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الترتيب</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-lesson-order"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">المرفقات</label>
            <div className="space-y-3">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                  <Download className="w-4 h-4" />
                  <span className="flex-1 text-sm truncate">{attachment.name}</span>
                  <a 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    عرض
                  </a>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-xs text-muted-foreground">إضافة رابط خارجي (مثل Google Drive)</p>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="اسم المرفق"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  data-testid="input-attachment-name"
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="رابط المرفق (https://...)"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  dir="ltr"
                  data-testid="input-attachment-url"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!linkName.trim() || !linkUrl.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  data-testid="button-add-link"
                >
                  <Plus className="w-4 h-4" />
                  إضافة رابط
                </button>
              </div>
              
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">أو رفع ملف مباشرة</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAddAttachment}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "جاري الرفع..." : "رفع ملف"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              data-testid="button-submit-lesson"
            >
              {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              data-testid="button-cancel-lesson"
            >
              إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
