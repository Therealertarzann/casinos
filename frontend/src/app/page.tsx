"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const games = [
  {
    name: "Crash",
    description: "Watch the multiplier rise and cash out before it crashes!",
    href: "/crash",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      </svg>
    ),
    color: "#02DF98",
  },
  {
    name: "Coinflip",
    description: "Classic 50/50 odds. Pick heads or tails and double your SOL.",
    href: "/coinflip",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
      </svg>
    ),
    color: "#B27CFD",
  },
  {
    name: "Blackjack",
    description: "Classic card game. Beat the dealer to 21 without going bust.",
    href: "/blackjack",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="14" height="18" rx="2"/>
        <path d="M10 10l-2 4 2 4" strokeLinecap="round"/>
      </svg>
    ),
    color: "#FFD66B",
  },
];

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 py-12 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#767676] text-sm mb-3 font-spacegrotesk">
            THE #1 PROVABLY FAIR CASINO ON SOLANA
          </p>
          <div className="flex items-center justify-center gap-4 mb-2">
            <img src="/bagwork-logo.png" alt="BAGWORK" className="h-16 md:h-24 w-auto" />
            <h1 className="font-chakra text-5xl md:text-7xl font-bold text-white">
              BAGWORK
            </h1>
          </div>
          <p className="text-[#767676] text-base max-w-md mx-auto font-spacegrotesk">
            Play Crash, Coinflip & Blackjack with instant settlements. No KYC required.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4 mb-12">
          {connected ? (
            <Link
              href="/crash"
              className="h-10 px-8 rounded-lg place-bet-form-submit-button font-spacegrotesk text-sm font-bold flex items-center"
            >
              Start Playing
            </Link>
          ) : (
            <WalletMultiButton className="!h-10 !rounded-lg !px-8 !font-spacegrotesk !text-sm !font-bold place-bet-form-submit-button" />
          )}
          <Link
            href="#games"
            className="h-10 px-8 rounded-lg border border-[#272727] bg-[#17151D] font-spacegrotesk text-sm font-bold text-white flex items-center hover:border-[#B27CFD] transition-colors"
          >
            View Games
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="font-chakra text-3xl font-bold text-[#02DF98]">$12.5M+</div>
            <div className="text-xs text-[#767676] font-spacegrotesk">Total Wagered</div>
          </div>
          <div className="text-center">
            <div className="font-chakra text-3xl font-bold text-[#B27CFD]">50K+</div>
            <div className="text-xs text-[#767676] font-spacegrotesk">Active Players</div>
          </div>
          <div className="text-center">
            <div className="font-chakra text-3xl font-bold text-[#FFD66B]">100%</div>
            <div className="text-xs text-[#767676] font-spacegrotesk">Provably Fair</div>
          </div>
        </div>

        {/* Games Grid */}
        <div id="games" className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-spacegrotesk text-sm font-bold text-white">GAMES</span>
            <div className="flex items-center gap-1 text-[#02DF98]">
              <div className="w-2 h-2 rounded-full bg-[#02DF98] animate-pulse" />
              <span className="text-xs">Live</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link
                key={game.name}
                href={game.href}
                className="group rounded-xl border border-[#272727] bg-[#17151D] p-6 hover:border-[#72509F] transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${game.color}20`, color: game.color }}
                >
                  {game.icon}
                </div>
                <h3 className="font-spacegrotesk text-lg font-bold text-white mb-2 group-hover:text-[#02DF98] transition-colors">
                  {game.name}
                </h3>
                <p className="text-sm text-[#767676] mb-4">{game.description}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#02DF98]" />
                  <span className="text-xs text-[#767676]">Play Now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Airdrop Banner */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="rounded-xl border border-[#272727] bg-gradient-to-r from-[#17151D] to-[#1f1d25] p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#B27CFD]/10 to-[#02DF98]/10" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#B27CFD] to-[#72509F] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-chakra text-xl font-bold text-white mb-1">Hourly Airdrop</h3>
                <p className="text-sm text-[#767676] mb-3">
                  Bet at least 0.001 SOL in the past hour to qualify!
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div>
                    <div className="font-chakra text-2xl font-bold text-[#02DF98]">0.5 SOL</div>
                    <div className="text-xs text-[#767676]">Prize Pool</div>
                  </div>
                  <div>
                    <div className="font-chakra text-2xl font-bold text-white">47:23</div>
                    <div className="text-xs text-[#767676]">Until Next Drop</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[#02DF98]/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#02DF98]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-spacegrotesk text-sm font-bold text-white mb-1">Provably Fair</h3>
              <p className="text-xs text-[#767676]">All randomness powered by VRF. Verify every game on-chain.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[#B27CFD]/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#B27CFD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <h3 className="font-spacegrotesk text-sm font-bold text-white mb-1">Instant Settlements</h3>
              <p className="text-xs text-[#767676]">Bets settle in under a second. Winnings go directly to your wallet.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[#FFD66B]/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#FFD66B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="font-spacegrotesk text-sm font-bold text-white mb-1">No KYC Required</h3>
              <p className="text-xs text-[#767676]">Just connect your wallet and play. Full anonymity, always.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-[#272727]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/bagwork-logo.png" alt="BAGWORK" className="w-8 h-8 rounded-full" />
              <span className="font-chakra text-lg font-bold text-white">
                BAGWORK
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#767676]">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-[#272727] flex items-center justify-center hover:bg-[#333] transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#272727] flex items-center justify-center hover:bg-[#333] transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-[#767676]">
            Built on Solana. Provably fair. Play responsibly.
          </div>
        </div>
      </section>
    </div>
  );
}
