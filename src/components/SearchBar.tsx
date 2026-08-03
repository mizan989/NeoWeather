import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCities } from '../lib/api';
import type { GeocodeResult, WeatherLocation } from '../types/weather';

interface Props {
  onSelect: (loc: WeatherLocation) => void;
  onUseLocation: () => void;
  locating: boolean;
}

export default function SearchBar({ onSelect, onUseLocation, locating }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(() => {
      setSearching(true);
      searchCities(query)
        .then((r) => {
          setResults(r);
          setOpen(true);
        })
        .finally(() => setSearching(false));
    }, 300);
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

  function handleSelect(r: GeocodeResult) {
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
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center gap-2 border-b"
        style={{ borderColor: 'var(--line)' }}
      >
        <Search size={16} strokeWidth={1.75} style={{ color: 'var(--ink-soft)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for a city"
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[var(--ink-soft)]"
          style={{ color: 'var(--ink)' }}
        />
        {searching && <Loader2 size={14} className="animate-spin" style={{ color: 'var(--ink-soft)' }} />}
        <button
          onClick={onUseLocation}
          aria-label="Use current location"
          className="flex items-center gap-1 py-3 pl-1 text-xs shrink-0"
          style={{ color: 'var(--sky)' }}
        >
          {locating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <MapPin size={14} strokeWidth={1.75} />
          )}
          <span className="hidden sm:inline">Current</span>
        </button>
      </div>

      {open && results.length > 0 && (
        <ul
          className="absolute z-20 mt-1 w-full border text-sm shadow-lg backdrop-blur-md"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
        >
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => handleSelect(r)}
                className="flex w-full items-baseline justify-between px-4 py-2.5 text-left hover:opacity-70"
              >
                <span>{r.name}{r.admin1 ? `, ${r.admin1}` : ''}</span>
                <span className="font-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{r.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
