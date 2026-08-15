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
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className={`group flex shrink-0 items-center rounded-full border text-xs transition-colors duration-200 ${
                  isSelected
                    ? 'border-white/25 bg-white/15 text-white'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/15 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <button
                  onClick={() => onSelect(loc)}
                  className="px-2.5 py-0.5 font-mono text-[11px]"
                >
                  {loc.name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(loc.name);
                  }}
                  title={`Remove ${loc.name}`}
                  className="pr-1.5 text-white/20 hover:text-rose-400 transition-colors"
                >
                  <X size={10} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
