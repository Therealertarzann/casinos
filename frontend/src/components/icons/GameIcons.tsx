// Exact SVG icons extracted from SolPump.io
export const CrashIcon = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  active ? (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[20px] h-[14px] block ${className}`}>
      <path d="M14 0L16.3 2.68333L11.4 8.4L7.4 3.73333L0 12.3667L1.4 14L7.4 7L11.4 11.6667L17.7 4.31667L20 7V0H14Z" fill="url(#paint0_linear_crash_active)"></path>
      <defs>
        <linearGradient id="paint0_linear_crash_active" x1="10" y1="0" x2="10" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 group-hover:fill-[#A1A1A1] w-[20px] h-[14px] ${className}`}>
      <path d="M14 0L16.3 2.68333L11.4 8.4L7.4 3.73333L0 12.3667L1.4 14L7.4 7L11.4 11.6667L17.7 4.31667L20 7V0H14Z"></path>
    </svg>
  )
);

export const CoinflipIcon = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  active ? (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[22px] h-[22px] block ${className}`}>
      <path d="M22 10.2667C22 4.6057 17.0652 0 11 0C4.93474 0 0 4.6057 0 10.2667C0 10.5143 0.0129355 10.7588 0.0313862 11.0019C0.0105289 11.2765 0 11.5112 0 11.7334C0 17.3944 4.93464 22.0001 11 22.0001C17.0653 22.0001 22 17.3944 22 11.7334C22 11.5108 21.9898 11.2762 21.9686 11.0011C21.9873 10.7584 22 10.5139 22 10.2667ZM11 1.35716C15.9822 1.35716 20.4745 5.61629 20.4745 10.2667C20.4745 14.9172 15.9822 19.1763 11 19.1763C6.01782 19.1763 1.52551 14.9172 1.52551 10.2667C1.52551 5.61629 6.01772 1.35716 11 1.35716ZM11 21.2668C6.98186 21.2668 3.49991 19.0895 1.83343 15.9333C2.15161 16.5357 2.77472 17.1059 3.28151 17.5723C3.83382 18.0805 4.4436 18.5348 5.09729 18.9242C6.4475 19.7291 7.98321 20.2516 9.57197 20.4444C12.9533 20.8555 16.4033 19.751 18.8041 17.4935C19.3117 17.0165 19.769 16.4932 20.1674 15.9334C18.4996 19.0895 15.0177 21.2668 11 21.2668Z" fill="url(#paint0_coinflip_active)"></path>
      <path d="M14.0388 7.94556C14.0141 7.97667 13.9834 8.00087 13.9495 8.01469C13.9157 8.03197 13.8788 8.03889 13.8419 8.03889H6.87377C6.62766 8.03889 6.50152 7.69325 6.6738 7.48586L7.81823 6.12058C7.84284 6.08948 7.87361 6.06528 7.91052 6.048C7.94437 6.03072 7.98128 6.0238 8.0182 6.0238H15.014C15.2632 6.0238 15.3862 6.3729 15.2109 6.58028L14.0388 7.94556ZM14.0388 14.0496C13.9865 14.1083 13.9157 14.1429 13.8419 14.1429H6.87377C6.62766 14.1429 6.50152 13.8042 6.6738 13.6037L7.81823 12.2695C7.84284 12.2384 7.87668 12.2142 7.91052 12.2004C7.94437 12.1831 7.98128 12.1762 8.0182 12.1762H15.014C15.2632 12.1762 15.3862 12.5184 15.2109 12.7189L14.0388 14.0496ZM14.0388 9.19332C13.9865 9.13457 13.9157 9.1 13.8419 9.1H6.87377C6.62766 9.1 6.50152 9.43873 6.6738 9.6392L7.81823 10.9734C7.84284 11.0045 7.87668 11.0287 7.91052 11.0425C7.94437 11.0598 7.98128 11.0667 8.0182 11.0667H15.014C15.2632 11.0667 15.3862 10.7245 15.2109 10.524L14.0388 9.19332Z" fill="url(#paint1_coinflip_active)"></path>
      <defs>
        <linearGradient id="paint0_coinflip_active" x1="11" y1="0" x2="11" y2="22.0001" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
        <linearGradient id="paint1_coinflip_active" x1="10.9437" y1="6.0238" x2="10.9437" y2="14.1429" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 w-[22px] h-[22px] group-hover:fill-[#A1A1A1] ${className}`}>
      <path d="M22 10.2667C22 4.6057 17.0652 0 11 0C4.93474 0 0 4.6057 0 10.2667C0 10.5143 0.0129355 10.7588 0.0313862 11.0019C0.0105289 11.2765 0 11.5112 0 11.7334C0 17.3944 4.93464 22.0001 11 22.0001C17.0653 22.0001 22 17.3944 22 11.7334C22 11.5108 21.9898 11.2762 21.9686 11.0011C21.9873 10.7584 22 10.5139 22 10.2667ZM11 1.35716C15.9822 1.35716 20.4745 5.61629 20.4745 10.2667C20.4745 14.9172 15.9822 19.1763 11 19.1763C6.01782 19.1763 1.52551 14.9172 1.52551 10.2667C1.52551 5.61629 6.01772 1.35716 11 1.35716ZM11 21.2668C6.98186 21.2668 3.49991 19.0895 1.83343 15.9333C2.15161 16.5357 2.77472 17.1059 3.28151 17.5723C3.83382 18.0805 4.4436 18.5348 5.09729 18.9242C6.4475 19.7291 7.98321 20.2516 9.57197 20.4444C12.9533 20.8555 16.4033 19.751 18.8041 17.4935C19.3117 17.0165 19.769 16.4932 20.1674 15.9334C18.4996 19.0895 15.0177 21.2668 11 21.2668Z"></path>
      <path d="M14.0389 7.9456C14.0143 7.97671 13.9836 8.0009 13.9497 8.01473C13.9159 8.03201 13.879 8.03892 13.8421 8.03892H6.87395C6.62784 8.03892 6.50171 7.69328 6.67398 7.4859L7.81841 6.12062C7.84303 6.08951 7.87379 6.06532 7.91071 6.04803C7.94455 6.03075 7.98147 6.02384 8.01838 6.02384H15.0142C15.2634 6.02384 15.3864 6.37293 15.2111 6.58032L14.0389 7.9456ZM14.0389 14.0496C13.9866 14.1084 13.9159 14.1429 13.8421 14.1429H6.87395C6.62784 14.1429 6.50171 13.8042 6.67398 13.6037L7.81841 12.2696C7.84303 12.2384 7.87687 12.2143 7.91071 12.2004C7.94455 12.1831 7.98147 12.1762 8.01838 12.1762H15.0142C15.2634 12.1762 15.3864 12.5184 15.2111 12.7189L14.0389 14.0496ZM14.0389 9.19336C13.9866 9.1346 13.9159 9.10004 13.8421 9.10004H6.87395C6.62784 9.10004 6.50171 9.43876 6.67398 9.63923L7.81841 10.9734C7.84303 11.0045 7.87687 11.0287 7.91071 11.0425C7.94455 11.0598 7.98147 11.0667 8.01838 11.0667H15.0142C15.2634 11.0667 15.3864 10.7245 15.2111 10.5241L14.0389 9.19336Z"></path>
    </svg>
  )
);

