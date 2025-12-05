"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

type UserRole = "user" | "streamer" | "mod" | "owner";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  level: number;
  avatar?: string;
  role?: UserRole;
}

// Mock chat messages matching SolPump style
const initialMessages: ChatMessage[] = [
  { id: "1", sender: "TOTA🧎‍♂️ KINGTONHUFF", message: "Let's go! Just won 2x on coinflip!", timestamp: new Date(Date.now() - 60000), level: 26, role: "user" },
  { id: "2", sender: "Quanks130", message: "GM everyone", timestamp: new Date(Date.now() - 50000), level: 13, role: "user" },
  { id: "3", sender: "Bluey", message: "Just lost 0.4 haha", timestamp: new Date(Date.now() - 40000), level: 16, role: "user" },
  { id: "4", sender: "MNTrenches", message: "Live on kick now!", timestamp: new Date(Date.now() - 30000), level: 50, role: "streamer" },
  { id: "5", sender: "Support3", message: "Need help? DM me!", timestamp: new Date(Date.now() - 20000), level: 99, role: "mod" },
  { id: "6", sender: "mental_x_trench", message: "w tip", timestamp: new Date(Date.now() - 10000), level: 2, role: "user" },
];

export const LiveChat: FC = () => {
  const { connected, publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [airdropTime, setAirdropTime] = useState(3329); // seconds (55:29)
  const [onlineCount, setOnlineCount] = useState(310);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Countdown timer for airdrop
  useEffect(() => {
    const timer = setInterval(() => {
      setAirdropTime((prev) => {
        if (prev <= 0) return 3600;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "Nice win!",
        "Who's playing crash?",
        "Let's gooo!",
        "GM!",
        "50x incoming",
        "Coinflip is hot rn",
        "Just doubled up",
        "Gold now",
        "w comeback",
      ];
      const randomSenders = ["Wyattt", "Notryan", "Enes{QUIN}", "WSTARW", "FragrantGuide3602", "LeBugara"];
      const randomLevels = [2, 5, 8, 12, 13, 16, 17, 26];

      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: randomSenders[Math.floor(Math.random() * randomSenders.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          level: randomLevels[Math.floor(Math.random() * randomLevels.length)],
          role: "user",
        };
        setMessages((prev) => [...prev.slice(-20), newMsg]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelClass = (level: number) => {
    if (level >= 50) return "chat-box-level-50";
    if (level >= 25) return "chat-box-level-25";
    return "chat-box-level-5";
  };

  const getLevelTextClass = (level: number) => {
    if (level >= 50) return "chat-box-level-50-text";
    if (level >= 25) return "chat-box-level-25-text";
    return "chat-box-level-5-text";
  };

  const getAvatarBorderClass = (role?: UserRole) => {
    switch (role) {
      case "streamer":
        return "bg-gradient-to-b from-[#26CBFF] to-[#035B77]";
      case "mod":
        return "bg-gradient-to-b from-[#28FFD4] to-[#00A470]";
      case "owner":
        return "bg-gradient-to-b from-[#C98C7A] to-[#FF5B5B]";
      default:
        return "bg-[#929292]";
    }
  };

  const getMessageBgClass = (role?: UserRole) => {
    switch (role) {
      case "streamer":
        return "chat-message-streamer-bg";
      case "mod":
        return "chat-message-mod-bg";
      default:
        return "chat-message-user-bg";
    }
  };

  const getUsernameClass = (role?: UserRole) => {
    switch (role) {
      case "mod":
        return "bg-gradient-to-b from-[#70FFD1] to-[#079466] bg-clip-text text-transparent hover:text-[#3CCA9C]";
      case "streamer":
        return "text-white";
      default:
        return "text-white hover:avatar-username-text-shadow";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: shortAddress,
      message: newMessage.trim(),
      timestamp: new Date(),
      level: 5,
      role: "user",
    };

    setMessages((prev) => [...prev.slice(-20), msg]);
    setNewMessage("");
  };

  const renderRoleBadge = (role?: UserRole, level?: number) => {
    if (role === "streamer") {
      return (
        <div className="flex h-3.5 min-w-5 items-center justify-center self-center rounded-[4px] px-1 text-xs md:h-4 md:min-w-6 md:text-sm chat-box-streamer">
          <svg width="14" height="8" viewBox="0 0 14 8" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-3 md:w-auto">
            <path d="M7.91904 0H1.53173C0.689278 0 0 0.670391 0 1.48976V6.51024C0 7.32961 0.689278 8 1.53173 8H7.91904C8.76149 8 9.45077 7.32961 9.45077 6.51024V1.48976C9.45077 0.655494 8.76149 0 7.91904 0Z"></path>
            <path d="M12.8665 0.819367C12.7746 0.834264 12.6827 0.878957 12.6061 0.92365L10.2166 2.26443V5.72067L12.6214 7.06145C13.0656 7.31471 13.6171 7.16574 13.8775 6.73371C13.954 6.59963 14 6.45065 14 6.28678V1.68343C14 1.13222 13.4639 0.685289 12.8665 0.819367Z"></path>
          </svg>
        </div>
      );
    }
    if (role === "mod") {
      return (
        <div className="flex h-3.5 min-w-5 items-center justify-center self-center rounded-[4px] px-1 text-xs md:h-4 md:min-w-6 md:text-sm chat-box-mod">
          <svg width="10" height="13" viewBox="0 0 10 13" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-2 md:w-auto">
            <path d="M9.73708 1.58547L5.12168 0.0202398C5.04255 -0.00650244 4.95743 -0.00650244 4.8783 0.0202398L0.262919 1.58547C0.105923 1.63872 1.01323e-10 1.78825 1.01323e-10 1.95667V5.09402C-2.30367e-05 9.58438 3.92858 12.0002 5 12.0002C5.76871 12.0002 10 9.87433 10 5.09399V1.95665C10 1.78825 9.89408 1.63869 9.73708 1.58547ZM8.46153 5.09486C8.46153 8.49487 5.56876 10.3213 4.99998 10.322V1.65393C5.11475 1.65416 8.08944 2.67541 8.19834 2.71223C8.35533 2.76533 8.46151 2.91501 8.46151 3.08352L8.46153 5.09486Z" fill="white"></path>
          </svg>
        </div>
      );
    }
    return (
      <div className={`flex h-3.5 min-w-5 items-center justify-center self-center rounded-[4px] px-1 text-xs md:h-4 md:min-w-6 md:text-sm ${getLevelClass(level || 5)}`}>
        <span className={`font-chakra text-[10px] font-bold leading-[13px] md:text-[11.5px] md:leading-[15px] ${getLevelTextClass(level || 5)}`}>
          {level}
        </span>
      </div>
    );
  };

  return (
    <section className="absolute top-[68px] z-[100] flex h-[calc(100%-68px)] w-[300px] flex-col gap-0.5 transition-transform duration-500 max-lg:bg-[#0B0A0A] md:top-[73px] lg:h-[calc(100%-73px)] lgxl:relative lgxl:top-0 lgxl:h-full max-lgxl:-translate-x-full hidden lg:flex lg:translate-x-0">
      {/* Airdrop Banner - Exact SolPump structure */}
      <div className="absolute z-10 flex w-full items-center justify-center bg-[#121215] p-2.5">
        <div className="pointer-events-none absolute top-[94%] z-10 h-[48px] w-full airdrop-chat-overlay-bg"></div>
        <div className="w-full rounded-lg bg-[#1E1922] p-1.5">
          <div className="relative w-full overflow-hidden rounded-lg">
            <div className="p-[1px]">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-[#72519b] to-transparent"></div>
              <div className="relative flex h-[110px] flex-shrink-0 flex-col justify-center overflow-hidden rounded-lg font-chakra airdrop-bg">
                <div className="flex flex-col gap-2.5 px-3 h-full justify-center bg-cover bg-center">
                  <div className="relative flex items-center gap-8 pl-2">
                    <div className="relative">
                      <span className="font-spacegrotesk text-[11px] font-bold text-[#B27CFD]">AIRDROP</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex w-full items-center overflow-hidden rounded-lg">
                      <div className="h-9 max-h-9 w-full overflow-hidden rounded-l-lg bg-[linear-gradient(to_bottom_right,_#B27CFD3D_0%,_#B27CFD3D_45%,_#17151D_75%,_#17151D_100%)] p-px pr-0">
                        <div className="flex h-full w-full items-center gap-[5px] rounded-l-lg pl-1.5 airdrop-amount-bg">
                          <div className="relative z-10 size-7 rounded-full bg-gradient-to-b from-[#72509F] to-[#B27CFD] flex items-center justify-center">
                            <span className="text-xs font-bold">$</span>
                          </div>
                          <div className="relative z-10 flex flex-col gap-1 font-chakra font-bold">
                            <div className="text-[18px] leading-[100%] text-[#02DF98]">0.05</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-r-lg transition-opacity duration-300 airdrop-tip-btn hover:opacity-80">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5312 7.09651H13.2791C13.0284 7.77955 12.6609 8.40181 12.2028 8.93635H13.25C13.5087 8.93635 13.7188 9.15713 13.7188 9.42916C13.7188 9.70119 13.5087 9.92197 13.25 9.92197H2.75C2.49125 9.92197 2.28125 9.70119 2.28125 9.42916C2.28125 9.15713 2.49125 8.93635 2.75 8.93635H3.79719C3.33906 8.40181 2.97156 7.77955 2.72094 7.09651H0.46875C0.21 7.09651 0 7.31729 0 7.58932V11.7618H16V7.58932C16 7.31729 15.79 7.09651 15.5312 7.09651Z"></path>
                          <path d="M5.18 8.93635H10.82C11.9719 8.03088 12.7188 6.58596 12.7188 4.96099C12.7188 2.22554 10.6019 0 8 0C5.39812 0 3.28125 2.22554 3.28125 4.96099C3.28125 6.58596 4.02812 8.03088 5.18 8.93635Z"></path>
                          <path d="M0 15.5072C0 15.7792 0.21 16 0.46875 16H15.5312C15.79 16 16 15.7792 16 15.5072V12.7474H0V15.5072Z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex h-9 w-[68px] flex-shrink-0 items-center justify-center rounded-lg border border-[#272727] bg-transparent font-spacegrotesk text-base font-bold text-[#767676]">
                      {formatTime(airdropTime)}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="flex h-0.5 w-full items-center justify-center">
                    <div className="flex h-0.5 w-full justify-start rounded-[5px] bg-[#17151D]">
                      <div className="h-full rounded-[5px] crash-game-progress-bar" style={{ width: `${((3600 - airdropTime) / 3600) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Container - Exact SolPump structure */}
      <div className="flex flex-grow flex-col max-lg:relative">
        <div className="flex h-px flex-grow flex-col overflow-y-auto pl-1 pr-0.5 pt-[140px] scrollbar-hidden chat-message-bg">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative border-t border-[#FFFFFF08] font-spacegrotesk will-change-transform ${getMessageBgClass(msg.role)}`}
            >
              <div className="flex h-full w-full items-start gap-3 bg-[linear-gradient(135deg,_rgba(0,_0,_0,_0)_50%,_rgba(0,_0,_0,_0.24)_100%)] pb-4 pl-2.5 pr-3 pt-3.5 md:pb-[22px] md:pl-3 md:pr-4 md:pt-[20px]">
                {/* Avatar with border */}
                <div className={`rounded-[5px] p-px will-change-transform md:rounded-lg ${getAvatarBorderClass(msg.role)}`}>
                  <div className="relative flex flex-shrink-0 cursor-pointer items-center justify-center max-md:size-8 md:rounded-lg size-[40px] rounded-[5px] bg-[#212124] bg-none">
                    <div className="max-md:size-[26px] size-[34px] rounded-[3px] md:rounded-[5px] bg-gradient-to-b from-[#72509F] to-[#3a2850] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{msg.sender.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-1.5 font-bold max-md:text-[13px]">
                    {/* Username */}
                    <div className={`max-w-[150px] cursor-pointer overflow-hidden truncate whitespace-nowrap text-sm transition-all duration-150 md:text-[15.5px] ${getUsernameClass(msg.role)}`}>
                      {msg.sender}
                    </div>
                    {/* Level/Role Badge */}
                    {renderRoleBadge(msg.role, msg.level)}
                  </div>
                  {/* Message */}
                  <span className="max-w-[200px] overflow-hidden break-words font-spacegrotesk text-[11.5px] font-bold leading-tight text-[#A1A1A1] md:text-[13.5px]">
                    {msg.message}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - Exact SolPump structure */}
      <div className="chat-bottom-input-bg px-3 py-2.5">
        {/* Chat Type Selector */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#272727] bg-[#201F27]">
            <span className="text-sm text-white font-spacegrotesk">General Chat</span>
            <svg className="w-4 h-4 text-[#767676]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center gap-1 text-[#02DF98]">
            <span className="text-sm font-bold font-spacegrotesk">+ {onlineCount}</span>
          </div>
        </div>

        {/* Input */}
        {connected ? (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 h-9 px-3 rounded-lg bg-[#272727] border border-[#272727] text-sm text-white placeholder-[#767676] focus:outline-none focus:border-[#72509F] font-spacegrotesk"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="h-9 px-4 rounded-lg place-bet-form-submit-button disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        ) : (
          <div className="text-center text-sm text-[#767676] py-2 font-spacegrotesk">
            Connect wallet to chat
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-3 py-2 border-t border-[#171717]">
        <div className="flex items-center justify-between text-xs font-spacegrotesk">
          <span className="text-[#767676]">8,830,802</span>
          <span className="text-[#767676]">Total Bets</span>
        </div>
      </div>
    </section>
  );
};

export default LiveChat;
