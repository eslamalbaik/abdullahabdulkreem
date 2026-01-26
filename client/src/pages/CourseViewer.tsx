import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Lock, Play, Download, ChevronRight, ArrowRight } from "lucide-react";
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

interface LessonProgress {
  id: number;
  lessonId: number;
  userId: string;
  completed: boolean;
  watchedSeconds: number;
}

export default function CourseViewer() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const isLessonAccessible = (lesson: Lesson) => {
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
      if (nextLesson && isLessonAccessible(nextLesson)) {
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

  if (authLoading) {
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
          <h1 className="text-4xl font-bold mb-6">مشاهدة الدورة</h1>
          <p className="text-xl text-muted-foreground mb-8">
            يجب تسجيل الدخول لمشاهدة الدورات التعليمية
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

  if (!course) {
    return (
      <div className="pt-32 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/courses" className="hover:text-foreground transition-colors">الدورات</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              {currentLesson?.videoUrl ? (
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

            {currentLesson && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground mb-1 block">الدرس {currentLesson.order}</span>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  </div>
                  {!currentLessonProgress?.completed && (
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

                {currentLessonProgress?.completed && (
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
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border sticky top-24">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-lg mb-2">محتوى الدورة</h3>
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
              </div>

              <div className="divide-y divide-border max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons.map((lesson) => {
                  const lessonProgress = progress.find(p => p.lessonId === lesson.id);
                  const isAccessible = isLessonAccessible(lesson);
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
                        <h4 className={`font-medium truncate ${isActive ? "text-primary" : ""}`}>
                          {lesson.title}
                        </h4>
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