export const BlackjackIcon = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  active ? (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[22px] h-[20px] ${className}`}>
      <path d="M8.57907 8.55651C7.96021 8.25059 7.28055 7.88227 6.77278 7.44958C6.55616 8.09496 6.13246 8.76658 5.74354 9.33825C5.61324 9.53093 5.47991 9.72209 5.34143 9.92616C5.05497 10.3542 4.80014 10.8074 4.7991 11.1934C4.80096 11.3922 4.85272 11.5871 4.95143 11.7633C5.48838 12.7487 6.90364 12.8604 7.59774 11.9815C7.68051 11.8756 7.75075 11.7611 7.80513 11.641C7.7049 12.2824 7.44176 12.7693 6.95979 13.0836L7.04789 13.3854L8.58935 13.0063L8.59871 16.9748C8.60008 17.5568 9.11162 18.0296 9.74118 18.0309L13.2183 18.0376L5.35538 19.9709C4.87728 20.0884 4.38632 19.8398 4.23585 19.4125L4.22227 19.3707L0.0317465 5.01982C-0.100469 4.56697 0.192356 4.10148 0.685845 3.98009L8.56384 2.04308L8.57907 8.55651Z" fill="url(#paint_blackjack_active)"></path>
      <defs>
        <linearGradient id="paint_blackjack_active" x1="11" y1="0" x2="11" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 w-[22px] h-[20px] group-hover:fill-[#A1A1A1] ${className}`}>
      <path d="M8.57907 8.55651C7.96021 8.25059 7.28055 7.88227 6.77278 7.44958C6.55616 8.09496 6.13246 8.76658 5.74354 9.33825C5.61324 9.53093 5.47991 9.72209 5.34143 9.92616C5.05497 10.3542 4.80014 10.8074 4.7991 11.1934C4.80096 11.3922 4.85272 11.5871 4.95143 11.7633C5.48838 12.7487 6.90364 12.8604 7.59774 11.9815C7.68051 11.8756 7.75075 11.7611 7.80513 11.641C7.7049 12.2824 7.44176 12.7693 6.95979 13.0836L7.04789 13.3854L8.58935 13.0063L8.59871 16.9748C8.60008 17.5568 9.11162 18.0296 9.74118 18.0309L13.2183 18.0376L5.35538 19.9709C4.87728 20.0884 4.38632 19.8398 4.23585 19.4125L4.22227 19.3707L0.0317465 5.01982C-0.100469 4.56697 0.192356 4.10148 0.685845 3.98009L8.56384 2.04308L8.57907 8.55651Z"></path>
    </svg>
  )
);

