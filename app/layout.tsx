import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sans = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Aman Chhetri | Data Analyst & Developer, Sydney",
  description:
    "Master of Data Science student at Macquarie University with three internships in data science and web development. Python, SQL, R and React.",
  openGraph: {
    title: "Aman Chhetri | Data Analyst & Developer",
    description: "Data analysis with Python, SQL and R, and full-stack web development. Based in Sydney.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#10182a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={sans.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
