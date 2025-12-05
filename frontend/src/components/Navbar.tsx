"use client";

import { FC, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const navItems = [
  { name: "Crash", href: "/crash", subtext: "3.24x" },
  { name: "Coinflip", href: "/coinflip", subtext: "50 Flips" },
  { name: "Blackjack", href: "/blackjack", subtext: "10 Lobbies" },
];

export const Navbar: FC = () => {
  const pathname = usePathname();
  const { connected, publicKey } = useWallet();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWalletDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href || pathname === "/" && href === "/crash";

  return (
    <nav className="fixed left-0 top-0 z-[100] flex h-[52px] w-full border-b border-[#1a1a1a] bg-[#0d0d0d] items-center">
      {/* Logo - SOL PUMP */}
      <Link href="/" className="flex items-center gap-0 px-4 md:px-6">
        <span className="font-chakra text-[20px] font-bold text-white tracking-tight">SOL</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mx-0.5">
          <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="#B27CFD"/>
        </svg>
        <span className="font-chakra text-[20px] font-bold text-white tracking-tight">PUMP</span>
      </Link>

      {/* Desktop Navigation - Exact SolPump Style */}
      <div className="relative hidden lg:flex h-full items-center gap-1 xl:gap-2 ml-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <div key={item.name} className="relative h-full">
              <Link
                href={item.href}
                className="group relative flex h-full items-center justify-center px-2"
              >
                <div className="relative z-[2] flex items-center gap-2.5">
                  {/* Icon Box */}
                  <div className={`h-9 w-9 rounded-lg p-px ${
                    active
                      ? "bg-gradient-to-b from-[#EE86FF] to-[#6F5FCC]"
                      : "bg-transparent"
                  }`}>
                    <div className={`flex h-full w-full items-center justify-center rounded-[7px] ${
                      active
                        ? "bg-[#140D1D]"
                        : "bg-[rgba(39,39,39,0.36)] transition-colors duration-200 group-hover:bg-[rgba(39,39,39,0.72)]"
                    }`}>
                      {item.name === "Crash" && (
                        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                          <path d="M14 0L16.3 2.68333L11.4 8.4L7.4 3.73333L0 12.3667L1.4 14L7.4 7L11.4 11.6667L17.7 4.31667L20 7V0H14Z"
                            fill={active ? "url(#crashGradient)" : "#767676"}
                            className={!active ? "transition-colors duration-200 group-hover:fill-[#A1A1A1]" : ""}
                          />
                          <defs>
                            <linearGradient id="crashGradient" x1="10" y1="0" x2="10" y2="14" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EE86FF"/>
                              <stop offset="1" stopColor="#6F5FCC"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      )}
                      {item.name === "Coinflip" && (
                        <svg width="22" height="22" viewBox="0 0 22 22" fill={active ? "url(#coinGradient)" : "#767676"}
                          className={!active ? "transition-colors duration-200 group-hover:fill-[#A1A1A1]" : ""}>
                          <path d="M22 10.2667C22 4.6057 17.0652 0 11 0C4.93474 0 0 4.6057 0 10.2667C0 10.5143 0.0129355 10.7588 0.0313862 11.0019C0.0105289 11.2765 0 11.5112 0 11.7334C0 17.3944 4.93464 22.0001 11 22.0001C17.0653 22.0001 22 17.3944 22 11.7334C22 11.5108 21.9898 11.2762 21.9686 11.0011C21.9873 10.7584 22 10.5139 22 10.2667ZM11 1.35716C15.9822 1.35716 20.4745 5.61629 20.4745 10.2667C20.4745 14.9172 15.9822 19.1763 11 19.1763C6.01782 19.1763 1.52551 14.9172 1.52551 10.2667C1.52551 5.61629 6.01772 1.35716 11 1.35716Z"/>
                          <defs>
                            <linearGradient id="coinGradient" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EE86FF"/>
                              <stop offset="1" stopColor="#6F5FCC"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      )}
                      {item.name === "Blackjack" && (
                        <svg width="22" height="20" viewBox="0 0 22 20" fill={active ? "url(#blackjackGradient)" : "#767676"}
                          className={!active ? "transition-colors duration-200 group-hover:fill-[#A1A1A1]" : ""}>
                          <path d="M9.97216 0.849127C9.97216 0.380253 10.3865 0 10.8975 0L21.0748 0C21.5858 0 21.9999 0.380266 21.9999 0.849129L22 15.7061L21.9987 15.7498C21.9747 16.1839 21.5955 16.532 21.1224 16.554L21.0748 16.5551L10.8975 16.555C10.3865 16.555 9.97221 16.1749 9.97221 15.706L9.97216 0.849127ZM11.0998 15.5203L20.8722 15.5203L20.8723 1.03467L11.0997 1.03479L11.0998 15.5203Z"/>
                          <path d="M8.57907 8.55651C7.96021 8.25059 7.28055 7.88227 6.77278 7.44958C6.55616 8.09496 6.13246 8.76658 5.74354 9.33825L8.58935 13.0063L8.59871 16.9748C8.60008 17.5568 9.11162 18.0296 9.74118 18.0309L13.2183 18.0376L5.35538 19.9709C4.87728 20.0884 4.38632 19.8398 4.23585 19.4125L0.0317465 5.01982C-0.100469 4.56697 0.192356 4.10148 0.685845 3.98009L8.56384 2.04308L8.57907 8.55651Z"/>
                          <defs>
                            <linearGradient id="blackjackGradient" x1="11" y1="0" x2="11" y2="20" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#EE86FF"/>
                              <stop offset="1" stopColor="#6F5FCC"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-0 font-spacegrotesk font-bold">
                    <h2 className={`whitespace-nowrap text-[18px] leading-[100%] transition-colors duration-200 ${
                      active ? "text-white" : "text-[#767676] group-hover:text-[#A1A1A1]"
                    }`}>
                      {item.name}
                    </h2>
                    <span className={`text-[11px] leading-[140%] transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-b from-[#EE86FF] to-[#6F5FCC] bg-clip-text text-transparent"
                        : "text-[rgba(118,118,118,0.56)] group-hover:text-[#A1A1A1]"
                    }`}>
                      {item.subtext}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Right Side */}
      <div className="flex h-full shrink-0 flex-grow justify-end gap-4 items-center px-4 md:px-4 lg:px-0 xl:mr-3 2xl:mr-8">
        {/* PRIMARY Wallet Selector */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <div
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className="group relative h-[38px] min-w-[131px] cursor-pointer rounded-lg p-px sm:min-w-[171px] lg:h-12"
          >
            {/* Gradient Border */}
            <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-b from-[#EE86FF] to-[#6F5FCC] transition-opacity duration-300 group-hover:opacity-0" />
            <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-b from-[#59BE86] to-[#3FCF8E] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Inner Content */}
            <div className="relative z-10 flex h-full cursor-pointer items-center justify-between gap-1 overflow-hidden rounded-lg px-1 py-px sm:px-2 md:py-1">
              <div className="absolute inset-0 z-0 rounded-[6px] bg-[#1a1033] transition-opacity duration-300 group-hover:opacity-0" />
              <div className="absolute inset-0 z-0 rounded-[6px] bg-[#0d2a1a] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-20 flex items-center gap-1 sm:gap-2">
                {/* Wallet Icon */}
                <div className="relative z-[2] shrink-0 overflow-hidden rounded-[5px] lg:rounded-[6.55px]">
                  <div className="flex size-7 items-center justify-center overflow-hidden bg-[#212124] lg:size-8">
                    <div className="size-5 rounded bg-[#AB9FF2] flex items-center justify-center lg:size-6">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex flex-col items-start gap-px md:gap-0">
                  <div className="bg-gradient-to-b from-[#EE86FF] to-[#6F5FCC] bg-clip-text font-chakra text-[11px] font-bold uppercase leading-[100%] text-transparent group-hover:text-[#59BE86] md:text-xs">
                    PRIMARY
                  </div>
                  <div className="flex items-center gap-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="group-hover:hidden">
                      <circle cx="12" cy="12" r="10" fill="url(#solGrad1)"/>
                      <defs>
                        <linearGradient id="solGrad1" x1="12" y1="2" x2="12" y2="22">
                          <stop stopColor="#00FFA3"/>
                          <stop offset="1" stopColor="#03E1FF"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="hidden group-hover:block">
                      <circle cx="12" cy="12" r="10" fill="#4ADE80"/>
                    </svg>
                    <span className="font-chakra text-xs font-bold text-white lg:text-sm group-hover:hidden">0.5491</span>
                    <span className="font-chakra text-xs font-bold text-white lg:text-sm hidden group-hover:block">76.84</span>
                  </div>
                </div>
              </div>

              {/* Dropdown Arrow */}
              <div className="relative z-20 flex h-3 w-[15px] items-center justify-center rounded-[4px] bg-[#272727] md:h-4 md:w-5 md:rounded-[5px]">
                <svg width="11" height="6" viewBox="0 0 11 6" fill="#767676" className={`w-[7.5px] transition-transform duration-200 md:w-auto ${showWalletDropdown ? 'rotate-180' : ''}`}>
                  <path d="M4.78961 0.28256C4.73903 0.333028 4.6967 0.388525 4.65957 0.446357L0.783583 4.32737C0.405652 4.70614 0.405293 5.3202 0.783583 5.69916C1.16187 6.07758 1.77495 6.07794 2.1536 5.69916L5.4913 2.35678L8.84676 5.71604C9.22504 6.09464 9.83813 6.09482 10.2166 5.71604C10.4055 5.52638 10.5004 5.27836 10.5 5.03033C10.5004 4.78212 10.4055 4.53391 10.2162 4.34497L6.32339 0.446537C6.28626 0.388525 6.24357 0.333208 6.19263 0.28256C5.99927 0.0889497 5.74493 -0.00426292 5.4913 0.000227451C5.23803 -0.00444221 4.98297 0.0889497 4.78961 0.28256Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Case */}
        <Link href="/daily-case" className="group relative hidden overflow-hidden rounded-lg p-px lg:block">
          <div className="absolute inset-0 z-0 rounded-lg transition-opacity duration-300 bg-gradient-to-b from-[#11A7773D] to-transparent group-hover:opacity-0" />
          <div className="absolute inset-0 z-0 rounded-lg opacity-0 transition-opacity duration-300 bg-gradient-to-b from-[#11A7778F] to-transparent group-hover:opacity-100" />
          <div className="relative flex h-10 items-center gap-3 overflow-hidden rounded-lg px-3 transition-colors duration-300 lg:h-12 2xl:pl-2 2xl:pr-4">
            <div className="absolute inset-0 z-0 rounded-lg bg-[#0d1a14]" />
            <div className="relative z-[1] w-8 h-8 rounded bg-gradient-to-br from-[#B27CFD] to-[#6B4EAD] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="8"/>
              </svg>
            </div>
            <div className="relative z-[1] flex flex-col items-start gap-1 font-chakra font-bold">
              <span className="text-base leading-[100%] text-white">Daily Case</span>
              <span className="text-left text-xs leading-[100%] text-[#02DF98]">Ready to open</span>
            </div>
          </div>
        </Link>

        <div className="hidden h-6 w-px rounded-lg bg-[#272727] lg:block" />

        {/* $SOLPUMP Token */}
        <Link href="/coin/dashboard" className="group hidden md:block">
          <div className="relative flex h-9 items-center justify-center gap-4 overflow-hidden rounded-lg shadow-lg">
            <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-[#B27CFD]/20 to-[#6B4EAD]/10" />
            <div className="relative z-10 flex items-center gap-1 pl-1 pr-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#B27CFD] to-[#6B4EAD] flex items-center justify-center lg:w-8 lg:h-8">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
                </svg>
              </div>
              <div className="flex flex-col items-start gap-[3px]">
                <div className="bg-gradient-to-r from-[#A26AEF] to-[#B998DA] bg-clip-text font-chakra text-[13px] font-bold leading-[100%] text-transparent">$SOLPUMP</div>
                <div className="font-chakra text-[11px] font-bold leading-[100%] text-[#FFFFFF5C]">$0.024697</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Notification Bell */}
        <button className="group relative flex size-[28px] items-center justify-center rounded-lg border-none bg-[rgba(39,39,39,0.36)] outline-none transition-all duration-300 hover:bg-[rgba(39,39,39,0.72)] focus:outline-none md:size-8 lg:size-9">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="#767676" className="w-[10px] fill-[#767676] transition-colors duration-300 group-hover:fill-[#A1A1A1] md:w-3 lg:w-auto">
            <path d="M9.42463 15.6354C9.42463 16.5309 8.96254 17.2162 8.21208 17.6642C7.46186 18.1119 6.53744 18.1119 5.78862 17.6642C5.03793 17.2162 4.57607 16.5309 4.57607 15.6354"/>
            <path d="M6.99977 0C7.66103 0 8.19363 0.421202 8.19363 1.06893C8.19363 1.47662 8.20741 1.78082 8.45538 1.85874C10.5641 2.5166 11.9163 4.05859 11.9163 6.06111V9.42687C11.9163 10.9689 12.5269 11.281 13.2953 11.8709C14.4081 12.7236 14.1541 14.4994 12.8771 14.4982H1.12289C-0.154098 14.4994 -0.408142 12.7236 0.704702 11.8709C1.4722 11.281 2.08373 10.9689 2.08373 9.42687V6.06111C2.08373 4.05859 3.43591 2.5166 5.54462 1.85874C5.79189 1.78082 5.80637 1.47662 5.80637 1.06893C5.8066 0.421202 6.33944 0 6.99977 0Z"/>
          </svg>
          {/* Notification dot */}
          <div className="absolute right-[3px] top-px size-3 md:right-[5px]">
            <div className="w-2 h-2 rounded-full bg-[#02DF98]" />
          </div>
        </button>

        {/* User Avatar */}
        <Link href="/profile" className="relative hidden lg:block">
          <div className="relative flex size-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#272727] md:size-10 lg:size-12">
            {/* Progress ring */}
            <div className="absolute inset-0 rounded-md md:rounded-lg" style={{
              background: "linear-gradient(to top, rgb(238, 134, 255), rgb(111, 95, 204))",
              maskImage: "conic-gradient(from 180deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 34.4262%, transparent 34.4262%, transparent 100%)"
            }} />
            <div className="absolute inset-[2px] rounded-md bg-[#272727] md:rounded-lg" />
            <div className="relative size-[26px] rounded-[5px] bg-gradient-to-br from-[#6B5B8C] to-[#3D3454] flex items-center justify-center md:size-7 lg:size-9 overflow-hidden">
              {/* Avatar with gradient - no external image needed */}
            </div>
            {/* Level badge */}
            <div className="flex items-center justify-center absolute bottom-[1.5px] right-[1.5px] h-[14px] min-w-4 rounded-none rounded-br-lg rounded-tl-lg bg-[#272727] pt-0.5 text-[10px] leading-[100%] lg:h-[18px] lg:min-w-6 lg:pt-px lg:text-[13px]">
              <span className="font-chakra font-bold text-[#61C6FF]">4</span>
            </div>
          </div>
          <div className="flex h-3 w-[15px] items-center justify-center rounded-[5px] border border-[#272727] bg-transparent md:h-4 md:w-5 absolute -right-5 top-1/2 -translate-y-1/2">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="#767676" className="w-[7.5px] md:w-auto">
              <path d="M5.71039 5.7175C5.76097 5.66703 5.8033 5.61154 5.84043 5.5537L9.71642 1.6727C10.0943 1.29392 10.0947 0.679859 9.71642 0.3009C9.33813 -0.0775205 8.72505 -0.0778797 8.3464 0.3009L5.0087 3.64328L1.65324 0.284017C1.27496 -0.0945826 0.661873 -0.0947622 0.283404 0.284017C0.0945285 0.473676 -0.000357725 0.721706 1.01339e-06 0.969736C-0.000357725 1.21794 0.0945285 1.46615 0.283763 1.65509L4.17661 5.55352C4.21374 5.61154 4.25643 5.66685 4.30737 5.7175C4.50073 5.91111 4.75507 6.00432 5.0087 5.99983C5.26197 6.0045 5.51703 5.91111 5.71039 5.7175Z"/>
            </svg>
          </div>
        </Link>

        {/* Select Wallet Button - Green CTA */}
        <button className="hidden lg:flex h-12 items-center justify-center gap-2 rounded-lg bg-[#02DF98] px-6 font-spacegrotesk text-[15px] font-bold text-black transition-colors hover:bg-[#00C584]">
          Select Wallet
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-[98] flex justify-center gap-2 bg-[#0d0d0d] px-4 py-2 border-t border-[#1a1a1a] lg:hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-6 rounded-lg transition-colors ${
                active ? "bg-[#1a1a1a] text-[#B27CFD]" : "text-[#666]"
              }`}
            >
              {item.name === "Crash" && (
                <svg width="20" height="14" viewBox="0 0 20 14" fill="currentColor">
                  <path d="M14 0L16.3 2.68333L11.4 8.4L7.4 3.73333L0 12.3667L1.4 14L7.4 7L11.4 11.6667L17.7 4.31667L20 7V0H14Z"/>
                </svg>
              )}
              {item.name === "Coinflip" && (
                <svg width="20" height="20" viewBox="0 0 22 22" fill="currentColor">
                  <path d="M22 10.2667C22 4.6057 17.0652 0 11 0C4.93474 0 0 4.6057 0 10.2667C0 10.5143 0.0129355 10.7588 0.0313862 11.0019C0.0105289 11.2765 0 11.5112 0 11.7334C0 17.3944 4.93464 22.0001 11 22.0001C17.0653 22.0001 22 17.3944 22 11.7334C22 11.5108 21.9898 11.2762 21.9686 11.0011C21.9873 10.7584 22 10.5139 22 10.2667ZM11 1.35716C15.9822 1.35716 20.4745 5.61629 20.4745 10.2667C20.4745 14.9172 15.9822 19.1763 11 19.1763C6.01782 19.1763 1.52551 14.9172 1.52551 10.2667C1.52551 5.61629 6.01772 1.35716 11 1.35716Z"/>
                </svg>
              )}
              {item.name === "Blackjack" && (
                <svg width="20" height="18" viewBox="0 0 22 20" fill="currentColor">
                  <path d="M9.97216 0.849127C9.97216 0.380253 10.3865 0 10.8975 0L21.0748 0C21.5858 0 21.9999 0.380266 21.9999 0.849129L22 15.7061L21.9987 15.7498C21.9747 16.1839 21.5955 16.532 21.1224 16.554L21.0748 16.5551L10.8975 16.555C10.3865 16.555 9.97221 16.1749 9.97221 15.706L9.97216 0.849127Z"/>
                </svg>
              )}
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
