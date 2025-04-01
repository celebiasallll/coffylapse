import { motion } from 'framer-motion'; // Updated import to use framer-motion directly

export default function ProgressTracker({
  shopLevel,
  experience,
  experienceRequired = 20,
  levelCap = 5,
  isMobile = false,
}) {
  // Calculate percentage progress to next level
  const expProgress = Math.min((experience % experienceRequired) / experienceRequired * 100, 100);
  const isMaxLevel = shopLevel >= levelCap;

  // Animation variants for the progress bar
  const progressVariants = {
    initial: { width: 0 },
    animate: { width: isMaxLevel ? '100%' : `${expProgress}%` },
  };

  return (
    <div className="bg-coffee-bg/40 p-2 rounded-lg border border-coffee-light/30 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        {isMaxLevel && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">(Max)</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-coffee-medium to-amber-500"
          variants={progressVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Subtle glow effect */}
        {!isMaxLevel && expProgress > 0 && (
          <motion.div
            className="absolute inset-0 bg-amber-400/20 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: `${expProgress}%` }}
          />
        )}
      </div>

      {/* Popularity Metric */}
      <div className="text-center mt-1 text-[0.65rem] text-coffee-dark font-medium">
        Popularity
      </div>

      {/* Level-up Indicator */}
      {!isMaxLevel && expProgress >= 80 && (
        <motion.div
          className="text-center mt-1 text-[0.65rem] text-coffee-dark font-medium"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="animate-pulse">Close to Next Tier</span>
        </motion.div>
      )}
    </div>
  );
}