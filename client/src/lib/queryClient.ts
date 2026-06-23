import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * يحوّل الخطأ القادم من apiRequest (بصيغة "STATUS: body") إلى رسالة عربية مفهومة.
 */
export function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "حدث خطأ غير متوقع، حاول مرة أخرى";

  const raw = error.message;
  const sep = raw.indexOf(": ");
  const status = sep >= 0 ? raw.slice(0, sep) : "";
  const body = sep >= 0 ? raw.slice(sep + 2) : raw;

  // أخطاء الشبكة
  if (raw.includes("Failed to fetch") || raw.includes("NetworkError")) {
    return "تعذّر الاتصال بالخادم. تأكد من اتصالك وحاول مجدداً";
  }
  if (status === "401") return "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى";
  if (status === "403") return "ليس لديك صلاحية لهذا الإجراء";
  if (status === "404") return "العنصر غير موجود";

  // محاولة قراءة رسالة JSON من الخادم
  try {
    const parsed = JSON.parse(body);
    if (parsed?.error) {
      if (Array.isArray(parsed.details) && parsed.details.length) {
        const fields = parsed.details
          .map((d: any) => d?.message || (Array.isArray(d?.path) ? d.path.join(".") : ""))
          .filter(Boolean)
          .join("، ");
        return fields ? `${parsed.error}: ${fields}` : parsed.error;
      }
      return parsed.error;
    }
  } catch {
    /* ليس JSON */
  }

  return body || "حدث خطأ، حاول مرة أخرى";
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
