import { useState, useCallback } from "react";
import type { UppyFile } from "@uppy/core";

interface UploadMetadata {
  name: string;
  size: number;
  contentType: string;
}

interface UploadResponse {
  uploadURL: string;
  objectPath: string;
  metadata?: UploadMetadata;
}

interface UseUploadOptions {
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * React hook for handling file uploads using standard FormData.
 * 
 * Replaces the old presigned-URL flow with a direct POST to /api/uploads.
 */
export function useUpload(options: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  /**
   * Upload a file directly using FormData (Multer).
   *
   * @param file - The file to upload
   * @returns The upload response containing the object path
   */
  const uploadFile = useCallback(
    async (file: File): Promise<UploadResponse | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("accessToken");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        setProgress(30);
        
        const response = await fetch("/api/uploads", {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to upload file");
        }

        const uploadResponse = await response.json();
        
        setProgress(100);
        options.onSuccess?.(uploadResponse);
        return uploadResponse;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  /**
   * Get upload parameters for Uppy's XHR/FormData plugin.
   * Note: Uppy's AWS S3 plugin shouldn't be used anymore since we removed presigned URLs.
   * If you still use Uppy, switch it to `@uppy/xhr-upload`.
   */
  const getUploadParameters = useCallback(
    async (
      _file: UppyFile<Record<string, unknown>, Record<string, unknown>>
    ): Promise<any> => {
      throw new Error("Presigned URL flow is obsolete. Use Uppy XHR Upload directly to /api/uploads.");
    },
    []
  );

  return {
    uploadFile,
    getUploadParameters,
    isUploading,
    error,
    progress,
  };
}
