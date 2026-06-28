/**
 * Image optimization utilities
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Generate optimized image URL
 */
export function getOptimizedImageUrl(
  url: string | null,
  options: ImageOptimizationOptions = {}
): string | null {
  if (!url) return null;

  const { width = 800, height = 600, quality = 80, format = 'webp' } = options;

  // If URL is already a data URL or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // If using Next.js Image Optimization API
  if (process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION === 'true') {
    const params = new URLSearchParams({
      url,
      w: width.toString(),
      q: quality.toString(),
      f: format,
    });
    return `/_next/image?${params.toString()}`;
  }

  return url;
}

/**
 * Get image srcSet for responsive images
 */
export function getImageSrcSet(url: string | null): string {
  if (!url) return '';

  const sizes = [320, 640, 960, 1280, 1920];
  const srcSet = sizes
    .map((size) => {
      const optimized = getOptimizedImageUrl(url, { width: size });
      return `${optimized} ${size}w`;
    })
    .join(', ');

  return srcSet;
}

/**
 * Get image sizes attribute for responsive images
 */
export function getImageSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Get placeholder image
 */
export function getPlaceholder(width: number = 800, height: number = 600): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect fill="#f3f4f6" width="${width}" height="${height}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="#9ca3af">
      Loading...
    </text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image format. Supported formats: JPEG, PNG, WebP, GIF',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      resolve(null);
    };

    img.src = url;
  });
}
