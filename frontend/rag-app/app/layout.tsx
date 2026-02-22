import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import MuiThemeProvider from "@/providers/MuiThemeProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Delph.ai",
  description: "Chat with your PDF documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <MuiThemeProvider>
          <ErrorBoundary>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ErrorBoundary>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
