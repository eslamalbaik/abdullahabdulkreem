import { z } from "zod";

// ===== Helpers =====
const idSchema = z.union([z.number(), z.string()]);

// ===== Projects =====
export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
  images: z.array(z.string()).default([]),
  year: z.string().min(1, "Year is required"),
  country: z.string().optional(),
  field: z.string().optional(),
  package: z.string().optional(),
  description: z.string().optional(),
  strategy: z.string().optional(),
  behanceUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export interface Project extends InsertProject {
  id: string | number;
  createdAt: Date | string;
}

// ===== Products =====
export const insertProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().min(1, "Image is required"),
  images: z.array(z.string()).default([]),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export interface Product extends InsertProduct {
  id: string | number;
  createdAt: Date | string;
}

// ===== Articles =====
export const insertArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  readTime: z.string().min(1, "Read time is required"),
  published: z.boolean().default(false),
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export interface Article extends InsertArticle {
  id: string | number;
  createdAt: Date | string;
}

// ===== Identities =====
export const insertIdentitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0),
  image: z.string().min(1, "Image is required"),
  images: z.array(z.string()).default([]),
  includes: z.array(z.string()),
  featured: z.boolean().default(false),
});

export type InsertIdentity = z.infer<typeof insertIdentitySchema>;
export interface Identity extends InsertIdentity {
  id: string | number;
  createdAt: Date | string;
}

// ===== Contacts =====
export const insertContactSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  projectType: z.string().min(1, "نوع المشروع مطلوب"),
  message: z.string().min(1, "الرسالة مطلوبة"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export interface Contact extends InsertContact {
  id: string | number;
  createdAt: Date | string;
}

// ===== Client Logos =====
export const insertClientLogoSchema = z.object({
  name: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  order: z.number().default(0),
});

export type InsertClientLogo = z.infer<typeof insertClientLogoSchema>;
export interface ClientLogo extends InsertClientLogo {
  id: string | number;
  createdAt: Date | string;
}

// ===== Testimonials =====
export const insertTestimonialSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
  rating: z.number().min(0).max(5).default(5),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export interface Testimonial extends InsertTestimonial {
  id: string | number;
  createdAt: Date | string;
}

// ===== Questionnaire Submissions =====
export const insertQuestionnaireSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  role: z.string().min(1, "الصفة الوظيفية مطلوبة"),
  projectInfo: z.string().optional(),
  socialMedia: z.string().optional(),
  companySize: z.string().min(1, "حجم الشركة مطلوب"),
  budget: z.string().min(1, "الميزانية مطلوبة"),
  contactMethod: z.string().min(1, "وسيلة التواصل مطلوبة"),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
});

export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export interface QuestionnaireSubmission extends InsertQuestionnaire {
  id: string | number;
  status: string;
  createdAt: Date | string;
}

// ===== Users =====
export interface User {
  id: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور الجديدة غير متطابقة",
  path: ["confirmPassword"],
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;

// ===== Courses =====
export const insertCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().min(0),
  published: z.boolean().default(false),
  totalHours: z.number().optional(),
  devices: z.string().optional(),
  certificates: z.string().optional(),
  courseInfo: z.string().optional(),
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export interface Course extends InsertCourse {
  id: string | number;
  createdAt: Date | string;
}

// ===== Lessons =====
export const insertLessonSchema = z.object({
  courseId: idSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().optional(),
  order: z.number(),
  isFree: z.boolean().default(false),
  attachments: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export interface Lesson extends InsertLesson {
  id: string | number;
  createdAt: Date | string;
}

// ===== Lesson Progress =====
export const insertLessonProgressSchema = z.object({
  lessonId: idSchema,
  userId: z.string(),
  completed: z.boolean().default(false),
  watchedSeconds: z.number().default(0),
});

export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export interface LessonProgress extends InsertLessonProgress {
  id: string | number;
  completedAt?: Date | string | null;
  createdAt: Date | string;
}

// ===== Course Reviews =====
export const insertCourseReviewSchema = z.object({
  courseId: idSchema,
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export interface CourseReview extends InsertCourseReview {
  id: string | number;
  createdAt: Date | string;
}

// ===== Course Testimonials =====
export const insertCourseTestimonialSchema = z.object({
  courseId: idSchema,
  userId: z.string().optional(),
  name: z.string().min(1),
  image: z.string().optional(),
  title: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
  adminReply: z.string().optional(),
});

export type InsertCourseTestimonial = z.infer<typeof insertCourseTestimonialSchema>;
export interface CourseTestimonial extends InsertCourseTestimonial {
  id: string | number;
  createdAt: Date | string;
}

// ===== Course Enrollments =====
export const insertCourseEnrollmentSchema = z.object({
  courseId: idSchema,
  userId: z.string(),
});

export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
export interface CourseEnrollment extends InsertCourseEnrollment {
  id: string | number;
  createdAt: Date | string;
}

// ===== Site Configuration =====
export const insertSiteConfigSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export interface SiteConfig extends InsertSiteConfig {
  updatedAt?: Date | string | null;
}

// ===== Dynamic Questionnaire System =====
export const questionTypeSchema = z.enum(["text", "paragraph", "number", "select", "checkbox", "radio"]);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const insertDynamicQuestionnaireSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  slug: z.string().min(1, "الرابط المختصر مطلوب"),
});

export type InsertDynamicQuestionnaire = z.infer<typeof insertDynamicQuestionnaireSchema>;
export interface DynamicQuestionnaire extends InsertDynamicQuestionnaire {
  id: string;
  createdAt: Date | string;
}

export const insertDynamicQuestionSchema = z.object({
  questionnaireId: z.string(),
  type: questionTypeSchema,
  label: z.string().min(1, "نص السؤال مطلوب"),
  description: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  order: z.number().default(0),
});

export type InsertDynamicQuestion = z.infer<typeof insertDynamicQuestionSchema>;
export interface DynamicQuestion extends InsertDynamicQuestion {
  id: string;
  createdAt: Date | string;
}

export const insertDynamicResponseSchema = z.object({
  questionnaireId: z.string(),
  answers: z.record(z.string(), z.any()),
});

export type InsertDynamicResponse = z.infer<typeof insertDynamicResponseSchema>;
export interface DynamicResponse extends InsertDynamicResponse {
  id: string;
  submittedAt: Date | string;
}

