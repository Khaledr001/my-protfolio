import type { Metadata } from 'next'
import { getNewsPosts } from '@/lib/api/news'
import NewsClient from './NewsClient'

export const metadata: Metadata = {
  title: 'News & Editorial — Eagle Commonwealth',
  description: 'Press, donations, and art & culture editorial from Eagle Commonwealth.',
}

export default async function NewsPage() {
  const posts = await getNewsPosts()
  return <NewsClient posts={posts} />
}
