import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== Projects =====
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  images: text("images").array(),
  year: text("year").notNull(),
  country: text("country"),
  field: text("field"),
  package: text("package"),
  description: text("description"),
  strategy: text("strategy"),
  behanceUrl: text("behance_url"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// ===== Products =====
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false).notNull(),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// ===== Articles =====
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// ===== Identities =====
export const identities = pgTable("identities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  includes: text("includes").array().notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIdentitySchema = createInsertSchema(identities).omit({ id: true, createdAt: true });
export type InsertIdentity = z.infer<typeof insertIdentitySchema>;
export type Identity = typeof identities.$inferSelect;

// ===== Contacts =====
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// ===== Client Logos =====
export const clientLogos = pgTable("client_logos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientLogoSchema = createInsertSchema(clientLogos).omit({ id: true, createdAt: true });
export type InsertClientLogo = z.infer<typeof insertClientLogoSchema>;
export type ClientLogo = typeof clientLogos.$inferSelect;

// ===== Testimonials =====
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  rating: real("rating").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// ===== Questionnaire Submissions =====
export const questionnaireSubmissions = pgTable("questionnaire_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceType: text("service_type").notNull(),
  role: text("role").notNull(),
  projectInfo: text("project_info"),
  socialMedia: text("social_media"),
  companySize: text("company_size").notNull(),
  budget: text("budget").notNull(),
  contactMethod: text("contact_method").notNull(),
  email: text("email"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaireSubmissions).omit({ id: true, createdAt: true, status: true });
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type QuestionnaireSubmission = typeof questionnaireSubmissions.$inferSelect;

// ===== Users (for Replit Auth) =====
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ===== Sessions =====
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// ===== Courses =====
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  price: integer("price").notNull(),
  published: boolean("published").default(false).notNull(),
  totalHours: integer("total_hours"),
  devices: text("devices"),
  certificates: text("certificates"),
  courseInfo: text("course_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

// ===== Lessons =====
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  duration: integer("duration"),
  order: integer("order").notNull(),
  isFree: boolean("is_free").default(false).notNull(),
  attachments: jsonb("attachments").$type<Array<{name: string, url: string}>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// ===== Lesson Progress =====
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  userId: varchar("user_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  watchedSeconds: integer("watched_seconds").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({ id: true, createdAt: true });
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;

// ===== Course Reviews =====
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  userId: varchar("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseReviewSchema = createInsertSchema(courseReviews).omit({ id: true, createdAt: true });
export type InsertCourseReview = z.infer<typeof insertCourseReviewSchema>;
export type CourseReview = typeof courseReviews.$inferSelect;

// ===== Course Testimonials =====
export const courseTestimonials = pgTable("course_testimonials", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  title: text("title"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseTestimonialSchema = createInsertSchema(courseTestimonials).omit({ id: true, createdAt: true });
export type InsertCourseTestimonial = z.infer<typeof insertCourseTestimonialSchema>;
export type CourseTestimonial = typeof courseTestimonials.$inferSelect;

// ===== Course Enrollments =====
export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments).omit({ id: true, createdAt: true });
export type InsertCourseEnrollment = z.infer<typeof insertCourseEnrollmentSchema>;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
