import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export function Meteors({ number = 16, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = Array.from({ length: number }).map(() => ({
      top: `${Math.floor(Math.random() * 80) - 20}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${(Math.random() * 6 + 0.2).toFixed(2)}s`,
      animationDuration: `${Math.floor(Math.random() * 6 + 4)}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden will-change-transform">
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            'pointer-events-none absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-200 shadow-[0_0_0_1px_#ffffff10]',
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#dce8ff] before:to-transparent",
            className
          )}
          style={style}
        />
      ))}
    </div>
  );
}
