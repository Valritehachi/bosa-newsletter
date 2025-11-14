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

export const metadata ={
  title: "Bosa Newsletter",
  description: "Latest newsletters from Bosa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        {/* ✅ Ensures proper scaling and zoom on all mobile devices */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />

        {/* Google reCAPTCHA script */}
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col overflow-x-hidden`}
      >
        {/* ✅ Makes sure your entire app is centered and responsive */}
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
