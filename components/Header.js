import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Header({
  daysPassed = 1,
  shopLevel = 1,
  experience = 0,
  isMobile = false,
  isSmallMobile = false,
  isWalletConnected = false,
  walletAddress = null,
  tokenBalance = "0",
  onClaimReward = () => {},
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const parsedBalance = useMemo(() => {
    const balance = parseFloat(tokenBalance) || 0;
    return isFinite(balance) && balance > 0 ? Number(balance.toFixed(2)) : 0;
  }, [tokenBalance]);

  const hasTokens = parsedBalance > 0;

  const formattedAddress = useMemo(() => {
    if (!walletAddress) return '';
    return isSmallMobile
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}`
      : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress, isSmallMobile]);

  useEffect(() => {
    setIsAnimating(hasTokens);
  }, [hasTokens]);

  const claimButtonVariants = {
    idle: { scale: 1, backgroundColor: 'rgb(107 114 128)' },
    active: {
      scale: [1, 1.05, 1],
      backgroundColor: ['rgb(217 119 6)', 'rgb(245 158 11)', 'rgb(217 119 6)'],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.header
      className="flex flex-col items-center px-3 py-2 border-b border-coffee-medium/20 bg-coffee-dark/80 backdrop-blur-md shadow-sm relative z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <h1
            className={`font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent ${
              isSmallMobile ? 'text-sm' : isMobile ? 'text-base' : 'text-xl'
            }`}
          >
            CoffyLapse
          </h1>
          <div className="flex items-center space-x-2 text-coffee-light/70">
            <span className={isSmallMobile ? 'text-2xs' : 'text-xs'}>Lv {shopLevel}</span>
            <span className={isSmallMobile ? 'text-2xs' : 'text-xs'}>Day {daysPassed}</span>
          </div>
        </div>

        {!isSmallMobile && (
          <motion.span
            className="hidden sm:block text-xs font-semibold text-coffee-light/80 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            POWERED BY COFFY COIN TEAM
          </motion.span>
        )}

        <div className="flex items-center space-x-1" id="coffy-token-display" data-testid="token-display">
          <div className="flex items-center bg-coffee-darker/90 px-2 py-1 rounded-l-lg border border-coffee-medium/40">
            <span className="text-amber-500 mr-1">☕</span>
            <span
              className={`font-medium text-coffee-light ${
                isSmallMobile ? 'text-2xs' : 'text-xs sm:text-sm'
              }`}
              id="token-balance-display"
              data-testid="token-balance"
            >
              {parsedBalance}
            </span>
          </div>
          <motion.button
            id="token-claim-button"
            data-testid="claim-button"
            onClick={() => hasTokens && onClaimReward()}
            variants={claimButtonVariants}
            initial="idle"
            animate={hasTokens ? 'active' : 'idle'}
            className={`flex items-center font-medium text-white rounded-r-lg px-2 py-1 shadow-md ${
              hasTokens
                ? 'bg-gradient-to-br from-amber-500 to-amber-700 cursor-pointer'
                : 'bg-gray-600 cursor-not-allowed'
            } ${isSmallMobile ? 'text-2xs' : 'text-xs'}`}
            whileHover={hasTokens ? { scale: 1.03 } : {}}
            whileTap={hasTokens ? { scale: 0.97 } : {}}
            disabled={!hasTokens}
          >
            {/* Modernized Coffee Bean Icon with "C" */}
            <motion.svg
              className={`${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-1`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={hasTokens ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
              transition={{ duration: 0.8, repeat: hasTokens ? Infinity : 0, ease: 'easeInOut' }}
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M12 6c-2.76 0-5 2.24-5 5s2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.9-.9 1.47-2.16 1.47-3.53 0-2.76-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                fill="currentColor"
              />
              <path
                d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
                opacity="0.8"
              />
              <text
                x="9.5"
                y="15"
                fontSize="8"
                fontWeight="bold"
                fill="currentColor"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                C
              </text>
            </motion.svg>
            {isSmallMobile ? 'Claim' : `Claim ${parsedBalance}`}
          </motion.button>
        </div>
      </div>

      {isWalletConnected && (
        <motion.div
          className="w-full flex justify-end mt-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span
            className={`font-medium bg-green-900/60 text-green-300 px-2 py-0.5 rounded-lg border border-green-500/40 ${
              isSmallMobile ? 'text-2xs' : 'text-xs'
            }`}
          >
            {formattedAddress}
          </span>
        </motion.div>
      )}
    </motion.header>
  );
}