import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import MuiThemeProvider from "@/providers/MuiThemeProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ChatPDF",
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
