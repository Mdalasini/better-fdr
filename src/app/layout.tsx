import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MY FPL",
  description: "Fixture difficulty helper for Fantasy Premier League",
  icons: "/images/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
