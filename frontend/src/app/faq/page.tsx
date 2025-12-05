"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is BAGWORK?",
    answer:
      "BAGWORK is a decentralized casino built on Solana. We offer provably fair games including Crash, Coinflip, and Blackjack. All game outcomes are determined by ORAO VRF (Verifiable Random Function), ensuring complete fairness and transparency.",
  },
  {
    question: "How do I start playing?",
    answer:
      "Simply connect your Solana wallet (Phantom, Backpack, Solflare, or Ledger) and you're ready to play! No registration or KYC required. Just make sure you have some SOL in your wallet for betting and transaction fees.",
  },
  {
    question: "What is provably fair?",
    answer:
      "Provably fair means you can mathematically verify that every game outcome is random and hasn't been manipulated. We use ORAO VRF (Verifiable Random Function) which generates randomness on-chain that can be verified by anyone. Every bet result can be checked against the blockchain.",
  },
  {
    question: "How does Crash work?",
    answer:
      "In Crash, you place a bet and watch the multiplier rise from 1.00x. The goal is to cash out before the game 'crashes'. The longer you wait, the higher the potential payout, but if you don't cash out in time, you lose your bet. You can set an auto cash-out multiplier for automatic withdrawals.",
  },
  {
    question: "How does Coinflip work?",
    answer:
      "Coinflip is a simple 50/50 game. Choose heads or tails, place your bet, and if you win, you double your money (2x payout). The outcome is determined by VRF randomness.",
  },
  {
    question: "How does Jackpot work?",
    answer:
      "In Jackpot, multiple players pool their SOL together. Your chance of winning is proportional to your contribution. For example, if you bet 1 SOL in a 10 SOL pot, you have a 10% chance to win the entire pot. Winner is selected via VRF after the countdown.",
  },
  {
    question: "What are the platform fees?",
    answer:
      "Our platform fee is only 1% on Jackpot games. Crash and Coinflip have a 1% house edge built into the game mechanics. These fees help maintain the platform and fund rewards.",
  },
  {
    question: "How do I claim rewards?",
    answer:
      "Visit the Rewards page to claim your daily free case, participate in hourly airdrops (requires 0.001 SOL bet + chat activity in the past hour), and unlock level rewards as you wager more SOL.",
  },
  {
    question: "What wallets are supported?",
    answer:
      "We support Phantom, Backpack, Solflare, and Ledger hardware wallets. Any Solana-compatible wallet that supports web3 connections should work.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Yes! BAGWORK is non-custodial, meaning your funds are always in your wallet until you place a bet. We never hold your private keys. All transactions are executed directly on the Solana blockchain.",
  },
  {
    question: "What network does BAGWORK use?",
    answer:
      "We are currently deployed on Solana Devnet for testing. When we launch to mainnet, all games will use real SOL on the main Solana network.",
  },
  {
    question: "Can I verify game outcomes?",
    answer:
      "Yes! Every game result is recorded on-chain. You can verify any outcome by checking the transaction on Solana Explorer. Our smart contract is open-source and uses ORAO VRF for randomness.",
  },
];

// Shield Icon SVG
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#02DF98"/>
  </svg>
);

// Zap Icon SVG
const ZapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2V13H10V22L17 10H13L17 2H7Z" fill="#FFD700"/>
  </svg>
);

// Lock Icon SVG
const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#B27CFD"/>
  </svg>
);

// Help Circle Icon SVG
const HelpCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="#B27CFD"/>
  </svg>
);

// Chevron Down Icon SVG
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"/>
  </svg>
);

// External Link Icon SVG
const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="#B27CFD"/>
  </svg>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#B27CFD]/20 flex items-center justify-center mx-auto mb-4">
          <HelpCircleIcon />
        </div>
        <h1 className="font-chakra text-3xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
        <p className="text-[#767676] font-spacegrotesk max-w-xl mx-auto">
          Everything you need to know about BAGWORK casino. Can't find your answer? Join our Discord!
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <div className="bg-[#17151D] rounded-xl border border-[#272727] p-4 text-center">
          <div className="flex justify-center mb-2">
            <ShieldIcon />
          </div>
          <div className="font-spacegrotesk font-semibold text-white">Provably Fair</div>
          <div className="text-sm text-[#767676] font-spacegrotesk">ORAO VRF verified</div>
        </div>
        <div className="bg-[#17151D] rounded-xl border border-[#272727] p-4 text-center">
          <div className="flex justify-center mb-2">
            <ZapIcon />
          </div>
          <div className="font-spacegrotesk font-semibold text-white">Instant Payouts</div>
          <div className="text-sm text-[#767676] font-spacegrotesk">Direct to wallet</div>
        </div>
        <div className="bg-[#17151D] rounded-xl border border-[#272727] p-4 text-center">
          <div className="flex justify-center mb-2">
            <LockIcon />
          </div>
          <div className="font-spacegrotesk font-semibold text-white">Non-Custodial</div>
          <div className="text-sm text-[#767676] font-spacegrotesk">Your keys, your crypto</div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#17151D] rounded-xl border border-[#272727] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1f1d25] transition-colors"
            >
              <span className="font-spacegrotesk font-semibold pr-4 text-white">{faq.question}</span>
              <ChevronDownIcon
                className={`text-[#767676] transition-transform shrink-0 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-[#767676] font-spacegrotesk leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Smart Contract Info */}
      <div className="mt-12 bg-[#17151D] rounded-2xl border border-[#272727] p-6">
        <h2 className="font-chakra text-xl font-bold mb-4 text-white">Smart Contract</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-[#767676] font-spacegrotesk mb-1">Program ID (Devnet)</div>
            <div className="flex items-center gap-2">
              <code className="bg-[#141317] px-3 py-2 rounded-lg text-sm font-mono flex-1 overflow-x-auto text-white">
                asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg
              </code>
              <a
                href="https://explorer.solana.com/address/asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#141317] rounded-lg hover:bg-[#272727] transition-colors"
              >
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[#767676] font-spacegrotesk mb-1">VRF Provider</div>
              <div className="bg-[#141317] px-3 py-2 rounded-lg text-sm font-spacegrotesk text-white">ORAO Network</div>
            </div>
            <div>
              <div className="text-sm text-[#767676] font-spacegrotesk mb-1">Network</div>
              <div className="bg-[#141317] px-3 py-2 rounded-lg text-sm font-spacegrotesk text-white">Solana Devnet</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="font-chakra text-xl font-bold mb-4 text-white">Ready to Play?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/crash"
            className="px-8 py-4 place-bet-form-submit-button rounded-xl font-spacegrotesk font-semibold hover:opacity-90 transition-opacity"
          >
            Start Playing Now
          </Link>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#141317] border border-[#272727] rounded-xl font-spacegrotesk font-semibold hover:border-[#B27CFD] transition-colors text-white"
          >
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}
