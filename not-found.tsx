import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-500/10 rounded-full">
            <Search className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-white mb-4">
          Page not found
        </h2>

        <p className="text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go home
          </Link>

          <Link
            href="/services"
            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
          >
            Browse services
          </Link>
        </div>
      </div>
    </div>
  )
}
