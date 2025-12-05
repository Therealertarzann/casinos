"use client";

import { FC, useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type GameState = "waiting" | "running" | "crashed";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  bet: number;
  status: "playing" | "cashed" | "joined" | "lost";
  cashoutMultiplier?: number;
  profit?: number;
}

// Mock players matching SolPump exactly
const mockPlayers: Player[] = [
  { id: "1", name: "DirtyKumqu...", bet: 0.0019, status: "joined" },
  { id: "2", name: "YoungsScr...", bet: 0.0025, status: "joined" },
  { id: "3", name: "DirectShawl...", bet: 0.0125, status: "joined" },
  { id: "4", name: "CryptoKing...", bet: 0.0500, status: "cashed", cashoutMultiplier: 2.34, profit: 0.067 },
  { id: "5", name: "SolanaMax...", bet: 0.0250, status: "cashed", cashoutMultiplier: 1.85, profit: 0.0212 },
  { id: "6", name: "PumpDegen...", bet: 0.1000, status: "playing" },
  { id: "7", name: "MoonBoi42...", bet: 0.0150, status: "playing" },
];

// Mock history matching screenshot exactly
const mockHistory = [1.94, 1.06, 1.00, 1.68, 2.96, 1.00, 1.89, 1.00, 1.22, 1.78, 22.40, 1.82, 1.12, 2.01, 1.54, 6.82, 1.00, 1.42, 29.81, 1.17, 2.35, 1.06, 10.76, 1.00, 1.04];

// SOL Coin Icon Component
const SolCoinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="url(#solGradientCrash)" />
    <defs>
      <linearGradient id="solGradientCrash" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#03E1FF" />
      </linearGradient>
    </defs>
  </svg>
);

