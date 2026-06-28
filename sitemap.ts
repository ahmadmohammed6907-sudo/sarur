import type { MetadataRoute } from 'next'
import { db } from '@/db'
import { services, projects, users } from '@/db/schema'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sarur.app'

const STATIC_ROUTES = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/projects', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/freelancers', priority: 0.8, changeFrequency: 'daily' as const },
  { path: '/managed', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/affiliate', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  try {
    // Dynamic routes from database
    const [serviceList, projectList, freelancerList] = await Promise.all([
      db.select({ id: services.id, createdAt: services.createdAt }).from(services).limit(1000),
      db.select({ id: projects.id, createdAt: projects.createdAt }).from(projects).limit(1000),
      db.select({ id: users.id, createdAt: users.createdAt }).from(users).limit(1000),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...serviceList.map((service) => ({
        url: `${BASE_URL}/services/${service.id}`,
        lastModified: service.createdAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...projectList.map((project) => ({
        url: `${BASE_URL}/projects/${project.id}`,
        lastModified: project.createdAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...freelancerList.map((freelancer) => ({
        url: `${BASE_URL}/freelancers/${freelancer.id}`,
        lastModified: freelancer.createdAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error)
    return staticRoutes
  }
}
