import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useUpload } from '@/hooks/use-upload';

/**
 * Multi-image upload field.
 * Lets the admin pick one or more images at once (any image format), uploads
 * each through the presigned-URL flow, and keeps an ordered array of object paths.
 */
export function MultiImageUploadField({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  testId?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const { uploadFile } = useUpload();

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadingCount((c) => c + files.length);
    // Upload in parallel, then append successful paths in their original order
    const results = await Promise.all(files.map((f) => uploadFile(f)));
    const newPaths = results
      .filter((r): r is NonNullable<typeof r> => !!r)
      .map((r) => r.objectPath);
    if (newPaths.length > 0) {
      onChange([...value, ...newPaths]);
    }
    setUploadingCount((c) => Math.max(0, c - files.length));

    // Reset the input so selecting the same file again re-triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isUploading = uploadingCount > 0;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((url, index) => (
              <div key={`${url}-${index}`} className="relative inline-block">
                <img
                  src={url}
                  alt={`صورة ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesChange}
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
            {isUploading ? 'جاري الرفع...' : 'إضافة صور'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          يمكنك اختيار أكثر من صورة دفعة واحدة — جميع صيغ الصور مدعومة
        </p>
      </div>
    </div>
  );
}

export default MultiImageUploadField;
