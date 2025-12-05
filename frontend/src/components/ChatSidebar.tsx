"use client";

import { FC, useState, useEffect } from "react";

interface ChatMessage {
  id: string;
  user: string;
  badge?: string;
  badgeColor?: string;
  message: string;
  avatar?: string;
  isAdmin?: boolean;
}

const mockMessages: ChatMessage[] = [
  { id: "1", user: "Unfortunat...", badge: "0", message: "oh get a crash at 25 give they keep up seeing $5", isAdmin: false },
  { id: "2", user: "Psychmasters", badge: "0", message: "That' is hvme now", isAdmin: false },
  { id: "3", user: "KunkaButz", badge: "0", message: "20 chesse airdrop o won amaz I flip it on flip", isAdmin: false },
  { id: "4", user: "2rmP99", badge: "0", message: "You shall Fozzzle", isAdmin: false },
  { id: "5", user: "Psychmasters", badge: "0", message: "just about", isAdmin: false },
  { id: "6", user: "KunkaButz", badge: "0", message: "Pay g been winning person", isAdmin: false },
  { id: "7", user: "KunkaButz", badge: "0", message: "Lessen bout pose $46", isAdmin: false },
  { id: "8", user: "court", badge: "0", message: "I did hell him", isAdmin: false },
];

export const ChatSidebar: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("General Chat");
  const [airdropAmount, setAirdropAmount] = useState(0.12);
  const [airdropTime, setAirdropTime] = useState({ hours: 21, minutes: 23 });
  const [onlineCount, setOnlineCount] = useState(291);

  // Countdown timer for airdrop
  useEffect(() => {
    const timer = setInterval(() => {
      setAirdropTime(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: inputMessage,
      badge: "1",
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
  };

  const formatTime = () => {
    return `${airdropTime.hours.toString().padStart(2, '0')}:${airdropTime.minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed left-0 top-[52px] bottom-0 w-[180px] border-r border-[#1a1a1a] bg-[#0B0A0A] flex flex-col z-50 hidden lg:flex">
      {/* AIRDROP Banner - Exact SolPump style */}
      <div className="p-2.5">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1033] via-[#150d20] to-[#0d0d1a] border border-[#2a1a4a]/50">
          {/* Sparkle effects */}
          <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-white/30" />
          <div className="absolute top-6 right-6 w-0.5 h-0.5 rounded-full bg-white/20" />

          <div className="p-3 pb-2.5">
            {/* AIRDROP title with sparkle icon */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-chakra text-[15px] font-bold text-white tracking-wide uppercase">Airdrop</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD66B">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
            </div>

            {/* SOL Amount Box */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d0d0d]/80 border border-[#222]">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-[#00FFA3] to-[#03E1FF]" />
                <span className="font-chakra text-[13px] font-bold text-white">{airdropAmount.toFixed(2)}</span>
              </div>

              {/* Timer */}
              <span className="text-[#555] text-[11px] font-spacegrotesk">{formatTime()}</span>
            </div>

            {/* Select Wallet Button */}
            <button className="w-full py-1.5 rounded-lg bg-[#02DF98] hover:bg-[#00C584] text-black text-[11px] font-spacegrotesk font-bold transition-colors">
              Select Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-2.5 space-y-2.5">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2">
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#4A3F5F] to-[#2D2640] flex-shrink-0 flex items-center justify-center overflow-hidden">
              <span className="text-white text-[10px] font-bold">{msg.user.charAt(0)}</span>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-white text-[11px] font-spacegrotesk font-medium truncate max-w-[80px]">{msg.user}</span>
                <span className="text-[#555] text-[10px] font-spacegrotesk">{msg.badge}</span>
              </div>
              <p className="text-[#666] text-[10px] font-spacegrotesk mt-0.5 break-words leading-tight">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Selector Dropdown */}
      <div className="px-2.5 py-2 border-t border-[#1a1a1a]">
        <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] transition-colors">
          <span className="text-white text-[11px] font-spacegrotesk">{selectedChat}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#555">
            <path d="M7 10l5 5 5-5H7z"/>
          </svg>
        </button>
      </div>

      {/* Online Count */}
      <div className="px-2.5 py-1.5 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#02DF98]" />
        <span className="text-[#555] text-[11px] font-spacegrotesk">{onlineCount}</span>
        <span className="text-[#555] text-[10px] font-spacegrotesk">Total Bets</span>
      </div>

      {/* Message Input */}
      <div className="p-2.5 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type..."
            className="flex-1 h-8 px-2.5 rounded-lg bg-[#111] border border-[#222] text-white text-[11px] font-spacegrotesk placeholder:text-[#444] focus:outline-none focus:border-[#B27CFD]"
          />
          {/* Emoji button */}
          <button className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center text-[#555] hover:text-white hover:border-[#333] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 11 8 11zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Total Bets Footer */}
      <div className="px-2.5 py-2 border-t border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <span className="text-[#02DF98] text-[13px] font-chakra font-bold">8,651,881</span>
          <span className="text-[#444] text-[10px] font-spacegrotesk">Total Bets</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
