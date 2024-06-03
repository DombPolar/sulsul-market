import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 술술",
    default: "술술 마켓",
  },
  description: "모든 것들을 사고 파세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white max-w-md mx-auto">
        {children}
      </body>
    </html>
  );
}
