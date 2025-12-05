"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Gift, Zap, Clock, Trophy, TrendingUp, Star, Calendar } from "lucide-react";

interface Reward {
  id: string;
  type: "daily" | "hourly" | "level";
  amount: number;
  claimed: boolean;
  timestamp: Date;
}

export default function RewardsPage() {
  const { connected, publicKey } = useWallet();
  const [dailyAvailable, setDailyAvailable] = useState(true);
  const [hourlyCountdown, setHourlyCountdown] = useState(47 * 60 + 23); // 47:23
  const [dailyCountdown, setDailyCountdown] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState(5);
  const [totalWagered, setTotalWagered] = useState(125.5);
  const [rewardHistory, setRewardHistory] = useState<Reward[]>([
    { id: "1", type: "daily", amount: 0.012, claimed: true, timestamp: new Date(Date.now() - 86400000) },
    { id: "2", type: "hourly", amount: 0.005, claimed: true, timestamp: new Date(Date.now() - 3600000) },
    { id: "3", type: "level", amount: 0.1, claimed: true, timestamp: new Date(Date.now() - 172800000) },
  ]);

  // Countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setHourlyCountdown((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const claimDaily = () => {
    if (!connected || !dailyAvailable || isOpening) return;

    setIsOpening(true);

    // Simulate opening animation
    setTimeout(() => {
      const prizes = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.5, 1.0];
      const weights = [30, 25, 20, 10, 8, 4, 2, 0.8, 0.2];
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const random = Math.random() * totalWeight;

      let cumulative = 0;
      let selectedPrize = prizes[0];
      for (let i = 0; i < prizes.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
          selectedPrize = prizes[i];
          break;
        }
      }

      setReward(selectedPrize);
      setDailyAvailable(false);
      setDailyCountdown(86400); // 24 hours

      setRewardHistory((prev) => [
        { id: Date.now().toString(), type: "daily", amount: selectedPrize, claimed: true, timestamp: new Date() },
        ...prev,
      ]);
    }, 2000);
  };

  const levelRewards = [
    { level: 1, wagered: 10, reward: 0.05 },
    { level: 2, wagered: 25, reward: 0.1 },
    { level: 3, wagered: 50, reward: 0.2 },
    { level: 4, wagered: 100, reward: 0.5 },
    { level: 5, wagered: 250, reward: 1.0 },
    { level: 6, wagered: 500, reward: 2.0 },
    { level: 7, wagered: 1000, reward: 5.0 },
    { level: 8, wagered: 2500, reward: 10.0 },
    { level: 9, wagered: 5000, reward: 25.0 },
    { level: 10, wagered: 10000, reward: 50.0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
          <Gift size={24} className="text-[#FFD700]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Rewards</h1>
          <p className="text-sm text-[#8b8b9a]">Claim your daily rewards and level up!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Case */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a3a]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="text-[#FFD700]" />
                  Daily Free Case
                </h2>
                {!dailyAvailable && (
                  <div className="flex items-center gap-2 text-[#8b8b9a]">
                    <Clock size={16} />
                    <span>{formatTime(dailyCountdown)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {connected ? (
                <div className="text-center">
                  {/* Case Display */}
                  <div
                    className={`relative w-48 h-48 mx-auto mb-6 ${
                      isOpening ? "animate-pulse" : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                        reward
                          ? "from-[#14F195] to-[#00D4FF]"
                          : "from-[#FFD700] to-[#FFA500]"
                      } flex items-center justify-center transition-all duration-500`}
                      style={{
                        boxShadow: `0 0 ${reward ? "60" : "30"}px ${
                          reward ? "rgba(20, 241, 149, 0.5)" : "rgba(255, 215, 0, 0.3)"
                        }`,
                        transform: isOpening && !reward ? "scale(1.1) rotateY(180deg)" : "scale(1)",
                      }}
                    >
                      {reward ? (
                        <div>
                          <div className="text-5xl mb-2">🎉</div>
                          <div className="text-3xl font-bold text-white">{reward} SOL</div>
                        </div>
                      ) : (
                        <div className="text-7xl">📦</div>
                      )}
                    </div>
                  </div>

                  {/* Claim Button */}
                  {!reward && (
                    <button
                      onClick={claimDaily}
                      disabled={!dailyAvailable || isOpening}
                      className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                        dailyAvailable && !isOpening
                          ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0a0a0f] hover:opacity-90"
                          : "bg-[#2a2a3a] text-[#8b8b9a] cursor-not-allowed"
                      }`}
                    >
                      {isOpening ? "Opening..." : dailyAvailable ? "Open Free Case" : `Available in ${formatTime(dailyCountdown)}`}
                    </button>
                  )}

                  {reward && (
                    <div className="space-y-4">
                      <p className="text-[#14F195] font-semibold text-lg">
                        Congratulations! You won {reward} SOL!
                      </p>
                      <button
                        onClick={() => {
                          setReward(null);
                          setIsOpening(false);
                        }}
                        className="px-6 py-3 bg-[#1a1a25] border border-[#2a2a3a] rounded-xl hover:border-[#9945FF] transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {/* Prize Table */}
                  <div className="mt-8 grid grid-cols-3 gap-2 text-sm">
                    {[
                      { amount: "0.001", chance: "30%" },
                      { amount: "0.002", chance: "25%" },
                      { amount: "0.005", chance: "20%" },
                      { amount: "0.01", chance: "10%" },
                      { amount: "0.02", chance: "8%" },
                      { amount: "0.05", chance: "4%" },
                      { amount: "0.1", chance: "2%" },
                      { amount: "0.5", chance: "0.8%" },
                      { amount: "1.0", chance: "0.2%" },
                    ].map((prize) => (
                      <div
                        key={prize.amount}
                        className="p-2 bg-[#1a1a25] rounded-lg text-center"
                      >
                        <div className="font-medium text-[#FFD700]">{prize.amount} SOL</div>
                        <div className="text-[#8b8b9a] text-xs">{prize.chance}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#8b8b9a] mb-4">Connect your wallet to claim rewards</p>
                  <WalletMultiButton className="!bg-gradient-to-r !from-[#FFD700] !to-[#FFA500] !rounded-xl !h-12 !px-6 !font-medium !text-[#0a0a0f]" />
                </div>
              )}
            </div>
          </div>

          {/* Hourly Airdrop */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Zap className="text-[#9945FF]" />
                Hourly Airdrop
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#9945FF]/10 rounded-full">
                <Clock size={16} className="text-[#9945FF]" />
                <span className="font-mono font-bold text-[#9945FF]">{formatTime(hourlyCountdown)}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#8b8b9a] mb-4">
                  Every hour, we distribute SOL to active players! To qualify:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#14F195"/>
                      </svg>
                    </div>
                    Bet at least 0.001 SOL in the past hour
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#14F195"/>
                      </svg>
                    </div>
                    Be active in the chat
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#14F195]/20 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#14F195"/>
                      </svg>
                    </div>
                    Winners selected randomly
                  </li>
                </ul>
              </div>
              <div className="bg-[#1a1a25] rounded-xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#9945FF] mb-1">0.5 SOL</div>
                  <div className="text-sm text-[#8b8b9a] mb-4">Current Prize Pool</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xl font-bold">5</div>
                      <div className="text-[#8b8b9a]">Winners</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">234</div>
                      <div className="text-[#8b8b9a]">Eligible</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Level */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="text-[#FFD700]" />
              Your Level
            </h3>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold gradient-text">{userLevel}</div>
              <div className="text-sm text-[#8b8b9a]">Total Wagered: {totalWagered} SOL</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8b8b9a]">Progress to Level {userLevel + 1}</span>
                <span>{Math.round((totalWagered / levelRewards[userLevel]?.wagered || 1) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full"
                  style={{
                    width: `${Math.min((totalWagered / (levelRewards[userLevel]?.wagered || 250)) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-[#8b8b9a]">
                {levelRewards[userLevel]?.wagered - totalWagered > 0
                  ? `${(levelRewards[userLevel]?.wagered - totalWagered).toFixed(1)} SOL to next level`
                  : "Max level reached!"}
              </div>
            </div>
          </div>

          {/* Level Rewards */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
            <div className="p-4 border-b border-[#2a2a3a]">
              <h3 className="font-semibold flex items-center gap-2">
                <Trophy className="text-[#FFD700]" />
                Level Rewards
              </h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {levelRewards.map((lr) => (
                <div
                  key={lr.level}
                  className={`p-3 border-b border-[#2a2a3a] last:border-0 ${
                    lr.level <= userLevel ? "bg-[#14F195]/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          lr.level <= userLevel
                            ? "bg-[#14F195] text-[#0a0a0f]"
                            : "bg-[#2a2a3a]"
                        }`}
                      >
                        {lr.level}
                      </div>
                      <div>
                        <div className="font-medium text-sm">Level {lr.level}</div>
                        <div className="text-xs text-[#8b8b9a]">{lr.wagered} SOL wagered</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#FFD700]">{lr.reward} SOL</div>
                      {lr.level <= userLevel && (
                        <div className="text-xs text-[#14F195]">Claimed</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Rewards */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden">
            <div className="p-4 border-b border-[#2a2a3a]">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="text-[#14F195]" />
                Recent Rewards
              </h3>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {rewardHistory.map((r) => (
                <div key={r.id} className="p-3 border-b border-[#2a2a3a] last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm capitalize">{r.type} Reward</div>
                      <div className="text-xs text-[#8b8b9a]">
                        {r.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-semibold text-[#14F195]">+{r.amount} SOL</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
