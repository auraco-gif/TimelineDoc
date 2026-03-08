import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimelineDoc — Photo Timeline PDF",
  description:
    "Automatically organize photos into a clean timeline PDF for visa and immigration evidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
