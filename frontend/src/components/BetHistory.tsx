"use client";

import { FC } from "react";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface Bet {
  id: string;
  game: "crash" | "coinflip" | "jackpot";
  player: string;
  amount: number;
  multiplier?: number;
  result: "win" | "loss";
  payout: number;
  timestamp: Date;
}

const mockBets: Bet[] = [
  { id: "1", game: "crash", player: "8nTv...MWwa", amount: 0.5, multiplier: 2.5, result: "win", payout: 1.25, timestamp: new Date() },
  { id: "2", game: "coinflip", player: "J2Gr...T4EV", amount: 1.0, result: "loss", payout: 0, timestamp: new Date() },
  { id: "3", game: "jackpot", player: "DDtc...vj68", amount: 0.2, result: "win", payout: 1.8, timestamp: new Date() },
  { id: "4", game: "crash", player: "5jVR...VKDF", amount: 0.3, multiplier: 1.0, result: "loss", payout: 0, timestamp: new Date() },
  { id: "5", game: "coinflip", player: "8nTv...MWwa", amount: 2.0, result: "win", payout: 4.0, timestamp: new Date() },
  { id: "6", game: "crash", player: "J2Gr...T4EV", amount: 0.8, multiplier: 3.2, result: "win", payout: 2.56, timestamp: new Date() },
  { id: "7", game: "jackpot", player: "DDtc...vj68", amount: 0.5, result: "loss", payout: 0, timestamp: new Date() },
  { id: "8", game: "crash", player: "5jVR...VKDF", amount: 1.5, multiplier: 1.5, result: "win", payout: 2.25, timestamp: new Date() },
];

const gameColors = {
  crash: "#FF4757",
  coinflip: "#FFD700",
  jackpot: "#9945FF",
};

// SVG icons for each game type
const CrashIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 20L12 4L20 20H4Z" fill="#FF4757" fillOpacity="0.8"/>
    <path d="M12 10V14M12 16V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CoinflipIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FFD700" fillOpacity="0.8"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">S</text>
  </svg>
);

const JackpotIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#9945FF" fillOpacity="0.8"/>
  </svg>
);

const gameIconComponents = {
  crash: CrashIconSVG,
  coinflip: CoinflipIconSVG,
  jackpot: JackpotIconSVG,
};

interface BetHistoryProps {
  filter?: "all" | "crash" | "coinflip" | "jackpot";
  limit?: number;
}

export const BetHistory: FC<BetHistoryProps> = ({ filter = "all", limit = 10 }) => {
  const filteredBets = mockBets
    .filter(bet => filter === "all" || bet.game === filter)
    .slice(0, limit);

  return (
    <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
      <div className="p-4 border-b border-[#2a2a3a]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock size={18} className="text-[#9945FF]" />
            Recent Bets
          </h3>
          <span className="text-sm text-[#8b8b9a]">Live</span>
        </div>
      </div>

      <div className="divide-y divide-[#2a2a3a]">
        {filteredBets.map((bet) => (
          <div
            key={bet.id}
            className="p-4 hover:bg-[#1a1a25] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${gameColors[bet.game]}20` }}
                >
                  {(() => {
                    const IconComponent = gameIconComponents[bet.game];
                    return <IconComponent />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bet.player}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${gameColors[bet.game]}20`,
                        color: gameColors[bet.game],
                      }}
                    >
                      {bet.game}
                    </span>
                  </div>
                  <div className="text-sm text-[#8b8b9a]">
                    Bet {bet.amount} SOL
                    {bet.multiplier && ` @ ${bet.multiplier}x`}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    bet.result === "win" ? "text-[#14F195]" : "text-[#FF4757]"
                  }`}
                >
                  {bet.result === "win" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {bet.result === "win" ? `+${bet.payout.toFixed(2)}` : `-${bet.amount.toFixed(2)}`} SOL
                </div>
                <div className="text-xs text-[#8b8b9a]">
                  {new Date(bet.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
