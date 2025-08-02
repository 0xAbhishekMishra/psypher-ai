import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Psypher AI - Events',
  description: 'Discover and join exclusive events',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-gray-50">
        <body className={`${inter.className} h-full`}>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}