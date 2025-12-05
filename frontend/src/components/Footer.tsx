"use client";

import { FC } from "react";
import Link from "next/link";

export const Footer: FC = () => {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 lg:gap-16">
          {/* Left Section - Logo and Description */}
          <div className="flex-1 min-w-[280px]">
            {/* Logo */}
            <div className="flex items-center gap-0 mb-4">
              <span className="font-chakra text-[24px] font-bold text-white tracking-tight">SOL</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-0.5">
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="#B27CFD"/>
              </svg>
              <span className="font-chakra text-[24px] font-bold text-white tracking-tight">PUMP</span>
            </div>

            {/* Description */}
            <p className="text-[#666] text-[12px] font-spacegrotesk leading-relaxed mb-4 max-w-sm">
              Welcome to <span className="text-[#B27CFD]">Solpump</span>. Play 100% fair on-chain Solana games like Crash,
              Coinflip and Futures. SolPump provides instant on-chain Solana deposits
              and Solana withdrawals. Earn $SOLPUMP by wagering Solana and be sure
              to claim our free rewards or join in our hourly Solana airdrops.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {/* X (Twitter) */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              {/* Discord */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                </svg>
              </a>
              {/* Solana */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="url(#solGradientFooter)" />
                  <defs>
                    <linearGradient id="solGradientFooter" x1="12" y1="2" x2="12" y2="22">
                      <stop stopColor="#00FFA3" />
                      <stop offset="1" stopColor="#03E1FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </a>
              {/* Chat */}
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#B27CFD] hover:bg-[#9B6AE8] flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Games Column */}
          <div className="min-w-[100px]">
            <h4 className="text-white text-[13px] font-spacegrotesk font-bold mb-4">Games</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/crash" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Crash
                </Link>
              </li>
              <li>
                <Link href="/coinflip" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Coinflip
                </Link>
              </li>
              <li>
                <Link href="/blackjack" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Blackjack
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div className="min-w-[100px]">
            <h4 className="text-white text-[13px] font-spacegrotesk font-bold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Statistics
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Rewards Column */}
          <div className="min-w-[100px]">
            <h4 className="text-white text-[13px] font-spacegrotesk font-bold mb-4">Rewards</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#B27CFD] hover:text-[#9B6AE8] text-[12px] font-spacegrotesk transition-colors">
                  Airdrops
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Daily Case
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Column */}
          <div className="min-w-[100px]">
            <h4 className="text-white text-[13px] font-spacegrotesk font-bold mb-4">Info</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Fairness
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  TOS
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#666] hover:text-white text-[12px] font-spacegrotesk transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1a1a1a]">
          <Link
            href="#"
            className="text-[#B27CFD] hover:text-[#9B6AE8] text-[12px] font-spacegrotesk font-medium transition-colors"
          >
            $SOL PUMP
          </Link>
          <span className="text-[#555] text-[11px] font-spacegrotesk">
            Privacy
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
