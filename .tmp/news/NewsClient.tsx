'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { NewsPost } from '@/types'

const CATEGORIES = ['All', 'Press', 'Donations', 'Art & Culture']
const PAGE_SIZE = 9

function catLabel(cat?: string): string {
  const map: Record<string, string> = {
    press: 'Press', Press: 'Press',
    donations: 'Donations', Donations: 'Donations',
    'art-culture': 'Art & Culture',
    'Art & Culture': 'Art & Culture',
    news: 'Art & Culture',
  }
  return map[cat ?? ''] ?? cat ?? 'News'
}

function fmtDate(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  return `${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}.${String(dt.getFullYear()).slice(-2)}`
}

function fmtDateLong(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
}

function excerpt(post: NewsPost): string {
  if (post.seo?.metaDescription) return post.seo.metaDescription
  if (post.body) {
    const t = post.body.replace(/<[^>]+>/g, '')
    return t.length > 160 ? t.slice(0, 160) + '…' : t
  }
  return ''
}

function matchesCat(post: NewsPost, filter: string) {
  return filter === 'All' || catLabel(post.category) === filter
}

function ghostPos(clientX: number, clientY: number) {
  const W = 264, H = 200
  return {
    left: clientX + W + 24 > window.innerWidth ? clientX - W - 16 : clientX + 20,
    top: clientY + H > window.innerHeight ? clientY - H - 8 : clientY + 16,
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NewsClient({ posts }: { posts: NewsPost[] }) {
  const router = useRouter()
  const [activeCat, setActiveCat] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hoveredPost, setHoveredPost] = useState<NewsPost | null>(null)

  // Ghost card position/visibility controlled entirely via DOM ref — no re-renders on mousemove
  const ghostRef = useRef<HTMLDivElement>(null)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', '#f9f9f9')
    return () => document.documentElement.style.setProperty('--page-bg', '#FFD200')
  }, [])

  // Trail cursor position (runs only when hovering a card)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ghostRef.current
      if (!el || !isHoveringRef.current) return
      const { left, top } = ghostPos(e.clientX, e.clientY)
      el.style.left = `${left}px`
      el.style.top = `${top}px`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleCardEnter = useCallback((e: React.MouseEvent, post: NewsPost) => {
    isHoveringRef.current = true
    setHoveredPost(post)
    const el = ghostRef.current
    if (!el) return
    // 1. Snap to cursor without any transition
    const { left, top } = ghostPos(e.clientX, e.clientY)
    el.style.transition = 'none'
    el.style.transform = 'scale(0.82)'
    el.style.opacity = '0'
    el.style.left = `${left}px`
    el.style.top = `${top}px`
    // 2. Force layout flush so the snap registers before we re-enable transitions
    void el.getBoundingClientRect()
    // 3. Animate in from current position (scale pop + fade)
    el.style.transition = [
      'left 0.07s cubic-bezier(0.22,1,0.36,1)',
      'top 0.07s cubic-bezier(0.22,1,0.36,1)',
      'opacity 0.16s ease',
      'transform 0.24s cubic-bezier(0.34,1.56,0.64,1)',
    ].join(', ')
    el.style.opacity = '1'
    el.style.transform = 'scale(1)'
  }, [])

  const handleCardLeave = useCallback(() => {
    isHoveringRef.current = false
    setHoveredPost(null)
    const el = ghostRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'scale(0.82)'
  }, [])

  const handleCardClick = useCallback((e: React.MouseEvent, slug: string) => {
    e.preventDefault()
    handleCardLeave()

    // Black dot expands to full screen immediately on click — no delay, no page dependency
    const { clientX: x, clientY: y } = e
    const overlay = document.createElement('div')
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '9999',
      background: '#1a1c1c', pointerEvents: 'none',
      clipPath: `circle(0px at ${x}px ${y}px)`,
    })
    document.body.appendChild(overlay)

    const expand = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(200vmax at ${x}px ${y}px)` },
      ],
      { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
    )

    // Once the dot covers the screen, fade it out to reveal the loaded page
    expand.addEventListener('finish', () => {
      overlay
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' })
        .addEventListener('finish', () => overlay.remove())
    })

    router.push(`/news/${slug}`)
  }, [router, handleCardLeave])

  const featured = posts[0]
  const rest = posts.slice(1)

  const filtered = useMemo(() =>
    rest.filter(p => matchesCat(p, activeCat) && (!search || p.title.toLowerCase().includes(search.toLowerCase())))
  , [rest, activeCat, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pagePosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      {/* Ghost card — always in DOM; position + opacity driven via ref */}
      <div
        ref={ghostRef}
        style={{
          position: 'fixed',
          width: '264px',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          transform: 'scale(0.82)',
          transformOrigin: 'top left',
          zIndex: 9000,
          pointerEvents: 'none',
          transition: 'opacity 0.16s ease, transform 0.24s ease',
        }}
        className="border-2 border-[#1a1c1c] bg-[#1a1c1c] text-[#f9f9f9] p-5 shadow-[6px_6px_0_#ffd700]"
      >
        {hoveredPost && (
          <>
            <div className="flex justify-between items-start mb-4">
              <span
                className="text-[#ffd700] uppercase font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px' }}>
                {catLabel(hoveredPost.category)}
              </span>
              <span className="opacity-50" style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px' }}>
                {fmtDate(hoveredPost.publishedAt)}
              </span>
            </div>
            <h4
              className="uppercase mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-sora)', fontSize: '13px', fontWeight: 700 }}>
              {hoveredPost.title}
            </h4>
            <p
              className="opacity-60"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '12px',
                lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
              {excerpt(hoveredPost)}
            </p>
            <div className="mt-4 pt-3 border-t border-[#ffffff20] flex justify-between items-center">
              <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                Read Article
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </div>
          </>
        )}
      </div>

      <main className="max-w-[1200px] mx-auto px-6 md:px-20">

        {/* ── Featured ── */}
        {featured && (
          <section className="py-16 border-b-2 border-[#1a1c1c]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-12 mb-8">
                <span className="bg-[#ffd700] text-[#705e00] px-3 py-1 inline-block mb-4"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  FEATURED EDITORIAL
                </span>
                <h1 className="leading-none uppercase mb-8"
                  style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800 }}>
                  {featured.title}
                </h1>
              </div>

              {featured.cover?.url && (
                <div className="md:col-span-8 group relative overflow-hidden bg-[#eeeeee] border-2 border-[#1a1c1c]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.cover.url}
                    alt={featured.cover.alternativeText ?? featured.title}
                    className="w-full aspect-[16/9] object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}

              <div className={`${featured.cover?.url ? 'md:col-span-4' : 'md:col-span-12'} flex flex-col justify-end h-full`}>
                <p className="mb-6 leading-relaxed italic"
                  style={{ fontFamily: 'var(--font-hanken)', fontSize: '16px' }}>
                  &ldquo;{excerpt(featured)}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t-2 border-[#1a1c1c] pt-6">
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700 }}>
                    {fmtDateLong(featured.publishedAt)}
                  </span>
                  <span className="w-2 h-2 bg-[#705d00]" />
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase' }}>
                    {catLabel(featured.category)}
                  </span>
                </div>
                <Link
                  href={`/news/${featured.slug}`}
                  onClick={(e) => handleCardClick(e, featured.slug)}
                  className="mt-8 self-start px-8 py-3 bg-[#1a1c1c] text-[#f9f9f9] font-bold uppercase border-2 border-[#1a1c1c] transition-all hover:bg-[#ffd700] hover:text-[#1a1c1c]"
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                  Read Editorial
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Category filter ── */}
        <section className="py-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1a1c1c]">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setPage(1) }}
                className="px-6 py-1 border-2 border-[#1a1c1c] transition-colors whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontWeight: activeCat === cat ? 700 : 400,
                  backgroundColor: activeCat === cat ? '#1a1c1c' : 'transparent',
                  color: activeCat === cat ? '#f9f9f9' : '#1a1c1c',
                }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border-2 border-[#1a1c1c] px-4 py-1 bg-[#f9f9f9]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="SEARCH ARCHIVE"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent border-none focus:ring-0 focus:outline-none placeholder:opacity-40 w-32 md:w-48 uppercase"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}
            />
          </div>
        </section>

        {/* ── Article grid ── */}
        <section className="py-16">
          {pagePosts.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-hanken)' }} className="opacity-60">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pagePosts.map((post, i) => {
                const isWide = i === 3 && post.cover?.url
                return (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    onClick={(e) => handleCardClick(e, post.slug)}
                    onMouseEnter={(e) => handleCardEnter(e, post)}
                    onMouseLeave={handleCardLeave}
                    className={`flex flex-col border-2 border-[#1a1c1c] p-6 bg-[#f9f9f9] transition-all duration-300 group news-card ${isWide ? 'md:col-span-2' : ''}`}>
                    {isWide ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-start mb-12">
                            <span className="font-bold uppercase tracking-widest text-[#705d00]"
                              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
                              {catLabel(post.category)}
                            </span>
                            <span className="opacity-60"
                              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
                              {fmtDate(post.publishedAt)}
                            </span>
                          </div>
                          <h3 className="uppercase mb-4 group-hover:text-[#705d00] transition-colors"
                            style={{ fontFamily: 'var(--font-sora)', fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                            {post.title}
                          </h3>
                          <p className="mb-8 flex-grow opacity-80"
                            style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px' }}>
                            {excerpt(post)}
                          </p>
                          <div className="mt-auto border-t border-[#1a1c1c] pt-4 flex justify-between items-center">
                            <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                              Read Article
                            </span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                            </svg>
                          </div>
                        </div>
                        <div className="border-l border-[#1a1c1c] relative hidden md:block overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.cover!.url}
                            alt={post.cover!.alternativeText ?? post.title}
                            className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-12">
                          <span className="font-bold uppercase tracking-widest text-[#705d00]"
                            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
                            {catLabel(post.category)}
                          </span>
                          <span className="opacity-60"
                            style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
                            {fmtDate(post.publishedAt)}
                          </span>
                        </div>
                        <h3 className="uppercase mb-4 group-hover:text-[#705d00] transition-colors"
                          style={{ fontFamily: 'var(--font-sora)', fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                          {post.title}
                        </h3>
                        <p className="mb-8 flex-grow opacity-80"
                          style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px' }}>
                          {excerpt(post)}
                        </p>
                        <div className="border-t border-[#1a1c1c] pt-4 flex justify-between items-center">
                          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Read Article
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                          </svg>
                        </div>
                      </>
                    )}
                  </Link>
                )
              })}

              {page === 1 && <NewsletterCard />}
            </div>
          )}
        </section>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <nav className="py-16 border-t-2 border-[#1a1c1c] flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 font-bold hover:text-[#705d00] transition-colors disabled:opacity-30"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m19 12H5"/><path d="m12 5-7 7 7 7"/>
              </svg>
              PREVIOUS
            </button>
            <div className="flex gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: page === n ? 700 : 400 }}
                  className={`transition-opacity ${page === n ? 'border-b-2 border-[#1a1c1c]' : 'opacity-40 hover:opacity-100'}`}>
                  {String(n).padStart(2, '0')}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 font-bold hover:text-[#705d00] transition-colors disabled:opacity-30"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', textTransform: 'uppercase' }}>
              NEXT
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </nav>
        )}
      </main>
    </>
  )
}

