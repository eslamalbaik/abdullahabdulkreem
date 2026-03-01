import {
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
  type SiteConfig
} from "@shared/schema.js";

import ProjectModel from "./models/Project.js";
import ArticleModel from "./models/Article.js";
import IdentityModel from "./models/Identity.js";
import ContactModel from "./models/Contact.js";
import ClientLogoModel from "./models/ClientLogo.js";
import TestimonialModel from "./models/Testimonial.js";
import QuestionnaireModel from "./models/QuestionnaireSubmission.js";
import CourseModel from "./models/Course.js";
import LessonModel from "./models/Lesson.js";
import LessonProgressModel from "./models/LessonProgress.js";
import CourseTestimonialModel from "./models/CourseTestimonial.js";
import CourseEnrollmentModel from "./models/CourseEnrollment.js";
import SiteConfigModel from "./models/SiteConfig.js";
import ProductModel from "./models/Product.js";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: string | number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string | number, project: InsertProject): Promise<Project>;
  deleteProject(id: string | number): Promise<void>;

  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: string | number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string | number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: string | number): Promise<void>;

  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;

  getIdentities(): Promise<Identity[]>;
  getIdentityById(id: string | number): Promise<Identity | undefined>;
  createIdentity(identity: InsertIdentity): Promise<Identity>;
  updateIdentity(id: string | number, identity: InsertIdentity): Promise<Identity>;
  deleteIdentity(id: string | number): Promise<void>;

  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  getClientLogos(): Promise<ClientLogo[]>;
  createClientLogo(logo: InsertClientLogo): Promise<ClientLogo>;
  updateClientLogo(id: string | number, logo: InsertClientLogo): Promise<ClientLogo>;
  deleteClientLogo(id: string | number): Promise<void>;

  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string | number, testimonial: InsertTestimonial): Promise<Testimonial>;
  deleteTestimonial(id: string | number): Promise<void>;

  createQuestionnaireSubmission(submission: InsertQuestionnaire): Promise<QuestionnaireSubmission>;
  getQuestionnaireSubmissions(): Promise<QuestionnaireSubmission[]>;

  getCourses(): Promise<Course[]>;
  getCourseById(id: string | number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string | number, course: InsertCourse): Promise<Course>;
  deleteCourse(id: string | number): Promise<void>;

  getLessonsByCourseId(courseId: string | number): Promise<Lesson[]>;
  getLessonById(id: string | number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string | number, lesson: InsertLesson): Promise<Lesson>;
  deleteLesson(id: string | number): Promise<void>;

  getLessonProgress(lessonId: string | number, userId: string): Promise<LessonProgress | undefined>;
  getUserCourseProgress(courseId: string | number, userId: string): Promise<LessonProgress[]>;
  upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;

  getCourseTestimonials(courseId: string | number): Promise<CourseTestimonial[]>;
  createCourseTestimonial(testimonial: InsertCourseTestimonial): Promise<CourseTestimonial>;
  deleteCourseTestimonial(id: string | number): Promise<void>;
  updateCourseTestimonialReply(id: string | number, adminReply: string): Promise<CourseTestimonial>;

  getCourseEnrollment(courseId: string | number, userId: string): Promise<CourseEnrollment | undefined>;
  createCourseEnrollment(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment>;

  getSiteConfigs(): Promise<SiteConfig[]>;
  updateSiteConfig(key: string, value: string): Promise<SiteConfig>;
}

export class DatabaseStorage implements IStorage {
  private mapDoc<T>(doc: any): T {
    if (!doc) return doc;
    const obj = doc.toObject ? doc.toObject() : doc;
    return { ...obj, id: obj._id.toString() } as T;
  }

