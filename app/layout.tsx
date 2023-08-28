import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";

import Image from "next/image";
import factorialLogo from "@/public/factorialhr.webp";

// import NavBar from "@/components/navbar";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex flex-col items-center justify-center p-16 min-h-screen max-w-screen-2xl m-auto">
              <div className="flex flex-row items-center w-full">
                <Image
                  src={factorialLogo}
                  alt="FactorialHR Logo"
                  placeholder="blur"
                  height={40}
                />
                <span>FactorialHR Challenge</span>
              </div>
              <section className="flex justify-center items-between flex-1 my-8 w-full">
                {children}
              </section>
              <footer className="text-xs">
                Made with <span className="text-xl">👨🏻‍💻</span> by Guillermo
                Betancourt
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
