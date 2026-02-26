import { db } from "./db";
import { eq, asc, and } from "drizzle-orm";
import {
  projects, products, articles, identities, contacts, clientLogos, testimonials, questionnaireSubmissions,
  courses, lessons, lessonProgress, courseTestimonials, courseEnrollments,
  type Project, type InsertProject,
  type Product, type InsertProduct,
  type Article, type InsertArticle,
  type Identity, type InsertIdentity,
  type Contact, type InsertContact,
  type ClientLogo, type InsertClientLogo,
  type Testimonial, type InsertTestimonial,
  type QuestionnaireSubmission, type InsertQuestionnaire,
  type Course, type InsertCourse,
  type Lesson, type InsertLesson,
  type LessonProgress, type InsertLessonProgress,
  type CourseTestimonial, type InsertCourseTestimonial,
  type CourseEnrollment, type InsertCourseEnrollment,
  siteConfigs, type SiteConfig, type InsertSiteConfig
} from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;

  getIdentities(): Promise<Identity[]>;
  getIdentityById(id: number): Promise<Identity | undefined>;
  createIdentity(identity: InsertIdentity): Promise<Identity>;
  updateIdentity(id: number, identity: InsertIdentity): Promise<Identity>;
  deleteIdentity(id: number): Promise<void>;

  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  getClientLogos(): Promise<ClientLogo[]>;
  createClientLogo(logo: InsertClientLogo): Promise<ClientLogo>;
  updateClientLogo(id: number, logo: InsertClientLogo): Promise<ClientLogo>;
  deleteClientLogo(id: number): Promise<void>;

  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: InsertTestimonial): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  createQuestionnaireSubmission(submission: InsertQuestionnaire): Promise<QuestionnaireSubmission>;
  getQuestionnaireSubmissions(): Promise<QuestionnaireSubmission[]>;

  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: InsertCourse): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  getLessonsByCourseId(courseId: number): Promise<Lesson[]>;
  getLessonById(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: InsertLesson): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;

  getLessonProgress(lessonId: number, userId: string): Promise<LessonProgress | undefined>;
  getUserCourseProgress(courseId: number, userId: string): Promise<LessonProgress[]>;
  upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;

  getCourseTestimonials(courseId: number): Promise<CourseTestimonial[]>;
  createCourseTestimonial(testimonial: InsertCourseTestimonial): Promise<CourseTestimonial>;
  deleteCourseTestimonial(id: number): Promise<void>;
  updateCourseTestimonialReply(id: number, adminReply: string): Promise<CourseTestimonial>;

  getCourseEnrollment(courseId: number, userId: string): Promise<CourseEnrollment | undefined>;
  createCourseEnrollment(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment>;

  getSiteConfigs(): Promise<SiteConfig[]>;
  updateSiteConfig(key: string, value: string): Promise<SiteConfig>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(projects.createdAt);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.createdAt);
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, insertProject: InsertProject): Promise<Project> {
    const [project] = await db.update(projects).set(insertProject).where(eq(projects.id, id)).returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(products.createdAt);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category)).orderBy(products.createdAt);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.update(products).set(insertProduct).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getArticles(): Promise<Article[]> {
    return db.select().from(articles).where(eq(articles.published, true)).orderBy(articles.createdAt);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getIdentities(): Promise<Identity[]> {
    return db.select().from(identities).orderBy(identities.createdAt);
  }

  async getIdentityById(id: number): Promise<Identity | undefined> {
    const [identity] = await db.select().from(identities).where(eq(identities.id, id));
    return identity;
  }

  async createIdentity(insertIdentity: InsertIdentity): Promise<Identity> {
    const [identity] = await db.insert(identities).values(insertIdentity).returning();
    return identity;
  }

  async updateIdentity(id: number, insertIdentity: InsertIdentity): Promise<Identity> {
    const [identity] = await db.update(identities).set(insertIdentity).where(eq(identities.id, id)).returning();
    return identity;
  }

  async deleteIdentity(id: number): Promise<void> {
    await db.delete(identities).where(eq(identities.id, id));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async getClientLogos(): Promise<ClientLogo[]> {
    return db.select().from(clientLogos).orderBy(asc(clientLogos.order));
  }

  async createClientLogo(insertLogo: InsertClientLogo): Promise<ClientLogo> {
    const [logo] = await db.insert(clientLogos).values(insertLogo).returning();
    return logo;
  }

  async updateClientLogo(id: number, insertLogo: InsertClientLogo): Promise<ClientLogo> {
    const [logo] = await db.update(clientLogos).set(insertLogo).where(eq(clientLogos.id, id)).returning();
    return logo;
  }

  async deleteClientLogo(id: number): Promise<void> {
    await db.delete(clientLogos).where(eq(clientLogos.id, id));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).orderBy(testimonials.createdAt);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async updateTestimonial(id: number, insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.update(testimonials).set(insertTestimonial).where(eq(testimonials.id, id)).returning();
    return testimonial;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async createQuestionnaireSubmission(submission: InsertQuestionnaire): Promise<QuestionnaireSubmission> {
    const [result] = await db.insert(questionnaireSubmissions).values(submission).returning();
    return result;
  }

  async getQuestionnaireSubmissions(): Promise<QuestionnaireSubmission[]> {
    return db.select().from(questionnaireSubmissions).orderBy(questionnaireSubmissions.createdAt);
  }

  async getCourses(): Promise<Course[]> {
    return db.select().from(courses).orderBy(courses.createdAt);
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async updateCourse(id: number, insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.update(courses).set(insertCourse).where(eq(courses.id, id)).returning();
    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.courseId, id));
    await db.delete(courses).where(eq(courses.id, id));
  }

  async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.order));
  }

  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(insertLesson).returning();
    return lesson;
  }

  async updateLesson(id: number, insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.update(lessons).set(insertLesson).where(eq(lessons.id, id)).returning();
    return lesson;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessonProgress).where(eq(lessonProgress.lessonId, id));
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  async getLessonProgress(lessonId: number, userId: string): Promise<LessonProgress | undefined> {
    const [progress] = await db.select().from(lessonProgress)
      .where(and(eq(lessonProgress.lessonId, lessonId), eq(lessonProgress.userId, userId)));
    return progress;
  }

  async getUserCourseProgress(courseId: number, userId: string): Promise<LessonProgress[]> {
    const courseLessons = await this.getLessonsByCourseId(courseId);
    const lessonIds = courseLessons.map(l => l.id);
    if (lessonIds.length === 0) return [];

    const progress = await db.select().from(lessonProgress)
      .where(eq(lessonProgress.userId, userId));
    return progress.filter(p => lessonIds.includes(p.lessonId));
  }

  async upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const existing = await this.getLessonProgress(progress.lessonId, progress.userId);
    if (existing) {
      const [updated] = await db.update(lessonProgress)
        .set({ ...progress, completedAt: progress.completed ? new Date() : null })
        .where(eq(lessonProgress.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(lessonProgress)
      .values({ ...progress, completedAt: progress.completed ? new Date() : null })
      .returning();
    return created;
  }

  async getCourseTestimonials(courseId: number): Promise<CourseTestimonial[]> {
    return db.select().from(courseTestimonials)
      .where(eq(courseTestimonials.courseId, courseId))
      .orderBy(courseTestimonials.createdAt);
  }

  async createCourseTestimonial(testimonial: InsertCourseTestimonial): Promise<CourseTestimonial> {
    const [created] = await db.insert(courseTestimonials).values(testimonial).returning();
    return created;
  }

  async deleteCourseTestimonial(id: number): Promise<void> {
    await db.delete(courseTestimonials).where(eq(courseTestimonials.id, id));
  }

  async updateCourseTestimonialReply(id: number, adminReply: string): Promise<CourseTestimonial> {
    const [updated] = await db.update(courseTestimonials)
      .set({ adminReply })
      .where(eq(courseTestimonials.id, id))
      .returning();
    return updated;
  }

  async getCourseEnrollment(courseId: number, userId: string): Promise<CourseEnrollment | undefined> {
    const [enrollment] = await db.select().from(courseEnrollments)
      .where(and(eq(courseEnrollments.courseId, courseId), eq(courseEnrollments.userId, userId)));
    return enrollment;
  }

  async createCourseEnrollment(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const [created] = await db.insert(courseEnrollments).values(enrollment).returning();
    return created;
  }

  async getSiteConfigs(): Promise<SiteConfig[]> {
    return db.select().from(siteConfigs);
  }

  async updateSiteConfig(key: string, value: string): Promise<SiteConfig> {
    const [config] = await db
      .insert(siteConfigs)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteConfigs.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return config;
  }
}

export const storage = new DatabaseStorage();
