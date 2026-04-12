/**
 * Utility function to get the full URL for an image.
 * This handles relative paths (like /uploads/...) and external URLs.
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return "/placeholder-image.png"; // Make sure to have a placeholder in public folder
  }

  // If it's already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  // Ensure path starts with /
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // In production, the backend serves /uploads from the root
  // We don't need to append a base URL if we're using relative paths correctly
  return path;
}

/**
 * Utility to handle multiple images (for galleries)
 */
export function getGalleryImages(images: string[] | undefined | null): string[] {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }
  return images.map(getImageUrl);
}
