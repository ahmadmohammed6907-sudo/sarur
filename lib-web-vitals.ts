/**
 * Web Vitals monitoring utilities
 */

export interface WebVitalsMetrics {
  // Largest Contentful Paint
  lcp?: number;
  // First Input Delay
  fid?: number;
  // Cumulative Layout Shift
  cls?: number;
  // First Contentful Paint
  fcp?: number;
  // Time to First Byte
  ttfb?: number;
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(metrics: WebVitalsMetrics): void {
  // Send metrics to analytics service
  if (typeof window !== 'undefined' && 'navigator' in window) {
    // Example: Send to Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
      });

      if (metrics.lcp) {
        (window as any).gtag('event', 'page_view', {
          event_category: 'web_vitals',
          event_label: 'LCP',
          value: Math.round(metrics.lcp),
        });
      }

      if (metrics.fid) {
        (window as any).gtag('event', 'page_view', {
          event_category: 'web_vitals',
          event_label: 'FID',
          value: Math.round(metrics.fid),
        });
      }

      if (metrics.cls) {
        (window as any).gtag('event', 'page_view', {
          event_category: 'web_vitals',
          event_label: 'CLS',
          value: Math.round(metrics.cls * 1000) / 1000,
        });
      }
    }

    // Send to custom analytics endpoint
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.href,
          metrics,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }
  }
}

/**
 * Measure performance metrics
 */
export function measurePerformance(): WebVitalsMetrics {
  const metrics: WebVitalsMetrics = {};

  if (typeof window !== 'undefined' && 'performance' in window) {
    const perfData = window.performance.timing;
    const perfNav = window.performance.navigation;

    // Time to First Byte
    if (perfData.responseStart > 0 && perfData.fetchStart > 0) {
      metrics.ttfb = perfData.responseStart - perfData.fetchStart;
    }

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Silently fail
      }
    }
  }

  return metrics;
}

/**
 * Performance thresholds (in milliseconds)
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint
  FID: 100, // First Input Delay
  CLS: 0.1, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint
  TTFB: 600, // Time to First Byte
};

/**
 * Check if metrics are within thresholds
 */
export function isWithinThresholds(metrics: WebVitalsMetrics): boolean {
  if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.LCP) {
    return false;
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.FID) {
    return false;
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.CLS) {
    return false;
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_THRESHOLDS.FCP) {
    return false;
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_THRESHOLDS.TTFB) {
    return false;
  }

  return true;
}
