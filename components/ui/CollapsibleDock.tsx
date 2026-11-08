'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  Film,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Swords,
  RotateCcw,
} from 'lucide-react';

export interface CollapsibleDockProps {
  currentChapter: number;
  totalChapters: number;
  chapterTitles: string[];
  isOrbitMode: boolean;
  isMuted: boolean;
  battleStage?: string;
  onSelectChapter: (chapter: number) => void;
  onToggleOrbit: () => void;
  onToggleAudio: () => void;
  onFireArrow: () => void;
  onLightDiya: () => void;
  onLaunchFirework: () => void;
}

export function CollapsibleDock({
  currentChapter,
  totalChapters,
  chapterTitles,
  isOrbitMode,
  isMuted,
  battleStage,
  onSelectChapter,
  onToggleOrbit,
  onToggleAudio,
  onFireArrow,
  onLightDiya,
  onLaunchFirework,
}: CollapsibleDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isBattleChapter = currentChapter >= 1 && currentChapter <= 4;
  const isCelebrationChapter = currentChapter >= 6;
  const isBattleActive =
    battleStage === 'HOLDING' ||
    battleStage === 'DRAWING' ||
    battleStage === 'RELEASED' ||
    battleStage === 'RAVANA_FIRE' ||
    battleStage === 'CRACKERS';

  // Human-readable battle phase label
  const getBattleStatusText = () => {
    switch (battleStage) {
      case 'HOLDING':
        return 'Lord Rama holding celestial bow...';
      case 'DRAWING':
        return 'Rama drawing bow • Arrow tip in fire!';
      case 'RELEASED':
        return 'Agni Astra released across battlefield!';
      case 'RAVANA_FIRE':
        return 'Ravana engulfed in sacred fire (5s)...';
      case 'CRACKERS':
        return 'Victory! Crackers blowing bottom to top!';
      default:
        return 'Rama vs Ravana Battle';
    }
  };

  return (
    <div
      className="fixed z-30 transition-transform duration-500 ease-out"
      style={{
        bottom: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 38px)' : '0'})`,
        maxWidth: 'min(940px, 94vw)',
        width: '100%',
      }}
    >
      {/* Collapse / Expand Tab attached to the top of the dock */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-amber-200 bg-[#16120e] border border-amber-500/30 shadow-lg hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
          title="Press 'H' or click to toggle controls"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Show Controls</span>
              <kbd className="px-1 text-[10px] bg-amber-950/80 rounded border border-amber-600/30">H</kbd>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Hide Controls</span>
              <kbd className="px-1 text-[10px] bg-amber-950/80 rounded border border-amber-600/30">H</kbd>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Horizontal Dock */}
      <div className="bg-[#120f0b]/95 border border-amber-500/30 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black/80 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Chapter Navigation & Story Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => onSelectChapter(Math.max(0, currentChapter - 1))}
            disabled={currentChapter === 0}
            className="p-1.5 rounded-lg bg-amber-950/50 border border-amber-500/20 hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Chapter"
          >
            <ChevronLeft className="w-4 h-4 text-amber-300" />
          </button>

          <div className="flex flex-col items-center sm:items-start px-2">
            <span className="text-[10px] tracking-widest uppercase text-amber-400 font-semibold">
              Chapter {currentChapter + 1} of {totalChapters}
            </span>
            <span className="text-xs sm:text-sm font-serif font-medium text-amber-100 truncate max-w-[170px] sm:max-w-[220px]">
              {chapterTitles[currentChapter]}
            </span>
          </div>

          <button
            onClick={() => onSelectChapter(Math.min(totalChapters - 1, currentChapter + 1))}
            disabled={currentChapter === totalChapters - 1}
            className="p-1.5 rounded-lg bg-amber-950/50 border border-amber-500/20 hover:border-amber-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Chapter"
          >
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Center: Contextual Interactive Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Battle Action: Rama Killing Ravana Continuous Choreography */}
          {isBattleChapter && (
            <button
              onClick={onFireArrow}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border cursor-pointer active:scale-95 transition-all ${
                isBattleActive
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white border-yellow-300 ring-2 ring-amber-500/50 shadow-orange-900/60'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border-amber-300/40 shadow-red-900/40'
              }`}
            >
              {isBattleActive ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-yellow-200" />
                  <span className="animate-pulse">{getBattleStatusText()}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-amber-200" />
                  <span>Replay Rama Killing Ravana</span>
                </>
              )}
            </button>
          )}

          {/* Celebration Action: Light Kingdom Diyas */}
          {isCelebrationChapter && (
            <button
              onClick={onLightDiya}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-semibold shadow-lg shadow-amber-900/40 border border-amber-300/40 cursor-pointer active:scale-95 transition-transform"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-200" />
              <span>Light Royal Diya</span>
            </button>
          )}

          {/* Celebration Action: Launch Fireworks */}
          {isCelebrationChapter && (
            <button
              onClick={onLaunchFirework}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 text-xs font-medium border border-amber-500/30 cursor-pointer active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Burst Firework</span>
            </button>
          )}
        </div>

        {/* Right: Camera Mode & Audio Toggles */}
        <div className="flex items-center gap-2">
          {/* Camera Mode Toggle */}
          <button
            onClick={onToggleOrbit}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isOrbitMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-amber-950/40 border-amber-500/20 text-stone-300 hover:text-white'
            }`}
            title={isOrbitMode ? 'Switch to Cinematic Story Path' : 'Switch to Free 3D Orbit Inspection'}
          >
            {isOrbitMode ? (
              <>
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>3D Orbit</span>
              </>
            ) : (
              <>
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Cinematic</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-amber-950/40 border-amber-500/20 text-stone-400 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Epic Audio' : 'Mute Audio'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
