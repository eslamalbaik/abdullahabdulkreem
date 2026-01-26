import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Mail, MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface FormData {
  name: string;
  serviceType: string;
  role: string;
  projectInfo: string;
  socialMedia: string;
  companySize: string;
  budget: string;
  contactMethod: string;
  email: string;
  whatsapp: string;
  instagram: string;
}

const serviceOptions = [
  { id: "identity", label: "مشروع هويّة بصريّة" },
  { id: "strategy", label: "استراتيجيّة علامة تجارية" },
  { id: "landing", label: "صفحة هبوط" },
];

const roleOptions = [
  { id: "owner", label: "صاحب المشروع مباشرة" },
  { id: "government", label: "هيئة حكومية" },
  { id: "marketing", label: "مدير تسويق" },
  { id: "agency", label: "وكالة أو شركة تصميم" },
  { id: "client_client", label: "عميل لديه عميل" },
  { id: "influencer", label: "مؤثر أو شخصية عامة" },
  { id: "nonprofit", label: "منظمة غير ربحية أو جمعية" },
  { id: "other", label: "أخرى" },
];

const companySizeOptions = [
  { id: "solo", label: "شخص واحد" },
  { id: "small", label: "صغيرة: ٣-١٠ أفراد" },
  { id: "medium", label: "متوسّطة: ١٠-٢٥ فرد" },
  { id: "large", label: "كبيرة: ٢٥ وأكثر" },
];

const budgetOptions = [
  { id: "tier1", label: "٨٠٠ - ١,٠٠٠ دولار" },
  { id: "tier2", label: "١,٠٠٠ - ٢,٥٠٠ دولار" },
  { id: "tier3", label: "٢,٥٠٠ - ٥,٠٠٠ دولار" },
  { id: "tier4", label: "٥,٠٠٠ دولار وأكثر" },
];

export default function Questionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    serviceType: "",
    role: "",
    projectInfo: "",
    socialMedia: "",
    companySize: "",
    budget: "",
    contactMethod: "",
    email: "",
    whatsapp: "",
    instagram: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/questionnaire", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: () => {
      setSubmitError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    },
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return formData.serviceType !== "" && formData.role !== "";
      case 3:
        return true;
      case 4:
        return formData.companySize !== "" && formData.budget !== "";
      case 5:
        if (formData.contactMethod === "email") return formData.email.trim() !== "";
        if (formData.contactMethod === "whatsapp") return formData.whatsapp.trim() !== "";
        if (formData.contactMethod === "instagram") return formData.instagram.trim() !== "";
        return false;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              شكراً لك يا {formData.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              سأتواصل معك خلال أقل من يومين
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              التواصل مع عبدالله عبدالكريم
            </h1>
            <p className="text-muted-foreground">
              يمكنك ملء هذا الاستبيان، أو التواصل معي مباشرةً عبر البريد:{" "}
              <a href="mailto:abdullah.slwmhgd@gmail.com" className="text-primary hover:underline">
                abdullah.slwmhgd@gmail.com
              </a>
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i + 1 <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border p-8"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">ما اسمك؟</h2>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    data-testid="input-name"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      كيف يمكنني مساعدتك يا {formData.name}؟
                    </h2>
                    <div className="grid gap-3">
                      {serviceOptions.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, serviceType: option.id })}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-right ${
                            formData.serviceType === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`option-service-${option.id}`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      ما دورك يا {formData.name} في المشروع؟
                    </h2>
                    <div className="grid gap-3">
                      {roleOptions.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, role: option.id })}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-right ${
                            formData.role === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`option-role-${option.id}`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">هل يمكنك مشاركة معلومات عن مشروعك؟</h2>
                    <textarea
                      value={formData.projectInfo}
                      onChange={(e) => setFormData({ ...formData, projectInfo: e.target.value })}
                      placeholder="اكتب نبذة مختصرة عن مشروعك..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                      data-testid="input-project-info"
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                      هل لدى مشروعك موقع إلكتروني أو منصة تواصل اجتماعي يمكنني رؤيتها؟
                    </h2>
                    <input
                      type="text"
                      value={formData.socialMedia}
                      onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                      placeholder="رابط الموقع أو حساب التواصل الاجتماعي"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      data-testid="input-social-media"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">حجم شركتكم؟</h2>
                    <div className="grid gap-3">
                      {companySizeOptions.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, companySize: option.id })}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-right ${
                            formData.companySize === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`option-size-${option.id}`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">ما قيمة استثمارك في هذا العمل؟</h2>
                    <div className="grid gap-3">
                      {budgetOptions.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, budget: option.id })}
                          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-right ${
                            formData.budget === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          data-testid={`option-budget-${option.id}`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">كيف يمكننا التواصل؟ (اختر ما يناسبك)</h2>
                  <p className="text-sm text-muted-foreground">اختر طريقة التواصل المفضلة لديك وأدخل بياناتك</p>
                  
                  <div className="grid gap-4">
                    <div
                      className={`p-4 rounded-lg border transition-colors ${
                        formData.contactMethod === "email"
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          checked={formData.contactMethod === "email"}
                          onChange={() => setFormData({ ...formData, contactMethod: "email" })}
                          className="w-4 h-4"
                        />
                        <Mail className="w-5 h-5 text-primary" />
                        <span>البريد الإلكتروني</span>
                      </label>
                      {formData.contactMethod === "email" && (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="example@email.com"
                          className="w-full mt-3 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          data-testid="input-email"
                        />
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-lg border transition-colors ${
                        formData.contactMethod === "whatsapp"
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          checked={formData.contactMethod === "whatsapp"}
                          onChange={() => setFormData({ ...formData, contactMethod: "whatsapp" })}
                          className="w-4 h-4"
                        />
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <span>واتساب</span>
                      </label>
                      {formData.contactMethod === "whatsapp" && (
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="+966 5XX XXX XXXX"
                          className="w-full mt-3 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          data-testid="input-whatsapp"
                        />
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-lg border transition-colors ${
                        formData.contactMethod === "instagram"
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="contact"
                          checked={formData.contactMethod === "instagram"}
                          onChange={() => setFormData({ ...formData, contactMethod: "instagram" })}
                          className="w-4 h-4"
                        />
                        <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>انستغرام</span>
                      </label>
                      {formData.contactMethod === "instagram" && (
                        <input
                          type="text"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          placeholder="@username"
                          className="w-full mt-3 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          data-testid="input-instagram"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                  {submitError}
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    data-testid="button-back"
                  >
                    <ArrowRight className="w-5 h-5" />
                    الخلف
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-next"
                  >
                    التالي
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitMutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-submit"
                  >
                    {submitMutation.isPending ? "جاري الإرسال..." : "تأكيد"}
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
