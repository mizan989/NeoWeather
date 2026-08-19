import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

interface AnimatedTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function AnimatedTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
}: AnimatedTabsProps<T>) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-2xl',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-normal transition-colors duration-200',
              isActive
                ? 'text-white font-medium'
                : 'text-white/40 hover:text-white/80'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-pill-minimal"
                className="absolute inset-0 z-[-1] rounded-full border border-white/20 bg-white/12 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            {Icon && (
              <Icon
                size={13}
                className={cn(
                  'transition-transform duration-200',
                  isActive ? 'text-[var(--sky)] scale-110' : 'text-current'
                )}
              />
            )}
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
