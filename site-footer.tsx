import Link from 'next/link'
import { SarurLogo } from '@/components/sarur-logo'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Projects', href: '/projects' },
      { label: 'Explore Services', href: '/services' },
      { label: 'Find Freelancers', href: '/freelancers' },
      { label: 'Managed Solutions', href: '/managed' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/auth/login' },
      { label: 'Sign up', href: '/auth/register' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Become a seller', href: '/auth/register' },
    ],
  },
]

const SOCIALS = [
  { icon: Twitter, href: 'https://twitter.com/sarurapp', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/sarurapp', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/sarurapp', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@sarur.app', label: 'Email' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <SarurLogo className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Where Talent Meets Opportunity. Connect with top freelancers,
              agencies, and businesses in one premium ecosystem.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary shadow-paper-sm"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SARUR. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="#" className="text-xs text-muted-foreground hover:text-primary transition">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
