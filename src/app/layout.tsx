import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, useEffect } from "react";
import { emitEvent, googleAuth } from "@/lib/firebase";
import BetaTag from "@/components/ui/beta-tag";
import Link from "next/link";
import UserProfile from "@/components/ui/user-profile";
import { headers } from "next/headers";
import { Loader } from "@/components/ui-generator";
import NavBarItems from "@/components/ui/nav-bar-items";
import { WebVitals } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UI by AI",
  description: "Generate beautiful UI components with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const email = headersList.get("email") ?? "";
  const profileImg = headersList.get("profile-img") ?? "";
  return (
    <html lang="en">
      <Script src="https://cdn.tailwindcss.com"></Script>
      <body className={`${inter.className} light  text-foreground`}>
        <Suspense fallback={<Loader />}>
          <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-between ">
            <header className="bg-white shadow sticky top-0 w-full z-30">
              <div className="container mx-auto px-6 py-4 flex w-full justify-between items-center">
                <BetaTag>
                  <span className="text-2xl font-bold text-gray-800">
                    LLM-Minds UI Generator
                  </span>
                </BetaTag>
                <nav className="flex flex-row items-center">
                  <NavBarItems />
                  <UserProfile email={email} profileImg={profileImg} />
                </nav>
              </div>
            </header>
            {children}
          </div>
        </Suspense>
        <WebVitals />
      </body>
    </html>
  );
}
