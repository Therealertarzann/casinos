"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type ProfileTab = "statistics" | "transfer" | "transactions" | "settings";
type TimeRange = "24H" | "7D" | "1M" | "ALL";

interface Transaction {
  id: string;
  round: string;
  time: string;
  betAmount: number;
  finalMulti: string;
  payout: number;
  game: string;
}

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<ProfileTab>("statistics");
  const [timeRange, setTimeRange] = useState<TimeRange>("24H");
  const [nickname, setNickname] = useState("RewardingNerve8746");
  const [email, setEmail] = useState("");
  const [clientSeed, setClientSeed] = useState("****************************");
  const [volume, setVolume] = useState(100);
  const [selectedGame, setSelectedGame] = useState("Crash");

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 10)}...`
    : "RewardingN...";

  // Mock stats data matching screenshot
  const stats = {
    gamesPlayed: 20,
    totalWagered: 3.4,
    netProfit: -0.5,
  };

  // Mock chart data points for the profit graph
  const chartData = [1.0, 0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4, -0.6, -0.8, -1.0];

  // Mock transactions
  const transactions: Transaction[] = [];

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "statistics", label: "Statistics" },
    { id: "transfer", label: "Transfer Funds" },
    { id: "transactions", label: "Transactions" },
    { id: "settings", label: "Settings" },
  ];

  const timeRanges: TimeRange[] = ["24H", "7D", "1M", "ALL"];

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-chakra text-2xl font-bold text-white mb-4">
            Connect Wallet to View Profile
          </h1>
          <WalletMultiButton className="!h-10 !rounded-lg !px-6 !font-spacegrotesk !text-[13px] !font-bold !bg-[#B27CFD] hover:!bg-[#9B6AE8] !text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-chakra text-2xl font-bold text-white">PROFILE</h1>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#4A3F5F] to-[#2D2640] flex items-center justify-center overflow-hidden border-2 border-[#B27CFD]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#888">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>

            {/* Name and Join Date */}
            <div>
              <h2 className="font-spacegrotesk text-white text-[15px] font-medium">
                {shortAddress}
              </h2>
              <p className="text-[#555] text-[11px] font-spacegrotesk">
                Joined on 12/04/2025
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Level badge */}
              <div className="w-6 h-6 rounded bg-[#B27CFD] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">4</span>
              </div>
              {/* Progress bar */}
              <div className="w-32 h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B27CFD] to-[#02DF98]"
                  style={{ width: "16.8%" }}
                />
              </div>
              {/* XP */}
              <span className="text-white text-[12px] font-chakra font-bold">
                2100<span className="text-[#555]">/12500</span>
              </span>
            </div>
            {/* Next level badge */}
            <div className="w-6 h-6 rounded bg-[#02DF98] flex items-center justify-center">
              <span className="text-black text-[10px] font-bold">5</span>
            </div>
          </div>

          {/* Disconnect Button */}
          <button className="h-9 px-4 rounded-lg bg-[#ff4757]/20 hover:bg-[#ff4757]/30 text-[#ff4757] text-[12px] font-spacegrotesk font-medium transition-colors">
            Disconnect
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-9 px-4 rounded-lg text-[12px] font-spacegrotesk font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#B27CFD] text-white"
                : "bg-[#1a1a1a] text-[#666] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "statistics" && (
        <div>
          <h3 className="font-spacegrotesk text-white text-[14px] font-bold mb-4">
            YOUR STATS
          </h3>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Games Played */}
            <div className="rounded-xl border border-[#1a1a1a] bg-gradient-to-b from-[#1a1025] to-[#0d0d0d] p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#B27CFD">
                  <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <span className="text-[#666] text-[11px] font-spacegrotesk">
                  Games played
                </span>
              </div>
              <p className="font-chakra text-3xl font-bold text-white">
                {stats.gamesPlayed}
              </p>
            </div>

            {/* Total SOL Wagered */}
            <div className="rounded-xl border border-[#1a1a1a] bg-gradient-to-b from-[#1a1025] to-[#0d0d0d] p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="url(#solGradientStats)" />
                  <defs>
                    <linearGradient id="solGradientStats" x1="12" y1="2" x2="12" y2="22">
                      <stop stopColor="#00FFA3" />
                      <stop offset="1" stopColor="#03E1FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-[#666] text-[11px] font-spacegrotesk">
                  Total SOL Wagered
                </span>
              </div>
              <p className="font-chakra text-3xl font-bold text-white">
                {stats.totalWagered.toFixed(1)}
              </p>
            </div>

            {/* Net Profit */}
            <div className="rounded-xl border border-[#1a1a1a] bg-gradient-to-b from-[#1a1025] to-[#0d0d0d] p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4757">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
                <span className="text-[#666] text-[11px] font-spacegrotesk">
                  Net Profit
                </span>
              </div>
              <p className={`font-chakra text-3xl font-bold ${
                stats.netProfit >= 0 ? "text-[#02DF98]" : "text-[#ff4757]"
              }`}>
                {stats.netProfit.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-4">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`h-8 px-3 rounded-lg text-[11px] font-spacegrotesk font-medium transition-colors ${
                  timeRange === range
                    ? "bg-[#B27CFD] text-white"
                    : "bg-[#1a1a1a] text-[#666] hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Profit Chart */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4 h-64 relative">
            {/* Y-axis labels */}
            <div className="absolute right-4 top-4 bottom-4 flex flex-col justify-between text-[10px] text-[#555] font-spacegrotesk">
              <span>1.0000</span>
              <span>0.8000</span>
              <span className="text-[#02DF98]">0.2000</span>
              <span>-0.2000</span>
              <span>-0.6000</span>
              <span className="text-[#ff4757]">-1.00...</span>
            </div>
            {/* Chart placeholder - horizontal line at 0 */}
            <div className="absolute left-4 right-16 top-1/2 h-px bg-[#333]" />
            <div className="absolute left-4 right-16 top-1/2 transform -translate-y-1/2">
              <svg className="w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path
                  d="M0,50 Q50,30 100,45 T200,60 T300,40 T400,55"
                  fill="none"
                  stroke="#B27CFD"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeTab === "transfer" && (
        <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-6">
          <h3 className="font-spacegrotesk text-white text-[14px] font-bold mb-4">
            TRANSFER FUNDS
          </h3>
          <p className="text-[#666] text-[13px] font-spacegrotesk">
            Transfer funds between your wallets
          </p>
        </div>
      )}

      {activeTab === "transactions" && (
        <div>
          {/* Game Filter */}
          <div className="flex items-center gap-2 mb-4">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#1a1a1a] border border-[#272727] text-white text-[12px] font-spacegrotesk focus:outline-none focus:border-[#B27CFD]"
            >
              <option value="Crash">Crash</option>
              <option value="Coinflip">Coinflip</option>
              <option value="Blackjack">Blackjack</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#1a1a1a] text-[11px] text-[#666] font-spacegrotesk">
              <span>Round</span>
              <span>Time</span>
              <span>Bet Amount</span>
              <span>Final Multi</span>
              <span>Payout</span>
            </div>

            {/* Empty State */}
            {transactions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[#555] text-[13px] font-spacegrotesk">
                  No transactions yet
                </p>
              </div>
            )}

            {/* Transaction Rows */}
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#1a1a1a] text-[12px] font-spacegrotesk hover:bg-[#111]"
              >
                <span className="text-white">{tx.round}</span>
                <span className="text-[#666]">{tx.time}</span>
                <span className="text-white">{tx.betAmount} SOL</span>
                <span className="text-[#B27CFD]">{tx.finalMulti}x</span>
                <span className={tx.payout >= 0 ? "text-[#02DF98]" : "text-[#ff4757]"}>
                  {tx.payout >= 0 ? "+" : ""}{tx.payout} SOL
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-lg">
          {/* Avatar Section */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-b from-[#4A3F5F] to-[#2D2640] flex items-center justify-center overflow-hidden border-2 border-[#B27CFD]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#888">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#B27CFD] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Nickname */}
          <div className="mb-6">
            <label className="block text-[#666] text-[11px] font-spacegrotesk mb-2">
              Nickname
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg bg-[#141317] border border-[#272727] text-white text-[13px] font-spacegrotesk focus:outline-none focus:border-[#B27CFD]"
              />
              <button className="h-10 px-5 rounded-lg bg-[#B27CFD] hover:bg-[#9B6AE8] text-white text-[12px] font-spacegrotesk font-bold transition-colors">
                Save
              </button>
            </div>
          </div>

          {/* Account Email */}
          <div className="mb-6">
            <label className="block text-[#666] text-[11px] font-spacegrotesk mb-2">
              Account email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-10 px-3 rounded-lg bg-[#141317] border border-[#272727] text-white text-[13px] font-spacegrotesk placeholder:text-[#444] focus:outline-none focus:border-[#B27CFD]"
              />
              <button className="h-10 px-5 rounded-lg bg-[#B27CFD] hover:bg-[#9B6AE8] text-white text-[12px] font-spacegrotesk font-bold transition-colors">
                Save
              </button>
            </div>
          </div>

          {/* Client Seed */}
          <div className="mb-6">
            <label className="block text-[#666] text-[11px] font-spacegrotesk mb-2">
              Client Seed
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={clientSeed}
                readOnly
                className="flex-1 h-10 px-3 rounded-lg bg-[#141317] border border-[#272727] text-white text-[13px] font-spacegrotesk focus:outline-none"
              />
              <button className="h-10 px-5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-white text-[12px] font-spacegrotesk font-medium transition-colors border border-[#272727]">
                Edit
              </button>
            </div>
          </div>

          {/* Overall Volume */}
          <div className="mb-8">
            <label className="block text-[#666] text-[11px] font-spacegrotesk mb-2">
              Overall Volume
            </label>
            <div className="flex items-center gap-3">
              <span className="text-white text-[13px] font-spacegrotesk w-10">
                {volume}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full bg-[#1a1a1a] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#B27CFD]"
                style={{
                  background: `linear-gradient(to right, #B27CFD 0%, #B27CFD ${volume}%, #1a1a1a ${volume}%, #1a1a1a 100%)`,
                }}
              />
            </div>
          </div>

          {/* Connected Accounts */}
          <div>
            <label className="block text-[#666] text-[11px] font-spacegrotesk mb-3">
              Connected Accounts
            </label>
            <div className="rounded-xl border border-[#272727] bg-[#141317] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <div>
                    <p className="text-white text-[13px] font-spacegrotesk font-medium">
                      Google
                    </p>
                    <p className="text-[#555] text-[10px] font-spacegrotesk">
                      Not Connected
                    </p>
                  </div>
                </div>
                <button className="h-9 px-5 rounded-lg bg-[#B27CFD] hover:bg-[#9B6AE8] text-white text-[12px] font-spacegrotesk font-bold transition-colors">
                  Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
