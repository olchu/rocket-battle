import './globals.css'

export const metadata = {
  title: 'Rocket Battle',
  description: 'by Ol_Chu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