  async getProjects(): Promise<Project[]> {
    const docs = await ProjectModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Project>(d));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const docs = await ProjectModel.find({ featured: true }).sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Project>(d));
  }

  async getProjectById(id: string | number): Promise<Project | undefined> {
    const doc = await ProjectModel.findById(id);
    return doc ? this.mapDoc<Project>(doc) : undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const doc = await ProjectModel.create(insertProject);
    return this.mapDoc<Project>(doc);
  }

  async updateProject(id: string | number, insertProject: InsertProject): Promise<Project> {
    const doc = await ProjectModel.findByIdAndUpdate(id, insertProject, { new: true });
    if (!doc) throw new Error("Project not found");
    return this.mapDoc<Project>(doc);
  }

  async deleteProject(id: string | number): Promise<void> {
    await ProjectModel.findByIdAndDelete(id);
  }

  async getProducts(): Promise<Product[]> {
    const docs = await ProductModel.find({ isDeleted: false }).sort({ createdAt: 1 });
    return docs.map(d => ({
      ...d.toObject(),
      id: d._id.toString(),
      title: (d as any).name || (d as any).title
    } as unknown as Product));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const docs = await ProductModel.find({ category, isDeleted: false }).sort({ createdAt: 1 });
    return docs.map(d => ({
      ...d.toObject(),
      id: d._id.toString(),
      title: (d as any).name || (d as any).title
    } as unknown as Product));
  }

  async getProductById(id: string | number): Promise<Product | undefined> {
    const doc = await ProductModel.findById(id);
    return doc ? {
      ...doc.toObject(),
      id: doc._id.toString(),
      title: (doc as any).name || (doc as any).title
    } as unknown as Product : undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const doc = await ProductModel.create({
      ...insertProduct,
      name: insertProduct.title
    });
    return {
      ...doc.toObject(),
      id: doc._id.toString(),
      title: (doc as any).name || (doc as any).title
    } as unknown as Product;
  }

  async updateProduct(id: string | number, insertProduct: InsertProduct): Promise<Product> {
    const doc = await ProductModel.findByIdAndUpdate(id, {
      ...insertProduct,
      name: insertProduct.title
    }, { new: true });
    if (!doc) throw new Error("Product not found");
    return {
      ...doc.toObject(),
      id: doc._id.toString(),
      title: (doc as any).name || (doc as any).title
    } as unknown as Product;
  }

  async deleteProduct(id: string | number): Promise<void> {
    await ProductModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
  }

  async getArticles(): Promise<Article[]> {
    const docs = await ArticleModel.find({ published: true }).sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Article>(d));
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const doc = await ArticleModel.findOne({ slug });
    return doc ? this.mapDoc<Article>(doc) : undefined;
  }

  async getIdentities(): Promise<Identity[]> {
    const docs = await IdentityModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Identity>(d));
  }

  async getIdentityById(id: string | number): Promise<Identity | undefined> {
    const doc = await IdentityModel.findById(id);
    return doc ? this.mapDoc<Identity>(doc) : undefined;
  }

  async createIdentity(insertIdentity: InsertIdentity): Promise<Identity> {
    const doc = await IdentityModel.create(insertIdentity);
    return this.mapDoc<Identity>(doc);
  }

  async updateIdentity(id: string | number, insertIdentity: InsertIdentity): Promise<Identity> {
    const doc = await IdentityModel.findByIdAndUpdate(id, insertIdentity, { new: true });
    if (!doc) throw new Error("Identity not found");
    return this.mapDoc<Identity>(doc);
  }

  async deleteIdentity(id: string | number): Promise<void> {
    await IdentityModel.findByIdAndDelete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const doc = await ContactModel.create(insertContact);
    return this.mapDoc<Contact>(doc);
  }

  async getContacts(): Promise<Contact[]> {
    const docs = await ContactModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Contact>(d));
  }

  async getClientLogos(): Promise<ClientLogo[]> {
    const docs = await ClientLogoModel.find().sort({ order: 1 });
    return docs.map(d => this.mapDoc<ClientLogo>(d));
  }

  async createClientLogo(insertLogo: InsertClientLogo): Promise<ClientLogo> {
    const doc = await ClientLogoModel.create(insertLogo);
    return this.mapDoc<ClientLogo>(doc);
  }

  async updateClientLogo(id: string | number, insertLogo: InsertClientLogo): Promise<ClientLogo> {
    const doc = await ClientLogoModel.findByIdAndUpdate(id, insertLogo, { new: true });
    if (!doc) throw new Error("ClientLogo not found");
    return this.mapDoc<ClientLogo>(doc);
  }

  async deleteClientLogo(id: string | number): Promise<void> {
    await ClientLogoModel.findByIdAndDelete(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    const docs = await TestimonialModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Testimonial>(d));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const doc = await TestimonialModel.create(insertTestimonial);
    return this.mapDoc<Testimonial>(doc);
  }

  async updateTestimonial(id: string | number, insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const doc = await TestimonialModel.findByIdAndUpdate(id, insertTestimonial, { new: true });
    if (!doc) throw new Error("Testimonial not found");
    return this.mapDoc<Testimonial>(doc);
  }

  async deleteTestimonial(id: string | number): Promise<void> {
    await TestimonialModel.findByIdAndDelete(id);
  }

  async createQuestionnaireSubmission(submission: InsertQuestionnaire): Promise<QuestionnaireSubmission> {
    const doc = await QuestionnaireModel.create(submission);
    return this.mapDoc<QuestionnaireSubmission>(doc);
  }

  async getQuestionnaireSubmissions(): Promise<QuestionnaireSubmission[]> {
    const docs = await QuestionnaireModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<QuestionnaireSubmission>(d));
  }

  async getCourses(): Promise<Course[]> {
    const docs = await CourseModel.find().sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<Course>(d));
  }

  async getCourseById(id: string | number): Promise<Course | undefined> {
    const doc = await CourseModel.findById(id);
    return doc ? this.mapDoc<Course>(doc) : undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const doc = await CourseModel.create(insertCourse);
    return this.mapDoc<Course>(doc);
  }

  async updateCourse(id: string | number, insertCourse: InsertCourse): Promise<Course> {
    const doc = await CourseModel.findByIdAndUpdate(id, insertCourse, { new: true });
    if (!doc) throw new Error("Course not found");
    return this.mapDoc<Course>(doc);
  }

  async deleteCourse(id: string | number): Promise<void> {
    await LessonModel.deleteMany({ courseId: id });
    await CourseModel.findByIdAndDelete(id);
  }

  async getLessonsByCourseId(courseId: string | number): Promise<Lesson[]> {
    const docs = await LessonModel.find({ courseId }).sort({ order: 1 });
    return docs.map(d => this.mapDoc<Lesson>(d));
  }

  async getLessonById(id: string | number): Promise<Lesson | undefined> {
    const doc = await LessonModel.findById(id);
    return doc ? this.mapDoc<Lesson>(doc) : undefined;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const doc = await LessonModel.create(insertLesson);
    return this.mapDoc<Lesson>(doc);
  }

  async updateLesson(id: string | number, insertLesson: InsertLesson): Promise<Lesson> {
    const doc = await LessonModel.findByIdAndUpdate(id, insertLesson, { new: true });
    if (!doc) throw new Error("Lesson not found");
    return this.mapDoc<Lesson>(doc);
  }

  async deleteLesson(id: string | number): Promise<void> {
    await LessonProgressModel.deleteMany({ lessonId: id });
    await LessonModel.findByIdAndDelete(id);
  }

  async getLessonProgress(lessonId: string | number, userId: string): Promise<LessonProgress | undefined> {
    const doc = await LessonProgressModel.findOne({ lessonId, userId });
    return doc ? this.mapDoc<LessonProgress>(doc) : undefined;
  }

  async getUserCourseProgress(courseId: string | number, userId: string): Promise<LessonProgress[]> {
    const courseLessons = await this.getLessonsByCourseId(courseId);
    const lessonIds = courseLessons.map(l => l.id);
    if (lessonIds.length === 0) return [];

    const docs = await LessonProgressModel.find({ userId, lessonId: { $in: lessonIds } });
    return docs.map(d => this.mapDoc<LessonProgress>(d));
  }

  async upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const doc = await LessonProgressModel.findOneAndUpdate(
      { lessonId: progress.lessonId, userId: progress.userId },
      { ...progress, completedAt: progress.completed ? new Date() : null },
      { upsert: true, new: true }
    );
    return this.mapDoc<LessonProgress>(doc);
  }

  async getCourseTestimonials(courseId: string | number): Promise<CourseTestimonial[]> {
    const docs = await CourseTestimonialModel.find({ courseId }).sort({ createdAt: 1 });
    return docs.map(d => this.mapDoc<CourseTestimonial>(d));
  }

  async createCourseTestimonial(testimonial: InsertCourseTestimonial): Promise<CourseTestimonial> {
    const doc = await CourseTestimonialModel.create(testimonial);
    return this.mapDoc<CourseTestimonial>(doc);
  }

  async deleteCourseTestimonial(id: string | number): Promise<void> {
    await CourseTestimonialModel.findByIdAndDelete(id);
  }

  async updateCourseTestimonialReply(id: string | number, adminReply: string): Promise<CourseTestimonial> {
    const doc = await CourseTestimonialModel.findByIdAndUpdate(id, { adminReply }, { new: true });
    if (!doc) throw new Error("Testimonial not found");
    return this.mapDoc<CourseTestimonial>(doc);
  }

  async getCourseEnrollment(courseId: string | number, userId: string): Promise<CourseEnrollment | undefined> {
    const doc = await CourseEnrollmentModel.findOne({ courseId, userId });
    return doc ? this.mapDoc<CourseEnrollment>(doc) : undefined;
  }

  async createCourseEnrollment(enrollment: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const doc = await CourseEnrollmentModel.create(enrollment);
    return this.mapDoc<CourseEnrollment>(doc);
  }

  async getSiteConfigs(): Promise<SiteConfig[]> {
    const docs = await SiteConfigModel.find();
    return docs.map(d => this.mapDoc<SiteConfig>(d));
  }

  async updateSiteConfig(key: string, value: string): Promise<SiteConfig> {
    const doc = await SiteConfigModel.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return this.mapDoc<SiteConfig>(doc);
  }
}

export const storage = new DatabaseStorage();
