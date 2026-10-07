import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface SparklePointsDisplayProps {
  points: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  labelClassName?: string;
}

interface Particle {
  id: number;
  tx: string;
  ty: string;
  delay: string;
  size: number;
  color: string;
}

export const SparklePointsDisplay: React.FC<SparklePointsDisplayProps> = ({
  points,
  className = '',
  size = 'lg',
  showLabel = false,
  labelClassName = 'text-xs font-semibold text-amber-300'
}) => {
  const [isSparkling, setIsSparkling] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevPointsRef = useRef<number>(points);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPointsRef.current = points;
      return;
    }

    const diff = points - prevPointsRef.current;
    if (diff !== 0) {
      setDelta(diff);
      setIsSparkling(true);

      // Generate 6-8 scattered sparkle particles
      const newParticles: Particle[] = [
        { id: 1, tx: '-22px', ty: '-24px', delay: '0ms', size: 14, color: '#F9E79F' },
        { id: 2, tx: '24px', ty: '-26px', delay: '80ms', size: 12, color: '#D4AF37' },
        { id: 3, tx: '-32px', ty: '6px', delay: '120ms', size: 10, color: '#FFF' },
        { id: 4, tx: '30px', ty: '8px', delay: '50ms', size: 15, color: '#F9E79F' },
        { id: 5, tx: '-14px', ty: '-38px', delay: '150ms', size: 11, color: '#D4AF37' },
        { id: 6, tx: '16px', ty: '-36px', delay: '100ms', size: 13, color: '#FFE082' }
      ];
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setIsSparkling(false);
        setDelta(null);
      }, 1500);

      prevPointsRef.current = points;
      return () => clearTimeout(timer);
    }
  }, [points]);

  const sizeClasses = {
    sm: 'text-base font-bold font-royal',
    md: 'text-xl font-extrabold font-royal',
    lg: 'text-2xl sm:text-3xl font-extrabold font-royal',
    xl: 'text-3xl sm:text-4xl font-black font-royal'
  };

  return (
    <div className="relative inline-flex items-baseline space-x-1.5 select-none">
      {/* Floating Delta Badge */}
      {delta !== null && (
        <span
          className={`absolute -top-6 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-lg animate-delta-pill ${
            delta > 0
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-emerald-900/50'
              : 'bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-amber-900/50'
          }`}
        >
          {delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()} Pts
        </span>
      )}

      {/* Sparkle Twinkle Particles */}
      {isSparkling &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute left-1/2 top-1/2 pointer-events-none z-20 animate-sparkle-star"
            style={
              {
                '--tx': p.tx,
                '--ty': p.ty,
                animationDelay: p.delay
              } as React.CSSProperties
            }
          >
            <Sparkles
              style={{ width: p.size, height: p.size, color: p.color }}
              className="drop-shadow-[0_0_8px_rgba(249,231,159,0.9)]"
            />
          </span>
        ))}

      {/* Golden Aura Glow on Sparkle */}
      {isSparkling && (
        <div className="absolute -inset-2 bg-radial from-amber-400/30 via-yellow-300/10 to-transparent rounded-full blur-md pointer-events-none animate-pulse"></div>
      )}

      {/* Points Numerical Value */}
      <span
        className={`relative z-10 gold-gradient-text tracking-tight transition-transform duration-300 ${
          sizeClasses[size]
        } ${isSparkling ? 'animate-sparkle-active scale-105' : ''} ${className}`}
      >
        {points.toLocaleString()}
      </span>

      {showLabel && (
        <span className={`relative z-10 ${labelClassName}`}>
          Royal Points
        </span>
      )}
    </div>
  );
};
