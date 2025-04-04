// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import './global.css' // Make sure your global styles are imported
import { ReactNode } from 'react';

// Import your font configuration if you have one
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Digital Concierge',
  description: 'Your personal resort assistant',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider> {/* <-- Wrap with ClerkProvider --> */}
      <html lang="en">
        {/* Apply font className if using next/font: <body className={inter.className}> */}
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}