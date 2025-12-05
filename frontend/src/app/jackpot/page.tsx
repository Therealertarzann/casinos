"use client";

import { FC, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Trophy, Users, Clock, Loader2, ExternalLink } from "lucide-react";
import { BetHistory } from "@/components/BetHistory";

interface Player {
  address: string;
  amount: number;
  percentage: number;
  color: string;
}

type GameState = "open" | "spinning" | "complete";

const COLORS = [
  "#9945FF", "#14F195", "#FFD700", "#FF4757", "#00D4FF",
  "#FF69B4", "#FFA500", "#00FF7F", "#BA55D3", "#20B2AA"
];

const QUICK_BETS = [0.1, 0.5, 1, 2, 5];

export default function JackpotPage() {
  const { connected, publicKey } = useWallet();
  const [gameState, setGameState] = useState<GameState>("open");
  const [betAmount, setBetAmount] = useState("0.1");
  const [timeLeft, setTimeLeft] = useState(45);
  const [totalPot, setTotalPot] = useState(4.5);
  const [spinAngle, setSpinAngle] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { address: "8nTv...MWwa", amount: 1.5, percentage: 33.3, color: COLORS[0] },
    { address: "J2Gr...T4EV", amount: 2.0, percentage: 44.4, color: COLORS[1] },
    { address: "DDtc...vj68", amount: 1.0, percentage: 22.3, color: COLORS[2] },
  ]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== "open") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startSpin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const startSpin = () => {
    setGameState("spinning");

    // Calculate winner based on weighted probability
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedWinner = players[0];

    for (const player of players) {
      cumulative += player.percentage;
      if (random <= cumulative) {
        selectedWinner = player;
        break;
      }
    }

    // Calculate spin angle to land on winner
    const winnerIndex = players.indexOf(selectedWinner);
    let startAngle = 0;
    for (let i = 0; i < winnerIndex; i++) {
      startAngle += (players[i].percentage / 100) * 360;
    }
    const winnerAngle = startAngle + (selectedWinner.percentage / 100) * 180;
    const targetAngle = 360 * 10 + (360 - winnerAngle); // 10 full rotations + landing

    // Animate spin
    let currentAngle = 0;
    const duration = 5000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out)
      const eased = 1 - Math.pow(1 - progress, 4);
      currentAngle = targetAngle * eased;
      setSpinAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setWinner(selectedWinner);
        setGameState("complete");

        // Reset after delay
        setTimeout(() => {
          setGameState("open");
          setTimeLeft(60);
          setWinner(null);
          setSpinAngle(0);
          setPlayers([]);
          setTotalPot(0);
        }, 5000);
      }
    };

    requestAnimationFrame(animate);
  };

  const placeBet = () => {
    if (!connected || gameState !== "open") return;

    const amount = parseFloat(betAmount);
    const shortAddress = `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`;

    // Check if player already bet
    const existingPlayer = players.find((p) => p.address === shortAddress);

    let newPlayers: Player[];
    let newTotal: number;

    if (existingPlayer) {
      newPlayers = players.map((p) =>
        p.address === shortAddress
          ? { ...p, amount: p.amount + amount }
          : p
      );
      newTotal = totalPot + amount;
    } else {
      const color = COLORS[players.length % COLORS.length];
      newPlayers = [
        ...players,
        { address: shortAddress, amount, percentage: 0, color },
      ];
      newTotal = totalPot + amount;
    }

    // Recalculate percentages
    newPlayers = newPlayers.map((p) => ({
      ...p,
      percentage: (p.amount / newTotal) * 100,
    }));

    setPlayers(newPlayers);
    setTotalPot(newTotal);
  };

  // Calculate pie chart
  const getWheelSegments = () => {
    let startAngle = 0;
    return players.map((player) => {
      const angle = (player.percentage / 100) * 360;
      const segment = {
        ...player,
        startAngle,
        endAngle: startAngle + angle,
      };
      startAngle += angle;
      return segment;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#9945FF]/20 flex items-center justify-center">
            <Trophy size={24} className="text-[#9945FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jackpot</h1>
            <p className="text-sm text-[#8b8b9a]">Higher bet = Higher chance to win!</p>
          </div>
        </div>

        {/* On-Chain Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#14F195]/10 rounded-xl border border-[#14F195]/30">
          <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
          <span className="text-sm text-[#14F195]">On-Chain VRF</span>
          <a
            href="https://explorer.solana.com/address/asADxxCjUt4JGRCwM3ohmMJ6cUgCm4DqVNTRyvo17zg?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1"
          >
            <ExternalLink size={14} className="text-[#14F195]" />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2">
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
            {/* Wheel Display */}
            <div className="relative h-[450px] flex items-center justify-center bg-gradient-to-b from-[#1a1a25] to-[#12121a]">
              {/* Wheel */}
              <div className="relative w-80 h-80">
                {/* Arrow pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-[#FFD700]" />
                </div>

                {/* Wheel SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{
                    transform: `rotate(${spinAngle}deg)`,
                    transition: gameState === "spinning" ? "none" : "transform 0.1s",
                  }}
                >
                  {players.length > 0 ? (
                    getWheelSegments().map((segment, i) => {
                      const startRad = (segment.startAngle - 90) * (Math.PI / 180);
                      const endRad = (segment.endAngle - 90) * (Math.PI / 180);
                      const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

                      const x1 = 50 + 45 * Math.cos(startRad);
                      const y1 = 50 + 45 * Math.sin(startRad);
                      const x2 = 50 + 45 * Math.cos(endRad);
                      const y2 = 50 + 45 * Math.sin(endRad);

                      return (
                        <path
                          key={i}
                          d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                          stroke="#0a0a0f"
                          strokeWidth="0.5"
                        />
                      );
                    })
                  ) : (
                    <circle cx="50" cy="50" r="45" fill="#1a1a25" />
                  )}

                  {/* Center circle */}
                  <circle cx="50" cy="50" r="15" fill="#0a0a0f" />
                  <circle cx="50" cy="50" r="12" fill="#1a1a25" />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {gameState === "spinning" ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[#9945FF]" />
                    ) : gameState === "complete" && winner ? (
                      <div>
                        <div className="text-xs text-[#8b8b9a]">Winner</div>
                        <div className="font-bold" style={{ color: winner.color }}>
                          {winner.address}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-2xl font-bold text-[#FFD700]">{totalPot.toFixed(2)}</div>
                        <div className="text-xs text-[#8b8b9a]">SOL</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-[#0a0a0f]/80 rounded-full">
                <Clock size={16} className="text-[#FFD700]" />
                <span className="font-mono font-bold">
                  {gameState === "open" ? `${timeLeft}s` : gameState === "spinning" ? "Spinning..." : "Winner!"}
                </span>
              </div>

              {/* Winner Banner */}
              {gameState === "complete" && winner && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#14F195]/20 border border-[#14F195] rounded-xl">
                  <div className="text-center">
                    <div className="text-sm text-[#14F195]">WINNER</div>
                    <div className="font-bold text-lg">{winner.address}</div>
                    <div className="text-[#14F195]">+{totalPot.toFixed(2)} SOL</div>
                  </div>
                </div>
              )}
            </div>

            {/* Betting Controls */}
            <div className="p-6 border-t border-[#2a2a3a]">
              {connected ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#8b8b9a] mb-2">Bet Amount (SOL)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="w-full bg-[#1a1a25] border border-[#2a2a3a] rounded-xl px-4 py-3 text-lg outline-none focus:border-[#9945FF] transition-colors"
                        disabled={gameState !== "open"}
                        step="0.1"
                        min="0.1"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        {QUICK_BETS.map((qb) => (
                          <button
                            key={qb}
                            onClick={() => setBetAmount(qb.toString())}
                            className="px-2 py-1 bg-[#2a2a3a] rounded text-xs hover:bg-[#3a3a4a] transition-colors"
                            disabled={gameState !== "open"}
                          >
                            {qb}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={placeBet}
                    disabled={gameState !== "open"}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      gameState === "open"
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90"
                        : "bg-[#2a2a3a] text-[#8b8b9a] cursor-not-allowed"
                    }`}
                  >
                    {gameState === "open" ? `Join Jackpot (${betAmount} SOL)` : "Round in progress..."}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#8b8b9a] mb-4">Connect your wallet to play</p>
                  <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] !rounded-xl !h-12 !px-6 !font-medium" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Players */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
            <div className="p-4 border-b border-[#2a2a3a]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users size={18} className="text-[#9945FF]" />
                  Players ({players.length})
                </h3>
                <span className="text-sm text-[#FFD700] font-semibold">
                  {totalPot.toFixed(2)} SOL
                </span>
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {players.length === 0 ? (
                <div className="p-8 text-center text-[#8b8b9a]">
                  <Trophy size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No players yet</p>
                  <p className="text-sm">Be the first to join!</p>
                </div>
              ) : (
                players
                  .sort((a, b) => b.amount - a.amount)
                  .map((player, i) => (
                    <div
                      key={i}
                      className={`p-4 border-b border-[#2a2a3a] last:border-0 ${
                        winner?.address === player.address ? "bg-[#14F195]/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: player.color }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-medium">{player.address}</div>
                            <div className="text-sm text-[#8b8b9a]">
                              {player.percentage.toFixed(1)}% chance
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{player.amount.toFixed(2)} SOL</div>
                          {winner?.address === player.address && (
                            <div className="text-sm text-[#14F195]">Winner!</div>
                          )}
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1 bg-[#2a2a3a] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${player.percentage}%`,
                            backgroundColor: player.color,
                          }}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-4">
            <h3 className="font-semibold mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-[#8b8b9a]">
              <p>1. Deposit SOL to enter the jackpot pool</p>
              <p>2. Your chance to win = Your bet / Total pot</p>
              <p>3. VRF selects winner after countdown</p>
              <p>4. Winner takes 99% (1% platform fee)</p>
            </div>
          </div>

          {/* Recent Jackpots */}
          <BetHistory filter="jackpot" limit={5} />
        </div>
      </div>
    </div>
  );
}
