import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/app-layout";

export const metadata: Metadata = {
  title: "Typing Master Pro Edition",
  description: "Learn and practice typing in English and Hindi Remington GAIL layout with detailed statistics, lessons, and games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
