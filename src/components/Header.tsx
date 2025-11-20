import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition-opacity"
            aria-label="TinyLink Home"
          >
            TinyLink
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-m font-medium hover:text-yellow-400 transition-colors"
            >
              Dashboard
            </Link>
            {/* future nav items can go here */}
          </nav>

          {/* mobile menu placeholder - keeps header balanced */}
          <div className="sm:hidden">
            <button
              type="button"
              aria-label="Open menu"
              className="p-2 rounded-md hover:bg-white/10 transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
