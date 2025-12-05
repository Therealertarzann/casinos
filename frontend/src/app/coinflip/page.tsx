"use client";

import { FC, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type CoinSide = "sol" | "pump";
type GameStatus = "waiting" | "in-play" | "finishing";

interface CoinflipGame {
  id: string;
  creator: string;
  creatorAvatar?: string;
  creatorSide: CoinSide;
  amount: number;
  status: GameStatus;
  winner?: string;
  opponent?: string;
  opponentAvatar?: string;
}

// SOL coin SVG icon
const SolCoinIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="url(#solGradient)" />
    <defs>
      <linearGradient id="solGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#03E1FF" />
      </linearGradient>
    </defs>
  </svg>
);

// PUMP coin SVG icon (using Solana-style icon with purple gradient)
const PumpCoinIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" className={className}>
    <path d="M22 10.2667C22 4.6057 17.0652 0 11 0C4.93474 0 0 4.6057 0 10.2667C0 10.5143 0.0129355 10.7588 0.0313862 11.0019C0.0105289 11.2765 0 11.5112 0 11.7334C0 17.3944 4.93464 22.0001 11 22.0001C17.0653 22.0001 22 17.3944 22 11.7334C22 11.5108 21.9898 11.2762 21.9686 11.0011C21.9873 10.7584 22 10.5139 22 10.2667ZM11 1.35716C15.9822 1.35716 20.4745 5.61629 20.4745 10.2667C20.4745 14.9172 15.9822 19.1763 11 19.1763C6.01782 19.1763 1.52551 14.9172 1.52551 10.2667C1.52551 5.61629 6.01772 1.35716 11 1.35716ZM11 21.2668C6.98186 21.2668 3.49991 19.0895 1.83343 15.9333C2.15161 16.5357 2.77472 17.1059 3.28151 17.5723C3.83382 18.0805 4.4436 18.5348 5.09729 18.9242C6.4475 19.7291 7.98321 20.2516 9.57197 20.4444C12.9533 20.8555 16.4033 19.751 18.8041 17.4935C19.3117 17.0165 19.769 16.4932 20.1674 15.9334C18.4996 19.0895 15.0177 21.2668 11 21.2668Z" fill="url(#pumpGradient)" />
    <path d="M14.0388 7.94556C14.0141 7.97667 13.9834 8.00087 13.9495 8.01469C13.9157 8.03197 13.8788 8.03889 13.8419 8.03889H6.87377C6.62766 8.03889 6.50152 7.69325 6.6738 7.48586L7.81823 6.12058C7.84284 6.08948 7.87361 6.06528 7.91052 6.048C7.94437 6.03072 7.98128 6.0238 8.0182 6.0238H15.014C15.2632 6.0238 15.3862 6.3729 15.2109 6.58028L14.0388 7.94556ZM14.0388 14.0496C13.9865 14.1083 13.9157 14.1429 13.8419 14.1429H6.87377C6.62766 14.1429 6.50152 13.8042 6.6738 13.6037L7.81823 12.2695C7.84284 12.2384 7.87668 12.2142 7.91052 12.2004C7.94437 12.1831 7.98128 12.1762 8.0182 12.1762H15.014C15.2632 12.1762 15.3862 12.5184 15.2109 12.7189L14.0388 14.0496ZM14.0388 9.19332C13.9865 9.13457 13.9157 9.1 13.8419 9.1H6.87377C6.62766 9.1 6.50152 9.43873 6.6738 9.6392L7.81823 10.9734C7.84284 11.0045 7.87668 11.0287 7.91052 11.0425C7.94437 11.0598 7.98128 11.0667 8.0182 11.0667H15.014C15.2632 11.0667 15.3862 10.7245 15.2109 10.524L14.0388 9.19332Z" fill="url(#pumpGradient)" />
    <defs>
      <linearGradient id="pumpGradient" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EE86FF" />
        <stop offset="1" stopColor="#6F5FCC" />
      </linearGradient>
    </defs>
  </svg>
);

// Mock active games data matching SolPump exactly
const mockGames: CoinflipGame[] = [
  { id: "1", creator: "Abc...1x2y", amount: 0.0200, creatorSide: "sol", status: "waiting" },
  { id: "2", creator: "Def...3z4w", creatorSide: "pump", amount: 0.0193, status: "waiting" },
  { id: "3", creator: "Ghi...5v6u", creatorSide: "sol", amount: 0.0100, status: "waiting" },
  { id: "4", creator: "Jkl...7t8s", creatorSide: "pump", amount: 0.0500, status: "in-play", opponent: "Mno...9r0q" },
  { id: "5", creator: "Pqr...1a2b", creatorSide: "sol", amount: 0.0200, status: "in-play", opponent: "Stu...3c4d" },
  { id: "6", creator: "Vwx...5e6f", creatorSide: "pump", amount: 0.0100, status: "finishing", opponent: "Yza...7g8h" },
];

