import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: 'BIKES4u - Buy, Sell & Exchange Second-Hand Bikes in India',
  description: 'Find quality used bikes near you at the best prices. Buy, sell, or exchange your bike with complete documentation and warranty. Trusted by 500+ customers across India.',
  keywords: ['second hand bikes', 'used bikes', 'buy bikes', 'sell bikes', 'bike exchange', 'India', 'motorcycle', 'scooter'],
  authors: [{ name: 'BIKES4u' }],
  creator: 'BIKES4u',
  openGraph: {
    title: 'BIKES4u - Buy, Sell & Exchange Second-Hand Bikes',
    description: 'Find quality used bikes near you at the best prices. Trusted by 500+ customers across India.',
    url: 'https://bikes4u.in',
    siteName: 'BIKES4u',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIKES4u - Buy, Sell & Exchange Second-Hand Bikes',
    description: 'Find quality used bikes near you at the best prices.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
