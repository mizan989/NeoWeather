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
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-normal transition-colors duration-200',
              isActive
                ? 'text-white'
                : 'text-white/40 hover:text-white/75'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-pill-minimal"
                className="absolute inset-0 z-[-1] rounded-full border border-white/15 bg-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.2)] backdrop-blur-md"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            {Icon && <Icon size={12} className={isActive ? 'text-[var(--sky)]' : 'text-current'} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
