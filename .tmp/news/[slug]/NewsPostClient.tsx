'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { NewsPost } from '@/types'

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

function fmtDateLong(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
}

export default function NewsPostClient({ post }: { post: NewsPost }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', '#f9f9f9')
    return () => document.documentElement.style.setProperty('--page-bg', '#FFD200')
  }, [])

  return (
    <main className="max-w-300 mx-auto px-6 md:px-20 py-16">

      <Link
        href="/news"
        className="inline-flex items-center gap-2 mb-12 hover:text-[#705d00] transition-colors"
        style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m19 12H5"/><path d="m12 5-7 7 7 7"/>
        </svg>
        Back to News
      </Link>

      <header className="border-b-2 border-[#1a1c1c] pb-12 mb-12">
        <span className="bg-[#ffd700] text-[#705e00] px-3 py-1 inline-block mb-6"
          style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
          {catLabel(post.category)}
        </span>
        <h1 className="uppercase mb-8 leading-none"
          style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800 }}>
          {post.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', fontWeight: 700 }}>
          {fmtDateLong(post.publishedAt)}
        </p>
      </header>

      {post.cover?.url && (
        <div className="border-2 border-[#1a1c1c] mb-12 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover.url}
            alt={post.cover.alternativeText ?? post.title}
            className="w-full aspect-video object-cover grayscale"
          />
        </div>
      )}

      {post.body ? (
        <div
          className="max-w-180 prose-news"
          style={{ fontFamily: 'var(--font-hanken)', fontSize: '17px', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      ) : (
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: '17px' }} className="opacity-60">
          Full article content available in the published edition.
        </p>
      )}
    </main>
  )
}
