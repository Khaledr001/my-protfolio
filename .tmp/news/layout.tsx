import { Sora, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['500'],
  display: 'swap',
})

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${sora.variable} ${hanken.variable} ${jetbrains.variable} flex-1 news-section`}
      style={{ fontFamily: 'var(--font-hanken), sans-serif', backgroundColor: '#f9f9f9', color: '#1a1c1c' }}
    >
      {children}
    </div>
  )
}
