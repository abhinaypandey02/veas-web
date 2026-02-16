import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "naystack/graphql/client";
import { AuthWrapper } from "naystack/auth/email/client";
import localFont from "next/font/local";

const serif = localFont({
  src: [
    {
      path: "../fonts/serif.woff2",
      style: "normal",
    },
    {
      path: "../fonts/serif-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-serif",
});

const sans = localFont({
  src: [
    {
      path: "../fonts/sans.woff2",
    },
  ],
});

export const metadata: Metadata = {
  title: "Veas | Your Personal Astro Guide",
  description: "Discover your true zodiac sign with authentic Vedic astrology.",
};
import CustomCursor from "./_components/custom-cursor";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.className} ${serif.variable} antialiased`}>
        <CustomCursor />
        <AuthWrapper>
          <ApolloWrapper>{children}</ApolloWrapper>
        </AuthWrapper>
      </body>
    </html>
  );
}
