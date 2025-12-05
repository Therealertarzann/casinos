import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/contexts/WalletContext";
import { Navbar } from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "SOL PUMP - Solana Casino | Crash, Coinflip & Blackjack",
  description: "Play Coinflip instantly with Solana – No KYC needed. Provably fair games with instant payouts.",
  keywords: "solana casino, crypto gambling, coinflip, crash game, blackjack, defi gaming, web3 casino, solpump",
  openGraph: {
    title: "SOL PUMP - Solana Casino",
    description: "Play provably fair games on Solana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0d0d0d] min-h-screen">
        <WalletContextProvider>
          <Navbar />
          {/* Main container with left sidebar for chat */}
          <div className="flex min-h-screen pt-[52px]">
            {/* Left Sidebar - Chat (desktop only) */}
            <ChatSidebar />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-[160px] pb-20 lg:pb-8 flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
