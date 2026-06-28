import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SarurLogoProps {
  className?: string
  showText?: boolean
  size?: number
  href?: string | null
  tagline?: boolean
}

export function SarurLogo({
  className,
  showText = true,
  size = 40,
  href = '/',
  tagline = false,
}: SarurLogoProps) {
  const content = (
    <span className={cn('flex items-center gap-3', className)}>
      <span
        className="grid place-items-center rounded-2xl bg-paper shadow-paper-sm"
        style={{ width: size + 14, height: size + 14 }}
      >
        <Image
          src="/sarur-deer.png"
          alt="SARUR deer logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-[0.18em] text-ink">
            SARUR
          </span>
          {tagline && (
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Talent Meets Opportunity
            </span>
          )}
        </span>
      )}
    </span>
  )

  if (href) {
    return (
      <Link href={href} aria-label="SARUR home" className="inline-flex">
        {content}
      </Link>
    )
  }
  return content
}