export default function CrashPage() {
  const { connected, publicKey } = useWallet();
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState("0");
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [autoCashout, setAutoCashout] = useState("2.00");
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(14);
  const [crashPoint, setCrashPoint] = useState(0);
  const [history, setHistory] = useState<number[]>(mockHistory);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Generate random crash point
  const generateCrashPoint = () => {
    const houseEdge = 0.01;
    const r = Math.random();
    if (r < houseEdge) return 1.0;
    return Math.floor((100 / (r * 100)) * 100) / 100;
  };

  // Draw exact SolPump retro 3D grid with glowing orb
  const drawChart = useCallback((currentMultiplier: number, crashed: boolean, isWaiting: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark background - exact SolPump color
    ctx.fillStyle = "#080810";
    ctx.fillRect(0, 0, width, height);

    // Draw 3D perspective grid - cyan/teal color like SolPump
    const gridColor = "#1a3a4a";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Horizon line position (higher up)
    const horizonY = height * 0.25;

    // Horizontal lines (floor) - perspective lines getting closer together toward horizon
    ctx.globalAlpha = 0.6;
    for (let i = 0; i <= 20; i++) {
      const progress = i / 20;
      const y = horizonY + (height - horizonY) * Math.pow(progress, 0.6);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines - converging to center horizon
    const centerX = width * 0.5;
    for (let i = 0; i <= 40; i++) {
      const xBottom = (width / 40) * i;
      const xTop = centerX + (xBottom - centerX) * 0.02;
      ctx.beginPath();
      ctx.moveTo(xBottom, height);
      ctx.lineTo(xTop, horizonY);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Y-axis labels on right side
    ctx.fillStyle = "#4a5a6a";
    ctx.font = "11px 'Space Grotesk', sans-serif";
    ctx.textAlign = "right";
    const labels = ["5.00x", "4.50x", "4.00x", "3.50x", "3.00x", "2.50x", "2.00x", "1.50x", "1.00x", "0.50x", "0.00x"];
    labels.forEach((label, i) => {
      const y = 50 + i * ((height - 100) / labels.length);
      ctx.fillText(label, width - 20, y);
    });

    if (isWaiting) {
      // Draw glowing orb in center during countdown
      const orbX = width * 0.55;
      const orbY = height * 0.4;
      const orbRadius = 35;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 3);
      outerGlow.addColorStop(0, "rgba(2, 223, 152, 0.15)");
      outerGlow.addColorStop(0.5, "rgba(2, 223, 152, 0.05)");
      outerGlow.addColorStop(1, "rgba(2, 223, 152, 0)");
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Main orb gradient
      const orbGradient = ctx.createRadialGradient(orbX - 10, orbY - 10, 0, orbX, orbY, orbRadius);
      orbGradient.addColorStop(0, "#5DFFC4");
      orbGradient.addColorStop(0.4, "#02DF98");
      orbGradient.addColorStop(1, "#00A070");
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = orbGradient;
      ctx.fill();

      // Inner highlight
      const highlight = ctx.createRadialGradient(orbX - 12, orbY - 12, 0, orbX - 12, orbY - 12, orbRadius * 0.4);
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.beginPath();
      ctx.arc(orbX - 12, orbY - 12, orbRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      return;
    }

    // Calculate curve points during running state
    if (!isWaiting && currentMultiplier > 1) {
      const points: { x: number; y: number }[] = [];
      const startX = 60;
      const maxX = width - 140;
      const endX = Math.min(startX + (currentMultiplier - 1) * 150, maxX);

      for (let x = startX; x <= endX; x += 2) {
        const progress = (x - startX) / (maxX - startX);
        const mult = 1 + progress * (currentMultiplier - 1);
        const normalizedMult = Math.min((mult - 1) / 4, 1);
        const y = height - 80 - normalizedMult * (height - 180);
        points.push({ x, y: Math.max(80, Math.min(y, height - 80)) });
      }

      if (points.length > 1) {
        // Glow effect
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = crashed ? "rgba(255, 71, 87, 0.3)" : "rgba(2, 223, 152, 0.3)";
        ctx.lineWidth = 20;
        ctx.stroke();

        // Main line with gradient
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        const gradient = ctx.createLinearGradient(startX, height, endX, 0);
        if (crashed) {
          gradient.addColorStop(0, "#ff4757");
          gradient.addColorStop(1, "#ff6b7a");
        } else {
          gradient.addColorStop(0, "#02DF98");
          gradient.addColorStop(1, "#5DFFC4");
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Rocket at end
        if (!crashed && points.length > 0) {
          const lastPoint = points[points.length - 1];

          // Rocket glow
          ctx.beginPath();
          ctx.arc(lastPoint.x + 5, lastPoint.y, 18, 0, Math.PI * 2);
          const glowGrad = ctx.createRadialGradient(lastPoint.x + 5, lastPoint.y, 0, lastPoint.x + 5, lastPoint.y, 22);
          glowGrad.addColorStop(0, "rgba(2, 223, 152, 0.8)");
          glowGrad.addColorStop(1, "rgba(2, 223, 152, 0)");
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Rocket flame/trail
          ctx.beginPath();
          const trailGrad = ctx.createLinearGradient(lastPoint.x - 50, lastPoint.y, lastPoint.x, lastPoint.y);
          trailGrad.addColorStop(0, "rgba(2, 223, 152, 0)");
          trailGrad.addColorStop(0.7, "rgba(2, 223, 152, 0.7)");
          trailGrad.addColorStop(1, "#02DF98");
          ctx.moveTo(lastPoint.x - 45, lastPoint.y + 6);
          ctx.lineTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(lastPoint.x - 45, lastPoint.y - 6);
          ctx.fillStyle = trailGrad;
          ctx.fill();

          // Rocket body
          ctx.beginPath();
          ctx.moveTo(lastPoint.x + 15, lastPoint.y);
          ctx.lineTo(lastPoint.x - 5, lastPoint.y - 8);
          ctx.lineTo(lastPoint.x - 5, lastPoint.y + 8);
          ctx.closePath();
          ctx.fillStyle = "#02DF98";
          ctx.fill();
        }
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState === "waiting") {
      drawChart(1, false, true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState("running");
            startTimeRef.current = Date.now();
            const crash = generateCrashPoint();
            setCrashPoint(crash);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    if (gameState === "running") {
      const animate = () => {
        const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
        const newMultiplier = Math.pow(Math.E, elapsed * 0.12);

        if (newMultiplier >= crashPoint && crashPoint > 0) {
          setMultiplier(crashPoint);
          setGameState("crashed");
          drawChart(crashPoint, true, false);
          setHistory(prev => [crashPoint, ...prev.slice(0, 24)]);

          // Update players who didn't cash out
          setPlayers(prev => prev.map(p =>
            p.status === "playing" || p.status === "joined"
              ? { ...p, status: "lost" as const }
              : p
          ));

          setTimeout(() => {
            setGameState("waiting");
            setMultiplier(1.0);
            setHasBet(false);
            setHasCashedOut(false);
            setCountdown(15);
            // Reset players for next round
            setPlayers(mockPlayers);
          }, 3000);
        } else {
          setMultiplier(Math.floor(newMultiplier * 100) / 100);
          drawChart(newMultiplier, false, false);
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [gameState, crashPoint, drawChart]);

  useEffect(() => {
    if (gameState === "waiting") {
      drawChart(1, false, true);
    }
  }, [drawChart, gameState]);

  const handleHalf = () => setBetAmount(((parseFloat(betAmount) || 0) / 2).toString());
  const handleDouble = () => setBetAmount(((parseFloat(betAmount) || 0) * 2).toString());
  const handleMax = () => setBetAmount("10");
  const placeBet = () => { if (connected && gameState === "waiting") setHasBet(true); };
  const cashOut = () => { if (hasBet && !hasCashedOut && gameState === "running") setHasCashedOut(true); };

  const getMultiplierColor = (mult: number) => {
    if (mult >= 10) return "multiplier-bg-history-gold text-[#FFD66B]";
    if (mult >= 2) return "multiplier-bg-history-green text-[#02DF98]";
    return "multiplier-bg-history-purple text-[#B27CFD]";
  };

  const getPlayerStatusClass = (status: Player["status"]) => {
    switch (status) {
      case "cashed": return "crash-status-cashed";
      case "lost": return "crash-status-lost";
      default: return "crash-status-joined";
    }
  };

  const getPlayerStatusText = (status: Player["status"]) => {
    switch (status) {
      case "cashed": return "CASHED";
      case "lost": return "LOST";
      case "playing": return "PLAYING";
      default: return "JOINED";
    }
  };

  const playersCount = players.length;
  const totalBets = players.reduce((acc, p) => acc + p.bet, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0A0A]">
      {/* Top Headline Bar - SOLPUMP: SOLANA'S MOST TRUSTED SOLANA CASINO */}
      <div className="bg-[#0B0A0A] border-b border-[#1a1a1a] px-4 py-2">
        <div className="flex items-center justify-center">
          <span className="text-[#888] text-[11px] font-spacegrotesk tracking-wider uppercase">
            SOLPUMP: SOLANA'S MOST TRUSTED SOLANA CASINO
          </span>
        </div>
      </div>

      {/* Multiplier History Bar - rounded pills like SolPump */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hidden border-b border-[#1a1a1a] bg-[#0B0A0A]">
        {history.map((h, i) => (
          <div
            key={i}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-chakra text-[12px] font-bold shadow-crash-history-shadow ${getMultiplierColor(h)}`}
          >
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      <div className="flex flex-1">
        {/* Left Betting Panel - exact SolPump style */}
        <div className="w-[300px] flex-shrink-0 border-r border-[#1a1a1a] bg-[#0B0A0A] p-4 flex flex-col">
          {/* Bet Amount */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#666] text-[11px] font-spacegrotesk uppercase tracking-wider">Bet Amount</span>
              <span className="text-[#666] text-[11px] font-spacegrotesk">($0.00)</span>
            </div>
            <div className="flex h-10 items-center rounded-lg crash-input-container overflow-hidden">
              <div className="flex items-center px-3 h-full border-r border-[#222]">
                <SolCoinIcon size={16} />
              </div>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="flex-1 h-full bg-transparent px-3 text-white text-[14px] font-chakra font-bold focus:outline-none"
                placeholder="0"
              />
              <div className="flex items-center gap-1 px-2">
                <button onClick={handleHalf} className="h-7 px-2.5 rounded text-[10px] font-bold crash-quick-btn text-white">1/2</button>
                <button onClick={handleDouble} className="h-7 px-2.5 rounded text-[10px] font-bold crash-quick-btn text-white">2x</button>
                <button onClick={handleMax} className="h-7 px-2.5 rounded text-[10px] font-bold crash-quick-btn text-white">MAX</button>
              </div>
            </div>
          </div>

          {/* Auto Cashout */}
          <div className="mb-4">
            <span className="text-[#666] text-[11px] font-spacegrotesk mb-2 block uppercase tracking-wider">Auto Cashout</span>
            <div className="flex h-10 items-center rounded-lg crash-input-container overflow-hidden">
              <button
                onClick={() => setAutoCashoutEnabled(!autoCashoutEnabled)}
                className={`flex items-center justify-center w-10 h-full border-r border-[#222] ${autoCashoutEnabled ? "crash-toggle-on" : "crash-toggle-off"}`}
              >
                {autoCashoutEnabled ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                  </svg>
                )}
              </button>
              <input
                type="number"
                value={autoCashout}
                onChange={(e) => setAutoCashout(e.target.value)}
                className="flex-1 h-full bg-transparent px-3 text-white text-[14px] font-chakra font-bold focus:outline-none"
                placeholder="2.00"
                disabled={!autoCashoutEnabled}
              />
              <div className="flex items-center justify-center w-10 h-full border-l border-[#222] text-[#444]">
                <span className="text-[12px] font-bold">x</span>
              </div>
            </div>
          </div>

          {/* Place Bet / Cashout Button */}
          {connected ? (
            gameState === "running" && hasBet && !hasCashedOut ? (
              <button
                onClick={cashOut}
                className="w-full h-12 rounded-lg font-spacegrotesk text-[14px] font-bold mb-4 crash-cashout-btn text-black"
              >
                Cashout @ {multiplier.toFixed(2)}x
              </button>
            ) : (
              <button
                onClick={placeBet}
                disabled={gameState !== "waiting"}
                className={`w-full h-12 rounded-lg font-spacegrotesk text-[14px] font-bold mb-4 transition-colors ${
                  gameState === "waiting"
                    ? "place-bet-form-submit-button"
                    : "bg-transparent border border-[#272727] text-[#555] cursor-not-allowed"
                }`}
              >
                Place Bet
              </button>
            )
          ) : (
            <button className="w-full h-12 rounded-lg font-spacegrotesk text-[14px] font-bold mb-4 place-bet-form-submit-button">
              Place Bet
            </button>
          )}

          {/* Advanced Betting Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-[#555] text-[11px] font-spacegrotesk mb-4 uppercase tracking-wider hover:text-[#888] transition-colors"
          >
            <span>Advanced Betting</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}>
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
          </button>

          {/* Separator */}
          <div className="border-t border-[#1a1a1a] mb-4" />

          {/* Player Stats Header */}
          <div className="flex items-center justify-between mb-4 crash-stats-header py-2 px-1 -mx-1 rounded">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <span className="text-white text-[13px] font-spacegrotesk font-bold">{playersCount} Playing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SolCoinIcon size={14} />
              <span className="text-white text-[13px] font-chakra font-bold">{totalBets.toFixed(4)}</span>
            </div>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all ${
                  player.status === "cashed" ? "crash-player-entry-cashed" : "crash-player-entry"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#4A3F5F] to-[#2D2640] flex items-center justify-center">
                    <span className="text-white text-[11px] font-bold">{player.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[12px] font-spacegrotesk leading-tight">{player.name}</span>
                    <div className="flex items-center gap-1.5">
                      <SolCoinIcon size={10} />
                      <span className="text-[#666] text-[11px] font-chakra">{player.bet.toFixed(4)}</span>
                      {player.cashoutMultiplier && (
                        <span className="text-[#02DF98] text-[10px] font-chakra">@ {player.cashoutMultiplier}x</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-spacegrotesk font-bold px-2 py-1 rounded ${getPlayerStatusClass(player.status)}`}>
                    {getPlayerStatusText(player.status)}
                  </span>
                  {player.profit && (
                    <div className="text-[#02DF98] text-[10px] font-chakra mt-1">+{player.profit.toFixed(4)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Game Graph Area */}
        <div className="flex-1 relative crash-game-area">
          <canvas
            ref={canvasRef}
            width={900}
            height={500}
            className="w-full h-full"
          />

          {/* Center Display Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginLeft: "30px" }}>
            {gameState === "waiting" ? (
              <div className="text-center">
                <span className="font-chakra text-8xl font-bold text-white drop-shadow-lg">{countdown}</span>
                <div className="mt-3">
                  <p className="text-[#666] text-sm font-spacegrotesk uppercase tracking-widest">New Round</p>
                  <p className="text-[#888] text-xs font-spacegrotesk uppercase tracking-widest mt-1">Starting</p>
                </div>
              </div>
            ) : gameState === "crashed" ? (
              <div className="text-center">
                <span className="font-chakra text-8xl font-bold crash-crashed-multiplier">{multiplier.toFixed(2)}x</span>
                <p className="text-[#ff4757] text-sm mt-3 font-spacegrotesk uppercase tracking-widest">Crashed</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="font-chakra text-8xl font-bold text-white drop-shadow-lg crash-multiplier-text">{multiplier.toFixed(2)}x</span>
                <p className="text-[#666] text-sm mt-3 font-spacegrotesk uppercase tracking-widest">Current Payout</p>
              </div>
            )}
          </div>

          {/* Current Payout Box - bottom right like SolPump */}
          {gameState === "running" && (
            <div className="absolute bottom-6 right-6 crash-payout-box">
              <div className="flex items-center gap-2">
                <span className="text-[#02DF98] text-lg font-chakra font-bold">{multiplier.toFixed(2)}x</span>
                <span className="text-[#666] text-xs font-spacegrotesk uppercase">Payout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
