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
  spotlightFill = 'rgba(255, 255, 255, 0.05)',
  glowOnHover = true,
  ...props
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={glowOnHover ? { y: -2, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
      className="h-full"
    >
      <Spotlight
        fill={spotlightFill}
        size={280}
        className={cn(
          'group relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-2xl transition-colors duration-300',
          glowOnHover && 'hover:border-white/[0.14] hover:bg-white/[0.04]',
          className
        )}
        {...props}
      >
        {children}
      </Spotlight>
    </motion.div>
  );
}
