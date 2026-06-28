'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Users } from 'lucide-react'

export interface HeroProps {
  featuredServices?: any[]
  topFreelancers?: any[]
}

export function Hero({ featuredServices = [], topFreelancers = [] }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-dark shadow-paper-sm"
          >
            <Sparkles className="size-3.5" />
            Where Talent Meets Opportunity
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Build, Design, Create — <span className="text-teal">All in One Place.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-ink/70"
          >
            Connect with top-tier freelancers, agencies, and businesses. Get your projects done with excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex gap-4"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-3 font-semibold text-white hover:bg-teal/90 transition-colors"
            >
              Post a Project <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5 transition-colors"
            >
              Browse Services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex items-center gap-6 text-sm text-ink/60"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-teal" />
              Secure Payments
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-teal" />
              Verified Talent
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-teal/20 to-cyan/20"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-ink/60 font-medium">Your next great project starts here</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
