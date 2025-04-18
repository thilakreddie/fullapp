import './globals.css';
import type { Metadata } from 'next';
import { Titillium_Web } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";

const titilliumWeb = Titillium_Web({ 
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

export const metadata: Metadata = {
  title: 'F1 Race Hub',
  description: 'Your ultimate Formula 1 race and driver statistics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${titilliumWeb.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}