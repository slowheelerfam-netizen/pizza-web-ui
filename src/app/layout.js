import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import DemoModeIndicator from '@/components/DemoModeIndicator'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <DemoModeIndicator />
        {children}
      </body>
    </html>
  )
}

