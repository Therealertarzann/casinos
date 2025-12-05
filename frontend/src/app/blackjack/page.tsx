"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

interface Seat {
  position: number;
  player?: {
    name: string;
    avatar?: string;
  };
  isOpen: boolean;
}

// Seats around the blackjack table
const initialSeats: Seat[] = [
  { position: 1, isOpen: true },
  { position: 2, isOpen: true },
  { position: 3, isOpen: true },
  { position: 4, player: { name: "RewardingNer..." }, isOpen: false },
  { position: 5, isOpen: true },
  { position: 6, isOpen: true },
];

export default function BlackjackPage() {
  const { connected, publicKey } = useWallet();
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleTakeSeat = (position: number) => {
    if (!connected) return;

    const shortAddress = publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : "You";

    setSeats(prev =>
      prev.map(seat =>
        seat.position === position
          ? { ...seat, player: { name: shortAddress }, isOpen: false }
          : seat
      )
    );
    setSelectedSeat(position);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/blackjack"
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-white text-[12px] font-spacegrotesk font-medium transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            Find New Lobby
          </Link>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-white text-[12px] font-spacegrotesk font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Play Alone
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#666] text-[12px] font-spacegrotesk transition-colors">
            Payout Rulebook
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#666] text-[12px] font-spacegrotesk transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#222] flex items-center justify-center text-[#666] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Blackjack Table */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-4xl aspect-[16/9]">
          {/* Table Background */}
          <div className="absolute inset-0 rounded-[50%_50%_50%_50%/30%_30%_70%_70%] bg-gradient-to-b from-[#1a3a2a] to-[#0d2018] border-[8px] border-[#2a1a0a] shadow-2xl">
            {/* Inner felt */}
            <div className="absolute inset-4 rounded-[50%_50%_50%_50%/30%_30%_70%_70%] bg-gradient-to-b from-[#1a4a3a] to-[#0d3020] border border-[#2a5a4a]/30" />
          </div>

          {/* Dealer Area */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Dealer Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#4a4a6a] to-[#2a2a4a] flex items-center justify-center border-2 border-[#3a3a5a] mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#888">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            {/* Card shoe */}
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-12 rounded bg-gradient-to-b from-[#2a2a4a] to-[#1a1a2a] border border-[#3a3a5a]" />
              ))}
            </div>
          </div>

          {/* BLACKJACK PAYS 3 TO 2 */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-[#FFD66B] text-[11px] font-chakra font-bold tracking-widest">
              BLACKJACK PAYS 3 TO 2
            </p>
            <p className="text-[#666] text-[9px] font-spacegrotesk mt-1">
              - INSURANCE PAYS 2 TO 1 -
            </p>
          </div>

          {/* Main and PP labels */}
          <div className="absolute top-[55%] right-[15%] flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#B27CFD]/20 text-[#B27CFD] text-[9px] font-spacegrotesk font-bold">MAIN</span>
            <span className="px-2 py-0.5 rounded bg-[#02DF98]/20 text-[#02DF98] text-[9px] font-spacegrotesk font-bold">PP</span>
          </div>

          {/* Player Seats */}
          {seats.map((seat, index) => {
            // Position seats around the bottom arc of the table
            const positions = [
              { left: "5%", top: "55%" },
              { left: "20%", top: "70%" },
              { left: "38%", top: "80%" },
              { left: "56%", top: "80%" },
              { left: "74%", top: "70%" },
              { left: "89%", top: "55%" },
            ];
            const pos = positions[index];

            return (
              <div
                key={seat.position}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                {seat.isOpen ? (
                  <button
                    onClick={() => handleTakeSeat(seat.position)}
                    disabled={!connected}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#02DF98] flex items-center justify-center shadow-lg shadow-[#02DF98]/30 group-hover:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <span className="text-[#02DF98] text-[10px] font-spacegrotesk">Open Seat</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#4A3F5F] to-[#2D2640] flex items-center justify-center border-2 border-[#B27CFD]">
                      <span className="text-white text-xs font-bold">
                        {seat.player?.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white text-[10px] font-spacegrotesk truncate max-w-[80px]">
                      {seat.player?.name}
                    </span>
                    {seat.player?.name.includes("Rewarding") && (
                      <button className="mt-1 px-3 py-1 rounded bg-[#02DF98] text-black text-[9px] font-spacegrotesk font-bold">
                        Take Seat
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Wallet Message */}
      {!connected && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 lg:bottom-8">
          <WalletMultiButton className="!h-10 !rounded-lg !px-6 !font-spacegrotesk !text-[13px] !font-bold !bg-[#B27CFD] hover:!bg-[#9B6AE8] !text-white" />
        </div>
      )}
    </div>
  );
}
