import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Spotlight } from './Spotlight';

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightFill?: string;
  glowOnHover?: boolean;
}

export function BentoCard({
  children,
  className,
  spotlightFill = 'rgba(220, 232, 255, 0.08)',
  glowOnHover = true,
  ...props
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={
        glowOnHover
          ? {
              y: -4,
              scale: 1.008,
              transition: { type: 'spring', stiffness: 350, damping: 25 },
            }
          : undefined
      }
      whileTap={glowOnHover ? { scale: 0.99 } : undefined}
      className="h-full"
    >
      <Spotlight
        fill={spotlightFill}
        size={320}
        className={cn(
          'group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5.5 backdrop-blur-2xl transition-all duration-300',
          glowOnHover && 'hover:border-white/20 hover:bg-white/[0.045] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]',
          className
        )}
        {...props}
      >
        {children}
      </Spotlight>
    </motion.div>
  );
}
