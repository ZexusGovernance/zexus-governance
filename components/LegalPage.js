import Link from 'next/link'
import Image from 'next/image'

// Shared layout for legal pages (Privacy, Terms) — styled to match the site.
export default function LegalPage({ title, intro, sections, lastUpdated }) {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#E7C694] selection:text-black overflow-x-hidden">
      {/* ambient backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0A0A0A] via-[#050505] to-[#050505]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-[600px] h-[400px] bg-[#E7C694]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* header */}
      <header className="relative z-10 px-6 pt-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-x-3 group">
            <Image
              src="/logo.png"
              alt="Zexus Logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
            />
            <div className="flex flex-col">
              <span className="text-base font-black text-white tracking-tighter leading-none transition-colors group-hover:text-[#E7C694]">
                ZEXUS
              </span>
              <span className="text-[9px] font-mono text-[#E7C694] tracking-[0.3em] uppercase opacity-80">
                Governance
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 hover:text-[#E7C694] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* content */}
      <article className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[#E7C694] font-mono tracking-[0.4em] uppercase text-[10px] mb-4 opacity-60">
            Legal
          </h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[10px] font-mono text-gray-600 tracking-wide uppercase mb-12">
              Last updated: {lastUpdated}
            </p>
          )}

          {intro && (
            <p className="text-base text-gray-300 leading-relaxed font-light mb-12">
              {intro}
            </p>
          )}

          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={i}>
                <h3 className="text-lg font-bold tracking-tight text-[#E7C694] mb-3">
                  {s.heading}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </article>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] tracking-[0.4em] text-gray-600 uppercase">
            © 2026 Zexus Protocol
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold hover:text-[#E7C694] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
