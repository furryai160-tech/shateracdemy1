import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "شاطر أكاديمي - El Shater Academy",
    template: "%s | شاطر أكاديمي"
  },
  description: "منصة شاطر أكاديمي - الحل الأمثل للمدرسين لإنشاء منصات تعليمية ذكية وإدارة الطلاب باحترافية.",
  keywords: ["تعليم أونلاين", "منصة مدرسين", "شاطر أكاديمي", "SaaS Learning", "LMS Egypt"],
  authors: [{ name: "FurryAI-Tech" }],
  openGraph: {
    title: "شاطر أكاديمي - El Shater Academy",
    description: "أقوى منصة تعليمية للمدرسين في مصر والوطن العربي",
    url: "https://shateracdemy.com",
    siteName: "Shater Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "شاطر أكاديمي",
    description: "المنصة المتطورة لإدارة المحتوى التعليمي",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
