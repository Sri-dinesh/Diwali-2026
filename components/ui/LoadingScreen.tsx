'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Flame } from 'lucide-react';

export interface LoadingScreenProps {
  onLoaded: () => void;
}

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isIgnited, setIsIgnited] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Flame ignites at 20%
    const flameTimer = setTimeout(() => {
      setIsIgnited(true);
    }, 600);

    // Progress increments
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => {
      clearTimeout(flameTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onLoaded();
        }, 800);
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070914] text-white transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Starfield Radiance */}
      <div className="absolute inset-0 bg-radial from-amber-900/20 via-transparent to-black pointer-events-none" />

      {/* Centerpiece: The First Diya Flame Ignition */}
      <div className="relative flex flex-col items-center mb-8">
        {/* Glow Halo */}
        <div
          className={`absolute -top-12 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl transition-all duration-1000 ${
            isIgnited ? 'scale-150 opacity-100' : 'scale-50 opacity-0'
          }`}
        />

        {/* Flickering Flame */}
        <div
          className={`relative z-10 transition-all duration-700 ${
            isIgnited ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <div className="w-8 h-12 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 rounded-full blur-[1px] animate-pulse shadow-lg shadow-orange-500/50" />
        </div>

        {/* Terracotta Diya Cup Silhouette */}
        <div className="w-20 h-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-b-full border-t border-amber-400/50 shadow-xl shadow-black/80 flex items-center justify-center -mt-2">
          <div className="w-16 h-1 bg-amber-400/40 rounded-full" />
        </div>
      </div>

      {/* Poetic Typography */}
      <div className="text-center px-4 max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold">Ayodhya Awaits</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-wider mb-2">
          DIWALI 2026
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 font-light italic mb-6">
          &ldquo;The night darkness must fall, so that the eternal light can triumph.&rdquo;
        </p>

        {/* Progress Bar with Golden Accent */}
        <div className="w-48 sm:w-64 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-amber-500/30 mx-auto mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-amber-400/80 tracking-widest uppercase">
          Preparing the kingdom&apos;s welcome... {progress}%
        </span>
      </div>
    </div>
  );
}
