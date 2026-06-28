/**
 * SEO utilities for meta tags and structured data
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

/**
 * Generate meta tags
 */
export function generateMetaTags(metadata: SEOMetadata): Record<string, string> {
  return {
    'title': metadata.title,
    'description': metadata.description,
    'keywords': metadata.keywords?.join(', ') || '',
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:image': metadata.image || '',
    'og:url': metadata.url || '',
    'og:type': metadata.type || 'website',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    'twitter:image': metadata.image || '',
    'twitter:card': 'summary_large_image',
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(metadata: SEOMetadata): Record<string, unknown> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': metadata.type === 'article' ? 'Article' : 'WebPage',
    name: metadata.title,
    description: metadata.description,
    url: metadata.url,
    image: metadata.image,
  };

  if (metadata.type === 'article') {
    return {
      ...baseSchema,
      author: {
        '@type': 'Person',
        name: metadata.author,
      },
      datePublished: metadata.publishedDate,
      dateModified: metadata.modifiedDate,
    };
  }

  return baseSchema;
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SARUR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sarur.app',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sarur.app'}/logo.png`,
    description: 'SARUR connects freelancers, agencies, and businesses in one premium ecosystem.',
    sameAs: [
      'https://twitter.com/sarur',
      'https://facebook.com/sarur',
      'https://linkedin.com/company/sarur',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@sarur.app',
    },
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };
}

/**
 * Generate service schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  image: string;
  price: number;
  currency: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    image: service.image,
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.currency,
    },
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarur.app';
  return `${baseUrl}${path}`;
}
