"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Position = "long" | "short";
type GameState = "waiting" | "betting" | "active" | "settling";

const QUICK_BETS = [0.1, 0.5, 1, 2, 5];
const LEVERAGE_OPTIONS = [2, 5, 10, 25, 50, 100];

// Mock price data
const generatePriceHistory = () => {
  const prices: number[] = [];
  let price = 100;
  for (let i = 0; i < 100; i++) {
    price += (Math.random() - 0.5) * 2;
    prices.push(price);
  }
  return prices;
};

// Mock live positions
const livePositions = [
  { player: "7xKp...3fMn", position: "long" as Position, amount: 2.5, leverage: 10, pnl: 0.45, isProfit: true },
  { player: "9zLm...8kRt", position: "short" as Position, amount: 1.0, leverage: 25, pnl: -0.32, isProfit: false },
  { player: "4aWq...6nYp", position: "long" as Position, amount: 0.5, leverage: 5, pnl: 0.12, isProfit: true },
  { player: "2bNx...9mKl", position: "short" as Position, amount: 3.0, leverage: 50, pnl: 1.85, isProfit: true },
  { player: "8cDf...1pQt", position: "long" as Position, amount: 0.8, leverage: 100, pnl: -0.80, isProfit: false },
];

export default function FuturesPage() {
  const { connected, publicKey } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position>("long");
  const [betAmount, setBetAmount] = useState("0.1");
  const [leverage, setLeverage] = useState(10);
  const [gameState, setGameState] = useState<GameState>("betting");
  const [currentPrice, setCurrentPrice] = useState(100);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [priceHistory, setPriceHistory] = useState<number[]>(generatePriceHistory());
  const [pnl, setPnl] = useState(0);
  const [hasPosition, setHasPosition] = useState(false);

  // Simulate price movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const newPrice = prev[prev.length - 1] + (Math.random() - 0.5) * 1.5;
        return [...prev.slice(1), newPrice];
      });
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 1.5);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Update countdown
  useEffect(() => {
    if (gameState === "betting" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, gameState]);

  // Calculate PnL
  useEffect(() => {
    if (hasPosition && entryPrice) {
      const priceChange = ((currentPrice - entryPrice) / entryPrice) * 100;
      const positionMultiplier = selectedPosition === "long" ? 1 : -1;
      const calculatedPnl = (priceChange * positionMultiplier * leverage * parseFloat(betAmount)) / 100;
      setPnl(calculatedPnl);
    }
  }, [currentPrice, entryPrice, selectedPosition, leverage, betAmount, hasPosition]);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "rgba(32, 16, 52, 0.3)";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(59, 46, 75, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (height / 4) * i);
      ctx.lineTo(width, (height / 4) * i);
      ctx.stroke();
    }

    // Price line
    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    const range = max - min || 1;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#c632fb");
    gradient.addColorStop(1, "#42edbc");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    priceHistory.forEach((price, i) => {
      const x = (i / (priceHistory.length - 1)) * width;
      const y = height - ((price - min) / range) * height * 0.8 - height * 0.1;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under line
    const gradientFill = ctx.createLinearGradient(0, 0, 0, height);
    gradientFill.addColorStop(0, "rgba(66, 237, 188, 0.2)");
    gradientFill.addColorStop(1, "rgba(198, 50, 251, 0)");

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradientFill;
    ctx.fill();

    // Entry price line
    if (entryPrice && hasPosition) {
      const entryY = height - ((entryPrice - min) / range) * height * 0.8 - height * 0.1;
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, entryY);
      ctx.lineTo(width, entryY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [priceHistory, entryPrice, hasPosition]);

  const openPosition = () => {
    if (!connected || hasPosition) return;

    setEntryPrice(currentPrice);
    setHasPosition(true);
    setGameState("active");
  };

  const closePosition = () => {
    if (!hasPosition) return;

    setHasPosition(false);
    setEntryPrice(null);
    setPnl(0);
    setGameState("betting");
  };

  return (
    <div className="min-h-screen pt-[80px] pb-12">
      <div className="wrapper">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg_linear400 flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold font_Astronomus linear700Text">Futures Trading</h1>
              <p className="text-[#868686]">Leverage up to 100x on SOL price movements</p>
            </div>
          </div>

          {/* Live Price */}
          <div className="card-container px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="text-sm text-[#868686]">SOL/USD</div>
              <div className="text-2xl font-bold solText">${currentPrice.toFixed(2)}</div>
              <div className={`text-sm font-medium ${currentPrice >= 100 ? "text-win" : "text-loss"}`}>
                {currentPrice >= 100 ? "+" : ""}{((currentPrice - 100) / 100 * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2">
            <div className="card-container w-full">
              {/* Chart Header */}
              <div className="p-4 border-b-2 border-[#3B2E4B] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-bold">SOL/USD</span>
                  <div className="flex gap-2">
                    {["1m", "5m", "15m", "1h"].map((tf) => (
                      <button
                        key={tf}
                        className="px-3 py-1 rounded-lg text-xs bg-[#3B2E4B]/50 hover:bg-[#3B2E4B] transition-colors"
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#42edbc] live-pulse" />
                  <span className="text-sm text-[#868686]">Live</span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="relative h-[350px] p-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={300}
                  className="w-full h-full"
                />

                {/* Countdown Overlay */}
                {gameState === "betting" && (
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-xl linearBg700 border-2 border-[#3B2E4B]">
                    <div className="text-xs text-[#868686] mb-1">Next Round</div>
                    <div className="text-2xl font-bold text-[#42edbc]">{countdown}s</div>
                  </div>
                )}

                {/* Position Indicator */}
                {hasPosition && (
                  <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-xl ${
                    pnl >= 0 ? "bg-[#42edbc]/20 border-2 border-[#42edbc]" : "bg-[#ff4757]/20 border-2 border-[#ff4757]"
                  }`}>
                    <div className="text-xs text-[#868686] mb-1">PnL</div>
                    <div className={`text-xl font-bold ${pnl >= 0 ? "text-win" : "text-loss"}`}>
                      {pnl >= 0 ? "+" : ""}{pnl.toFixed(4)} SOL
                    </div>
                  </div>
                )}
              </div>

              {/* Trading Controls */}
              <div className="p-6 border-t-2 border-[#3B2E4B]">
                {connected ? (
                  <div className="space-y-6">
                    {!hasPosition ? (
                      <>
                        {/* Position Selection */}
                        <div>
                          <label className="block text-sm text-[#868686] mb-3 uppercase tracking-wider">Position</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setSelectedPosition("long")}
                              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                                selectedPosition === "long"
                                  ? "border-[#42edbc] bg-[#42edbc]/10 shadow-[0_0_30px_rgba(66,237,188,0.3)]"
                                  : "border-[#3B2E4B] hover:border-[#42edbc]/50 linearBg700"
                              }`}
                            >
                              <span className="text-2xl">📈</span>
                              <div>
                                <div className="font-bold text-lg text-[#42edbc]">LONG</div>
                                <div className="text-xs text-[#868686]">Bet on price increase</div>
                              </div>
                            </button>
                            <button
                              onClick={() => setSelectedPosition("short")}
                              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                                selectedPosition === "short"
                                  ? "border-[#ff4757] bg-[#ff4757]/10 shadow-[0_0_30px_rgba(255,71,87,0.3)]"
                                  : "border-[#3B2E4B] hover:border-[#ff4757]/50 linearBg700"
                              }`}
                            >
                              <span className="text-2xl">📉</span>
                              <div>
                                <div className="font-bold text-lg text-[#ff4757]">SHORT</div>
                                <div className="text-xs text-[#868686]">Bet on price decrease</div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Amount & Leverage Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Bet Amount */}
                          <div>
                            <label className="block text-sm text-[#868686] mb-2 uppercase tracking-wider">Amount (SOL)</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="w-full h-10 bg-[#201F27] border border-[#272727] rounded-lg px-3 text-lg text-white focus:outline-none focus:border-[#72509F]"
                                step="0.1"
                                min="0.01"
                              />
                            </div>
                            <div className="flex gap-1 mt-2">
                              {QUICK_BETS.slice(0, 3).map((qb) => (
                                <button
                                  key={qb}
                                  onClick={() => setBetAmount(qb.toString())}
                                  className="flex-1 px-2 py-1 bg-[#3B2E4B] rounded-lg text-xs hover:bg-[#c632fb]/30 transition-colors"
                                >
                                  {qb}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Leverage */}
                          <div>
                            <label className="block text-sm text-[#868686] mb-2 uppercase tracking-wider">Leverage</label>
                            <div className="grid grid-cols-3 gap-2">
                              {LEVERAGE_OPTIONS.map((lev) => (
                                <button
                                  key={lev}
                                  onClick={() => setLeverage(lev)}
                                  className={`py-2 rounded-xl text-sm font-bold transition-all ${
                                    leverage === lev
                                      ? "bg_linear400 text-black"
                                      : "bg-[#3B2E4B] hover:bg-[#c632fb]/30"
                                  }`}
                                >
                                  {lev}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Open Position Button */}
                        <button
                          onClick={openPosition}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                            selectedPosition === "long"
                              ? "bg-[#42edbc] text-black hover:shadow-[0_0_40px_rgba(66,237,188,0.5)] hover:scale-[1.02]"
                              : "bg-[#ff4757] text-white hover:shadow-[0_0_40px_rgba(255,71,87,0.5)] hover:scale-[1.02]"
                          }`}
                        >
                          OPEN {selectedPosition.toUpperCase()} {leverage}x
                        </button>

                        {/* Potential Win */}
                        <div className="text-center text-sm text-[#868686]">
                          Position size: <span className="text-white font-bold">{(parseFloat(betAmount) * leverage).toFixed(2)} SOL</span>
                          <span className="mx-2">|</span>
                          Liquidation at: <span className="text-[#ff4757] font-bold">{(100 / leverage).toFixed(1)}%</span> move
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Active Position Info */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="linearBg700 rounded-xl p-4 border-2 border-[#3B2E4B]">
                            <div className="text-xs text-[#868686] mb-1">Position</div>
                            <div className={`font-bold ${selectedPosition === "long" ? "text-[#42edbc]" : "text-[#ff4757]"}`}>
                              {selectedPosition.toUpperCase()} {leverage}x
                            </div>
                          </div>
                          <div className="linearBg700 rounded-xl p-4 border-2 border-[#3B2E4B]">
                            <div className="text-xs text-[#868686] mb-1">Entry Price</div>
                            <div className="font-bold">${entryPrice?.toFixed(2)}</div>
                          </div>
                          <div className="linearBg700 rounded-xl p-4 border-2 border-[#3B2E4B]">
                            <div className="text-xs text-[#868686] mb-1">Size</div>
                            <div className="font-bold">{(parseFloat(betAmount) * leverage).toFixed(2)} SOL</div>
                          </div>
                          <div className={`rounded-xl p-4 border-2 ${
                            pnl >= 0 ? "border-[#42edbc] bg-[#42edbc]/10" : "border-[#ff4757] bg-[#ff4757]/10"
                          }`}>
                            <div className="text-xs text-[#868686] mb-1">PnL</div>
                            <div className={`font-bold ${pnl >= 0 ? "text-win" : "text-loss"}`}>
                              {pnl >= 0 ? "+" : ""}{pnl.toFixed(4)} SOL
                            </div>
                          </div>
                        </div>

                        {/* Close Position Button */}
                        <button
                          onClick={closePosition}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                            pnl >= 0
                              ? "bg-[#42edbc] text-black hover:shadow-[0_0_40px_rgba(66,237,188,0.5)]"
                              : "bg-[#ff4757] text-white hover:shadow-[0_0_40px_rgba(255,71,87,0.5)]"
                          }`}
                        >
                          CLOSE POSITION ({pnl >= 0 ? "+" : ""}{pnl.toFixed(4)} SOL)
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#3B2E4B]/50 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#B27CFD"/>
                      </svg>
                    </div>
                    <p className="text-[#868686] mb-6 text-lg">Connect your wallet to trade futures</p>
                    <WalletMultiButton className="!rounded-xl !h-12 !px-8 !font-semibold !text-black" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Info */}
            <div className="card-container w-full p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z" fill="#B27CFD"/>
                </svg>
                Market Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#3B2E4B]/50">
                  <span className="text-[#868686]">24h High</span>
                  <span className="font-bold text-[#42edbc]">$108.42</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#3B2E4B]/50">
                  <span className="text-[#868686]">24h Low</span>
                  <span className="font-bold text-[#ff4757]">$94.18</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#3B2E4B]/50">
                  <span className="text-[#868686]">24h Volume</span>
                  <span className="font-bold">$2.4B</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#3B2E4B]/50">
                  <span className="text-[#868686]">Open Interest</span>
                  <span className="font-bold">$847M</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#868686]">Funding Rate</span>
                  <span className="font-bold text-[#42edbc]">0.01%</span>
                </div>
              </div>
            </div>

            {/* Live Positions */}
            <div className="card-container w-full">
              <div className="p-4 border-b-2 border-[#3B2E4B]">
                <h3 className="font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#42edbc] live-pulse" />
                  Live Positions
                </h3>
              </div>
              <div className="max-h-[250px] overflow-y-auto">
                {livePositions.map((pos, i) => (
                  <div key={i} className="p-3 border-b border-[#3B2E4B]/50 last:border-0 bet-row">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          pos.position === "long" ? "bg-[#42edbc]/20 text-[#42edbc]" : "bg-[#ff4757]/20 text-[#ff4757]"
                        }`}>
                          {pos.position.toUpperCase()} {pos.leverage}x
                        </span>
                        <span className="text-sm text-[#868686]">{pos.player}</span>
                      </div>
                      <span className={`text-sm font-bold ${pos.isProfit ? "text-win" : "text-loss"}`}>
                        {pos.isProfit ? "+" : ""}{pos.pnl.toFixed(2)} SOL
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Warning */}
            <div className="card-container w-full p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-bold text-[#FFD700] mb-1">High Risk Trading</div>
                  <p className="text-xs text-[#868686]">
                    Leveraged trading carries significant risk. You can lose more than your initial investment.
                    Only trade with funds you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
