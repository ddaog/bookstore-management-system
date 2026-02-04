import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SideNav } from "@/components/side-nav";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import { StoreProvider } from "@/components/store-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space Immersion - Bookstore Management",
  description: "Independent Bookstore Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-neutral-50/50 dark:bg-neutral-900")}>
        <StoreProvider>
          <div className="grid min-h-screen w-full lg:grid-cols-[200px_1fr]">
            <div className="hidden border-r bg-white dark:bg-neutral-950 lg:block p-4">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-2 font-semibold">
                  공간과몰입
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <SideNav />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white dark:bg-neutral-950 px-6">
                <MobileNav />
                <div className="w-full flex-1">
                  {/* Header content like search or user profile can go here */}
                  <span className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">통합 관리 시스템</span>
                </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
