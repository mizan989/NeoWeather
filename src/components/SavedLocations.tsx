import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import type { WeatherLocation } from '../types/weather';

interface SavedLocationsProps {
  locations: WeatherLocation[];
  currentLocation: WeatherLocation;
  onSelect: (loc: WeatherLocation) => void;
  onRemove: (name: string) => void;
}

export default function SavedLocations({
  locations,
  currentLocation,
  onSelect,
  onRemove,
}: SavedLocationsProps) {
  if (locations.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 hide-scrollbar">
      <div className="flex items-center gap-1 text-[var(--gold)] pr-0.5 shrink-0 opacity-75">
        <Star size={11} fill="currentColor" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Pinned:</span>
      </div>

      <div className="flex items-center gap-1.5">
        <AnimatePresence mode="popLayout">
          {locations.map((loc) => {
            const isSelected =
              loc.name.toLowerCase() === currentLocation.name.toLowerCase() &&
              Math.abs(loc.latitude - currentLocation.latitude) < 0.1;

            return (
              <motion.div
                key={`${loc.name}-${loc.latitude}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className={`group flex shrink-0 items-center rounded-full border text-xs transition-all duration-200 ${
                  isSelected
                    ? 'border-white/30 bg-white/15 text-white shadow-[0_2px_10px_rgba(220,232,255,0.15)] font-medium'
                    : 'border-white/[0.07] bg-white/[0.025] text-white/60 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <button
                  onClick={() => onSelect(loc)}
                  className="px-2.5 py-0.5 font-mono text-[11px]"
                >
                  {loc.name}
                </button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(loc.name);
                  }}
                  title={`Remove ${loc.name}`}
                  className="pr-1.5 text-white/20 hover:text-rose-400 transition-colors"
                >
                  <X size={10} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