export const JackpotIcon = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  active ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-[20px] h-[20px] ${className}`}>
      <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 4C6.69 4 4 6.69 4 10C4 13.31 6.69 16 10 16C13.31 16 16 13.31 16 10C16 6.69 13.31 4 10 4ZM10 14C7.79 14 6 12.21 6 10C6 7.79 7.79 6 10 6C12.21 6 14 7.79 14 10C14 12.21 12.21 14 10 14Z" fill="url(#paint_jackpot_active)"></path>
      <defs>
        <linearGradient id="paint_jackpot_active" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 w-[20px] h-[20px] group-hover:fill-[#A1A1A1] ${className}`}>
      <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 4C6.69 4 4 6.69 4 10C4 13.31 6.69 16 10 16C13.31 16 16 13.31 16 10C16 6.69 13.31 4 10 4ZM10 14C7.79 14 6 12.21 6 10C6 7.79 7.79 6 10 6C12.21 6 14 7.79 14 10C14 12.21 12.21 14 10 14Z"></path>
    </svg>
  )
);

export const RewardsIcon = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill={active ? "url(#paint_rewards)" : "#767676"} xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 w-[20px] h-[20px] ${active ? "" : "group-hover:fill-[#A1A1A1]"} ${className}`}>
    <path d="M10 15L4.12 18.09L5.18 11.54L0.49 6.91L7.06 5.95L10 0L12.94 5.95L19.51 6.91L14.82 11.54L15.88 18.09L10 15Z"></path>
    {active && (
      <defs>
        <linearGradient id="paint_rewards" x1="10" y1="0" x2="10" y2="18.09" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EE86FF"></stop>
          <stop offset="1" stopColor="#6F5FCC"></stop>
        </linearGradient>
      </defs>
    )}
  </svg>
);

export const SoundOnIcon = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 hover:fill-[#A1A1A1] ${className}`}>
    <path d="M3.75 6.75H0.75V11.25H3.75L8.25 15V3L3.75 6.75ZM12.75 9C12.75 7.515 11.8725 6.2325 10.5 5.655V12.3375C11.8725 11.7675 12.75 10.485 12.75 9ZM10.5 0.495V2.0625C13.3425 2.7375 15.375 5.6025 15.375 9C15.375 12.3975 13.3425 15.2625 10.5 15.9375V17.505C14.205 16.7925 17.025 13.2375 17.025 9C17.025 4.7625 14.205 1.2075 10.5 0.495Z"></path>
  </svg>
);

