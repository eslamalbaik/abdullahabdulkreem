import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Lock, Play, Download, ChevronRight, ArrowRight, Star, Monitor, Award, Clock, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Link, useParams } from "wouter";

interface Course {
  id: number;
  title: string;
  description?: string;
  image?: string;
  price: number;
  published: boolean;
  totalHours?: number;
  devices?: string;
  certificates?: string;
  courseInfo?: string;
}

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isFree: boolean;
  attachments?: Array<{name: string, url: string}>;
}

interface LessonProgress {
  id: number;
  lessonId: number;
  userId: string;
  completed: boolean;
  watchedSeconds: number;
}

interface Testimonial {
  id: number;
  courseId: number;
  name: string;
  image?: string;
  title?: string;
  rating: number;
  comment: string;
}

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'devices' | 'certificates' | 'hours'>('info');

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: courseId > 0,
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: [`/api/courses/${courseId}/lessons`],
    enabled: courseId > 0,
  });

  const { data: progress = [] } = useQuery<LessonProgress[]>({
    queryKey: [`/api/courses/${courseId}/progress`],
    enabled: courseId > 0 && isAuthenticated,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: [`/api/courses/${courseId}/testimonials`],
    enabled: courseId > 0,
  });

  const { data: enrollmentData } = useQuery<{ enrolled: boolean }>({
    queryKey: [`/api/courses/${courseId}/enrollment`],
    enabled: courseId > 0 && isAuthenticated,
  });

  const isEnrolled = enrollmentData?.enrolled || false;

  const enrollMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/courses/${courseId}/enroll`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/enrollment`] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ lessonId, completed, watchedSeconds }: { lessonId: number; completed: boolean; watchedSeconds: number }) =>
      apiRequest("POST", `/api/lessons/${lessonId}/progress`, { completed, watchedSeconds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/progress`] });
    },
  });

  useEffect(() => {
    if (lessons.length > 0 && !currentLessonId) {
      const firstUncompletedLesson = lessons.find(lesson => {
        const lessonProgress = progress.find(p => p.lessonId === lesson.id);
        return !lessonProgress?.completed;
      });
      setCurrentLessonId(firstUncompletedLesson?.id || lessons[0].id);
    }
  }, [lessons, progress, currentLessonId]);

  const currentLesson = lessons.find(l => l.id === currentLessonId);
  const currentLessonProgress = progress.find(p => p.lessonId === currentLessonId);

  const canAccessLesson = (lesson: Lesson) => {
    if (lesson.isFree) return true;
    if (!isAuthenticated) return false;
    if (!isEnrolled) return false;
    if (lesson.order === 1) return true;
    const previousLesson = lessons.find(l => l.order === lesson.order - 1);
    if (!previousLesson) return true;
    const previousProgress = progress.find(p => p.lessonId === previousLesson.id);
    return previousProgress?.completed || false;
  };

  const completedCount = progress.filter(p => p.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const handleMarkComplete = () => {
    if (currentLessonId && isAuthenticated) {
      updateProgressMutation.mutate({
        lessonId: currentLessonId,
        completed: true,
        watchedSeconds: currentLessonProgress?.watchedSeconds || 0,
      });
    }
  };

  const handleNextLesson = () => {
    if (currentLesson) {
      const nextLesson = lessons.find(l => l.order === currentLesson.order + 1);
      if (nextLesson && canAccessLesson(nextLesson)) {
        setCurrentLessonId(nextLesson.id);
      }
    }
  };

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") 
        ? url.split("/").pop() 
        : new URLSearchParams(new URL(url).search).get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "0";

  if (authLoading) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const showLoginPrompt = currentLesson && !currentLesson.isFree && (!isAuthenticated || !isEnrolled);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/courses" className="hover:text-foreground transition-colors">الدورات</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {showLoginPrompt ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/80 bg-gradient-to-br from-primary/20 to-black">
                  <Lock className="w-16 h-16 mb-4" />
                  {!isAuthenticated ? (
                    <>
                      <p className="text-xl mb-4">هذا الدرس يتطلب تسجيل الدخول</p>
                      <a
                        href="/api/login"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        data-testid="button-login-video"
                      >
                        تسجيل الدخول
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="text-xl mb-4">اشترك في الدورة للوصول لهذا الدرس</p>
                      <button
                        onClick={() => enrollMutation.mutate()}
                        disabled={enrollMutation.isPending}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        data-testid="button-enroll-video"
                      >
                        {enrollMutation.isPending ? "جاري التسجيل..." : `اشترك الآن - ${course?.price} ر.س`}
                      </button>
                    </>
                  )}
                </div>
              ) : currentLesson?.videoUrl ? (
                <iframe
                  src={getVideoEmbedUrl(currentLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50">
                  <Play className="w-16 h-16" />
                </div>
              )}
            </div>

            {currentLesson && !showLoginPrompt && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">الدرس {currentLesson.order}</span>
                      {currentLesson.isFree && (
                        <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">مجاني</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  </div>
                  {isAuthenticated && !currentLessonProgress?.completed && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={updateProgressMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      data-testid="button-mark-complete"
                    >
                      <Check className="w-4 h-4" />
                      {updateProgressMutation.isPending ? "جاري الحفظ..." : "إتمام الدرس"}
                    </button>
                  )}
                  {currentLessonProgress?.completed && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-lg font-medium">
                      <Check className="w-4 h-4" />
                      مكتمل
                    </div>
                  )}
                </div>

                {currentLesson.description && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">{currentLesson.description}</p>
                )}

                {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3">المرفقات</h3>
                    <div className="space-y-2">
                      {currentLesson.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                          data-testid={`attachment-${index}`}
                        >
                          <Download className="w-5 h-5 text-primary" />
                          <span>{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {isAuthenticated && currentLessonProgress?.completed && (
                  <div className="border-t border-border pt-4 mt-4">
                    <button
                      onClick={handleNextLesson}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full justify-center"
                      data-testid="button-next-lesson"
                    >
                      الدرس التالي
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${activeTab === 'info' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'hover:bg-secondary/50'}`}
                  data-testid="tab-info"
                >
                  <Info className="w-4 h-4" />
                  معلومات الدورة
                </button>
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${activeTab === 'devices' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'hover:bg-secondary/50'}`}
                  data-testid="tab-devices"
                >
                  <Monitor className="w-4 h-4" />
                  الأجهزة
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${activeTab === 'certificates' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'hover:bg-secondary/50'}`}
                  data-testid="tab-certificates"
                >
                  <Award className="w-4 h-4" />
                  الشهادات
                </button>
                <button
                  onClick={() => setActiveTab('hours')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${activeTab === 'hours' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'hover:bg-secondary/50'}`}
                  data-testid="tab-hours"
                >
                  <Clock className="w-4 h-4" />
                  عدد الساعات
                </button>
              </div>
              <div className="p-6">
                {activeTab === 'info' && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">عن الدورة</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.courseInfo || course.description || "لا توجد معلومات إضافية عن هذه الدورة."}
                    </p>
                  </div>
                )}
                {activeTab === 'devices' && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">الأجهزة والبرامج المطلوبة</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.devices || "لا توجد متطلبات خاصة لهذه الدورة."}
                    </p>
                  </div>
                )}
                {activeTab === 'certificates' && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">الشهادات</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.certificates || "ستحصل على شهادة إتمام عند إنهاء جميع الدروس."}
                    </p>
                  </div>
                )}
                {activeTab === 'hours' && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">مدة الدورة</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.totalHours ? `${course.totalHours} ساعة تعليمية` : "مدة الدورة غير محددة بعد."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      عدد الدروس: {lessons.length} درس
                    </p>
                  </div>
                )}
              </div>
            </div>

            {testimonials.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">تقييمات الدورة</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${parseFloat(averageRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg">{averageRating}</span>
                    <span className="text-muted-foreground">({testimonials.length} تقييم)</span>
                  </div>
                </div>

                <h4 className="font-semibold text-lg mb-4">قالوا عن الكورس</h4>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-secondary/30 rounded-xl"
                      data-testid={`testimonial-${testimonial.id}`}
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
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${testimonial.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed mt-2">{testimonial.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-bold text-lg mb-3">التسجيل في الدورة</h3>
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">سجل دخولك للاشتراك في الدورة والوصول لجميع الدروس</p>
                  <a
                    href="/api/login"
                    className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors"
                    data-testid="button-login-enroll"
                  >
                    تسجيل الدخول للاشتراك
                  </a>
                  <p className="text-center text-lg font-bold">{course?.price} ر.س</p>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600 bg-green-500/10 p-3 rounded-lg">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">أنت مسجل في هذه الدورة</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{progressPercentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} من {lessons.length} درس مكتمل
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">اشترك الآن للوصول لجميع الدروس وتتبع تقدمك</p>
                  <button
                    onClick={() => enrollMutation.mutate()}
                    disabled={enrollMutation.isPending}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    data-testid="button-enroll"
                  >
                    {enrollMutation.isPending ? "جاري التسجيل..." : "اشترك الآن"}
                  </button>
                  <p className="text-center text-lg font-bold">{course?.price} ر.س</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border sticky top-24">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-lg mb-2">محتوى الدورة</h3>
                {isAuthenticated && isEnrolled && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{progressPercentage}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {completedCount} من {lessons.length} درس مكتمل
                    </p>
                  </>
                )}
              </div>

              <div className="divide-y divide-border max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons.map((lesson) => {
                  const lessonProgress = progress.find(p => p.lessonId === lesson.id);
                  const isAccessible = canAccessLesson(lesson);
                  const isActive = lesson.id === currentLessonId;
                  const isCompleted = lessonProgress?.completed;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => isAccessible && setCurrentLessonId(lesson.id)}
                      disabled={!isAccessible}
                      className={`w-full p-4 text-right flex items-start gap-3 transition-colors ${
                        isActive 
                          ? "bg-primary/10" 
                          : isAccessible 
                            ? "hover:bg-secondary/50" 
                            : "opacity-50 cursor-not-allowed"
                      }`}
                      data-testid={`lesson-item-${lesson.id}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted 
                          ? "bg-green-500 text-white" 
                          : isActive 
                            ? "bg-primary text-primary-foreground" 
                            : isAccessible
                              ? "border-2 border-border"
                              : "bg-secondary"
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : !isAccessible ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{lesson.order}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium truncate ${isActive ? "text-primary" : ""}`}>
                            {lesson.title}
                          </h4>
                          {lesson.isFree && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded shrink-0">مجاني</span>
                          )}
                        </div>
                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(lesson.duration / 60)} دقيقة
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
