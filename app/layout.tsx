import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bunshow",
  description: "Japanese sentence study by JLPT level",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
