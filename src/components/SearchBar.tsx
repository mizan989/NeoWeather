import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Command } from 'lucide-react';
import { searchCities } from '../lib/api';
import type { GeocodeResult, WeatherLocation } from '../types/weather';

interface SearchBarProps {
  onSelect: (loc: WeatherLocation) => void;
  onUseLocation: () => void;
  locating: boolean;
}

export default function SearchBar({ onSelect, onUseLocation, locating }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const handle = setTimeout(() => {
      setSearching(true);
      searchCities(query)
        .then((r) => {
          setResults(r);
          setOpen(true);
          setSelectedIndex(-1);
        })
        .finally(() => setSearching(false));
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback(
    (r: GeocodeResult) => {
      onSelect({
        name: r.name,
        admin1: r.admin1,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
      });
      setQuery('');
      setResults([]);
      setOpen(false);
      setSelectedIndex(-1);
    },
    [onSelect]
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.div
        whileFocus={{ scale: 1.002 }}
        className="group flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-2xl transition-all duration-300 focus-within:border-white/30 focus-within:bg-white/[0.06] focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
      >
        <Search size={15} className="text-white/40 transition-colors group-focus-within:text-[var(--sky)]" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search city, state, or country..."
          className="w-full bg-transparent py-1.5 text-sm text-white/90 outline-none placeholder:text-white/35 font-normal"
        />

        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="text-white/30 hover:text-white/80 transition-colors"
          >
            <X size={13} />
          </motion.button>
        )}

        {searching && (
          <Loader2 size={13} className="animate-spin text-[var(--sky)] shrink-0" />
        )}

        {!query && (
          <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-white/30">
            <Command size={9} />
            <span>K</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={onUseLocation}
          disabled={locating}
          title="Use current location"
          className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 shrink-0"
        >
          {locating ? (
            <Loader2 size={12} className="animate-spin text-[var(--sky)]" />
          ) : (
            <MapPin size={12} className="text-[var(--sky)]" />
          )}
          <span className="hidden md:inline">GPS</span>
        </motion.button>
      </motion.div>

      {/* Animated Suggestion Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-white/[0.14] bg-[#0A0E16]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
          >
            {results.map((r, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <motion.li
                  key={`${r.id}-${idx}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                >
                  <button
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all duration-150 ${
                      isHighlighted
                        ? 'bg-white/12 text-white translate-x-1'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[var(--sky)]" />
                      <div>
                        <span className="font-medium text-white">{r.name}</span>
                        {r.admin1 && (
                          <span className="ml-1.5 text-white/40 text-[11px]">
                            {r.admin1}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-white/40">
                      {r.country}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
