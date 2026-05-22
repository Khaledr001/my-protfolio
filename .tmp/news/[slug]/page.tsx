import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNewsPost } from '@/lib/api/news'
import NewsPostClient from './NewsPostClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) return {}
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) notFound()
  return <NewsPostClient post={post} />
}