export default function CoinflipPage() {
  const { connected, publicKey } = useWallet();
  const [games, setGames] = useState<CoinflipGame[]>(mockGames);
  const [betAmount, setBetAmount] = useState("0");
  const [selectedSide, setSelectedSide] = useState<CoinSide>("sol");
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest");
  const [flippingGameId, setFlippingGameId] = useState<string | null>(null);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Sort games
  const sortedGames = [...games].sort((a, b) => {
    if (sortBy === "highest") return b.amount - a.amount;
    return a.amount - b.amount;
  });

  const handleHalf = () => {
    const current = parseFloat(betAmount) || 0;
    setBetAmount((current / 2).toFixed(4));
  };

  const handleDouble = () => {
    const current = parseFloat(betAmount) || 0;
    setBetAmount((current * 2).toFixed(4));
  };

  const handleMax = () => {
    setBetAmount("10.0000");
  };

  const handleCreateGame = () => {
    if (!connected || !betAmount || parseFloat(betAmount) <= 0) return;

    const newGame: CoinflipGame = {
      id: Date.now().toString(),
      creator: shortAddress,
      amount: parseFloat(betAmount),
      creatorSide: selectedSide,
      status: "waiting",
    };

    setGames((prev) => [newGame, ...prev]);
    setBetAmount("0");
  };

  const handleJoinGame = (gameId: string) => {
    if (!connected) return;

    setFlippingGameId(gameId);
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId ? { ...game, status: "in-play" as const, opponent: shortAddress } : game
      )
    );

    // Simulate result after 2 seconds
    setTimeout(() => {
      setGames((prev) =>
        prev.map((game) => {
          if (game.id === gameId) {
            const playerWins = Math.random() > 0.5;
            return {
              ...game,
              status: "finishing" as const,
              winner: playerWins ? shortAddress : game.creator,
            };
          }
          return game;
        })
      );
      setFlippingGameId(null);

      // Remove completed game after 3 seconds
      setTimeout(() => {
        setGames((prev) => prev.filter((game) => game.id !== gameId));
      }, 3000);
    }, 2000);
  };

  const getStatusClass = (status: GameStatus) => {
    switch (status) {
      case "waiting": return "coinflip-status-joinable";
      case "in-play": return "coinflip-status-inplay";
      case "finishing": return "coinflip-status-finishing";
    }
  };

  const getStatusText = (status: GameStatus) => {
    switch (status) {
      case "waiting": return "JOINABLE";
      case "in-play": return "IN-PLAY";
      case "finishing": return "FINISHING";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header Section with gradient background */}
      <div className="coinflip-header-bg rounded-xl p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Left: Title */}
          <div>
            <span className="text-[#767676] text-[11px] font-spacegrotesk font-medium block mb-1">
              Pick a side and flip
            </span>
            <h1 className="font-chakra text-4xl md:text-5xl font-bold text-white tracking-wide">
              COINFLIP
            </h1>
            <span className="text-[#767676] text-[11px] font-spacegrotesk mt-1 block">
              57 Active Flips
            </span>
          </div>

          {/* Right: Bet Controls */}
          <div className="flex flex-wrap items-end gap-4">
            {/* Bet Amount Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#767676] text-[11px] font-spacegrotesk font-medium">Bet Amount</span>
                <span className="text-[#555] text-[11px] font-spacegrotesk">($0.00)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="coinflip-input-container flex h-10 items-center rounded-lg overflow-hidden">
                  <div className="flex items-center px-3 h-full border-r border-[#272727]">
                    <SolCoinIcon size={16} />
                  </div>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-24 h-full bg-transparent px-3 text-white text-[14px] font-chakra font-bold focus:outline-none"
                    placeholder="0"
                    step="0.0001"
                    min="0"
                  />
                </div>

                <button
                  onClick={handleHalf}
                  className="h-10 px-4 rounded-lg default-submit-small-button text-white text-[11px] font-spacegrotesk font-bold"
                >
                  1/2
                </button>
                <button
                  onClick={handleDouble}
                  className="h-10 px-4 rounded-lg default-submit-small-button text-white text-[11px] font-spacegrotesk font-bold"
                >
                  2x
                </button>
                <button
                  onClick={handleMax}
                  className="h-10 px-4 rounded-lg default-submit-small-button text-white text-[11px] font-spacegrotesk font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Choose Side */}
            <div>
              <span className="text-[#767676] text-[11px] font-spacegrotesk font-medium block mb-2">Choose Side</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSide("sol")}
                  className={`coinflip-side-btn w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedSide === "sol" ? "active-sol" : ""
                  }`}
                >
                  <SolCoinIcon size={20} />
                </button>
                <button
                  onClick={() => setSelectedSide("pump")}
                  className={`coinflip-side-btn w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedSide === "pump" ? "active-pump" : ""
                  }`}
                >
                  <PumpCoinIcon size={20} />
                </button>
              </div>
            </div>

            {/* Create Flip */}
            <div>
              {connected ? (
                <button
                  onClick={handleCreateGame}
                  className="coinflip-create-btn h-10 px-6 rounded-lg text-white font-spacegrotesk text-[13px] font-bold flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create Flip
                </button>
              ) : (
                <WalletMultiButton className="!h-10 !rounded-lg !px-6 !font-spacegrotesk !text-[13px] !font-bold" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ALL GAMES Section */}
      <div className="coinflip-games-container rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#272727]">
          <div className="flex items-center gap-3">
            <span className="font-spacegrotesk text-[12px] font-bold text-white tracking-wider">ALL GAMES</span>
            <span className="text-[#767676] text-[11px] font-spacegrotesk">
              {sortedGames.length} games
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#767676] text-[11px] font-spacegrotesk">Sort By:</span>
            <button
              onClick={() => setSortBy(sortBy === "highest" ? "lowest" : "highest")}
              className="coinflip-sort-dropdown flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-white font-spacegrotesk font-medium hover:bg-[rgba(39,39,39,0.72)] transition-colors"
            >
              {sortBy === "highest" ? "Highest Price" : "Lowest Price"}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Games List */}
        <div className="divide-y divide-[#1a1a1a]">
          {sortedGames.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full coinflip-avatar-empty flex items-center justify-center">
                <PumpCoinIcon size={32} className="opacity-30" />
              </div>
              <p className="text-[#767676] text-[13px] font-spacegrotesk">No active games</p>
              <p className="text-[#555] text-[11px] font-spacegrotesk mt-1">Create one to start playing!</p>
            </div>
          ) : (
            sortedGames.map((game) => (
              <div
                key={game.id}
                className="coinflip-game-card flex items-center justify-between px-5 py-4"
              >
                {/* Left: Players */}
                <div className="flex items-center gap-5">
                  {/* Creator Avatar with coin indicator */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full coinflip-avatar flex items-center justify-center overflow-hidden ${
                      flippingGameId === game.id ? "animate-coin-glow" : ""
                    }`}>
                      <span className="text-white text-sm font-bold font-chakra">{game.creator.charAt(0).toUpperCase()}</span>
                    </div>
                    {/* Coin indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#141317] ${
                      game.creatorSide === "sol" ? "coinflip-sol-coin" : "coinflip-pump-coin"
                    }`}>
                      {game.creatorSide === "sol" ? (
                        <span className="text-[8px] font-bold text-black">S</span>
                      ) : (
                        <span className="text-[8px] font-bold text-white">P</span>
                      )}
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="coinflip-vs-divider w-px h-8"></div>
                  <span className="text-[#555] text-[10px] font-bold font-spacegrotesk tracking-wider">VS</span>
                  <div className="coinflip-vs-divider w-px h-8"></div>

                  {/* Opponent */}
                  {game.opponent ? (
                    <div className={`w-12 h-12 rounded-full coinflip-avatar flex items-center justify-center ${
                      flippingGameId === game.id ? "animate-coin-glow" : ""
                    }`}>
                      <span className="text-white text-sm font-bold font-chakra">{game.opponent.charAt(0).toUpperCase()}</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full coinflip-avatar-empty flex items-center justify-center">
                      <span className="text-[#555] text-xl">?</span>
                    </div>
                  )}
                </div>

                {/* Center: Amount & Status */}
                <div className="flex items-center gap-8">
                  <div className="coinflip-amount-box flex items-center gap-2 px-4 py-2.5 rounded-lg">
                    <SolCoinIcon size={18} />
                    <span className="font-chakra text-[16px] font-bold text-white">
                      {game.amount.toFixed(4)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-spacegrotesk font-bold tracking-wider ${getStatusClass(game.status)}`}>
                    {getStatusText(game.status)}
                  </span>
                </div>

                {/* Right: Action */}
                <div className="flex items-center gap-3">
                  {game.status === "waiting" && game.creator !== shortAddress && (
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      disabled={!connected}
                      className="coinflip-join-btn h-10 px-8 rounded-lg text-black font-spacegrotesk text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Join Flip
                    </button>
                  )}

                  {game.status === "in-play" && (
                    <div className="h-10 px-6 rounded-lg bg-[rgba(178,124,253,0.12)] border border-[rgba(178,124,253,0.3)] flex items-center justify-center">
                      <span className="coinflip-status-inplay text-[12px] font-spacegrotesk font-bold">
                        {flippingGameId === game.id ? "FLIPPING..." : "IN-PLAY"}
                      </span>
                    </div>
                  )}

                  {game.status === "finishing" && (
                    <div className="h-10 px-6 rounded-lg bg-[rgba(255,214,107,0.12)] border border-[rgba(255,214,107,0.3)] flex items-center justify-center">
                      <span className="coinflip-status-finishing text-[12px] font-spacegrotesk font-bold">
                        {game.winner === shortAddress ? "YOU WON!" : "FINISHED"}
                      </span>
                    </div>
                  )}

                  {game.creator === shortAddress && game.status === "waiting" && (
                    <span className="text-[11px] text-[#767676] font-spacegrotesk">Your game</span>
                  )}

                  {/* Watch icon */}
                  <button className="w-10 h-10 rounded-lg default-submit-small-button flex items-center justify-center text-[#767676] hover:text-white transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
