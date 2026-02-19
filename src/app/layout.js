import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Dancing_Script } from 'next/font/google'
import './globals.css'
import DemoModeIndicator from '@/components/DemoModeIndicator'
import Footer from '@/components/Footer';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-dancing-script',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${dancingScript.variable} antialiased bg-black`}
      >
        <DemoModeIndicator />
        {children}
      </body>
    </html>
  )
}

