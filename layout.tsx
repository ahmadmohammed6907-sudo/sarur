import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sarur.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SARUR — Where Talent Meets Opportunity',
    template: '%s · SARUR',
  },
  description:
    'SARUR connects freelancers, agencies, and businesses in one premium ecosystem. Hire expert talent, buy professional services, or let our in-house team deliver your project end to end.',
  keywords: [
    'freelance platform',
    'hire freelancers',
    'managed services',
    'software development',
    'graphic design',
    'UI/UX design',
    'animation',
    'data analysis',
    'game development',
    'AI services',
  ],
  authors: [{ name: 'SARUR' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'SARUR — Where Talent Meets Opportunity',
    description: 'Freelancers, Agencies, and Businesses — Connected in One Ecosystem.',
    siteName: 'SARUR',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'SARUR — Where Talent Meets Opportunity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SARUR — Where Talent Meets Opportunity',
    description: 'Freelancers, Agencies, and Businesses — Connected in One Ecosystem.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon-deer.png',
    apple: '/favicon-deer.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f0e6' },
    { media: '(prefers-color-scheme: dark)', color: '#161a19' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
