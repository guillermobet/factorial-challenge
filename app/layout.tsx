import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Factorial HR challenge",
  description: "Challenge for Senior Software Engineer position",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col items-center justify-between p-8">
            <section>{children}</section>
            <footer className="text-xs">
              Made with <span className="text-xl">👨🏻‍💻</span> by Guillermo
              Betancourt
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