function NewsletterCard() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <article className="flex flex-col border-2 border-[#1a1c1c] p-6 bg-[#ffd700] text-[#1a1c1c]">
      <div className="mb-12">
        <span className="font-bold uppercase tracking-widest border-b border-[#1a1c1c] pb-1"
          style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
          COMMUNICATIONS
        </span>
      </div>
      <h3 className="uppercase mb-4"
        style={{ fontFamily: 'var(--font-sora)', fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>
        SUBSCRIBE TO THE COMMONWEALTH JOURNAL
      </h3>
      <p className="mb-8" style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px' }}>
        Weekly insights into the intersection of heritage, art, and the future of institutional curation.
      </p>
      <div className="mt-auto">
        {submitted ? (
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700 }} className="uppercase">
            THANK YOU — YOU ARE SUBSCRIBED
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#1a1c1c] py-2 focus:outline-none mb-4 placeholder:opacity-50 lowercase"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
            />
            <button
              onClick={() => email && setSubmitted(true)}
              className="w-full py-3 bg-[#1a1c1c] text-[#f9f9f9] font-bold uppercase border-2 border-[#1a1c1c] hover:bg-[#f9f9f9] hover:text-[#1a1c1c] transition-all"
              style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px' }}>
              Join Dispatch
            </button>
          </>
        )}
      </div>
    </article>
  )
}
