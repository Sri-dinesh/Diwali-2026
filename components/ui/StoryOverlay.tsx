'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface StoryOverlayProps {
  currentChapter: number;
  chapterData: {
    title: string;
    sanskrit?: string;
    subtitle: string;
    story: string;
    actionHint?: string;
  };
}

export function StoryOverlay({ currentChapter, chapterData }: StoryOverlayProps) {
  return (
    <>
      {/* 1. Minimal Top Header Badge (Unobstructed Top-Left / Top-Center) */}
      <div className="fixed top-4 left-4 sm:left-6 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120e0a]/85 border border-amber-500/30 text-amber-200 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-serif font-bold tracking-widest text-amber-100">
            DIWALI 2026
          </span>
          <span className="text-[10px] text-amber-400/80 uppercase font-mono tracking-wider border-l border-amber-500/30 pl-2">
            The Epic of Rama
          </span>
        </div>
      </div>

      {/* 2. Top-Center Minimal Poetic Narrative Card (Zero Central 3D Viewport Occlusion) */}
      <div className="fixed top-16 sm:top-18 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-lg w-[92vw] px-2">
        <div className="bg-[#120e0a]/85 border border-amber-500/25 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl shadow-black/60 transition-all duration-500">
          {chapterData.sanskrit && (
            <div className="text-amber-300 text-xs sm:text-sm font-serif font-semibold tracking-wider mb-1">
              {chapterData.sanskrit}
            </div>
          )}

          <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-wide mb-1">
            {chapterData.title}
          </h2>

          <p className="text-xs text-amber-200/90 font-light leading-relaxed mb-2">
            {chapterData.story}
          </p>

          {chapterData.actionHint && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{chapterData.actionHint}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