export const SoundOffIcon = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 hover:fill-[#A1A1A1] ${className}`}>
    <path d="M12.75 9C12.75 7.515 11.8725 6.2325 10.5 5.655V7.425L12.6975 9.6225C12.7275 9.42 12.75 9.21 12.75 9ZM15.375 9C15.375 9.9525 15.165 10.8525 14.8125 11.67L16.2 13.0575C16.8225 11.8575 17.175 10.47 17.175 9C17.175 4.7625 14.355 1.2075 10.65 0.495V2.0625C13.4925 2.7375 15.525 5.6025 15.525 9H15.375ZM1.7625 0.75L0.75 1.7625L5.0175 6.03L5.025 6.0375L8.25 9.2625V15L11.8275 12.195L15.0075 15.375L16.02 14.3625L1.7625 0.75ZM8.25 3L6.795 4.305L8.25 5.76V3ZM0.75 6.75V11.25H3.75L8.25 15V9.5025L2.505 3.7575L0.75 6.75Z"></path>
  </svg>
);

export const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z"></path>
  </svg>
);

export const WalletIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 4H2V2H18V4ZM18 6H2C0.9 6 0 6.9 0 8V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V8C20 6.9 19.1 6 18 6ZM18 16H2V8H18V16ZM13 12C13 10.9 13.9 10 15 10C16.1 10 17 10.9 17 12C17 13.1 16.1 14 15 14C13.9 14 13 13.1 13 12Z"></path>
  </svg>
);

export const SOLCoinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="url(#sol_gradient)"/>
    <path d="M7.5 15.5L9.5 13.5H16.5L14.5 15.5H7.5Z" fill="white"/>
    <path d="M7.5 8.5L9.5 10.5H16.5L14.5 8.5H7.5Z" fill="white"/>
    <path d="M7.5 12L9.5 10H16.5L14.5 12H7.5Z" fill="white"/>
    <defs>
      <linearGradient id="sol_gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const PumpCoinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <div className={`rounded-full bg-gradient-to-b from-[#72509F] to-[#B27CFD] ${className}`} style={{ width: size, height: size }}>
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white font-bold text-[10px]">P</span>
    </div>
  </div>
);

export const InfoIcon = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 hover:fill-[#A1A1A1] ${className}`}>
    <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM9 12H7V7H9V12ZM9 5H7V3H9V5Z"></path>
  </svg>
);

export const ChatEmojiIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="#767676" xmlns="http://www.w3.org/2000/svg" className={`transition-colors duration-200 hover:fill-[#A1A1A1] ${className}`}>
    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM6.5 9C7.33 9 8 8.33 8 7.5C8 6.67 7.33 6 6.5 6C5.67 6 5 6.67 5 7.5C5 8.33 5.67 9 6.5 9ZM13.5 9C14.33 9 15 8.33 15 7.5C15 6.67 14.33 6 13.5 6C12.67 6 12 6.67 12 7.5C12 8.33 12.67 9 13.5 9ZM10 15.5C12.33 15.5 14.31 14.04 15.11 12H4.89C5.69 14.04 7.67 15.5 10 15.5Z"></path>
  </svg>
);

export const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1.4 17.4L18.85 10.92C19.66 10.57 19.66 9.43 18.85 9.08L1.4 2.6C0.74 2.32 0 2.8 0 3.51V7.62C0 8.13 0.37 8.56 0.88 8.64L15 10L0.88 11.36C0.37 11.44 0 11.87 0 12.38V16.49C0 17.2 0.74 17.68 1.4 17.4Z"></path>
  </svg>
);
