import { ThemeProvider } from "@/components/theme-provider"
import { Titillium_Web } from 'next/font/google'
import '@/styles/globals.css'

const titilliumWeb = Titillium_Web({ 
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${titilliumWeb.variable} font-sans antialiased`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  )
}