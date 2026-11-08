'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DiwaliCanvas, DiwaliCanvasRef } from '../components/three/DiwaliCanvas';
import { CollapsibleDock } from '../components/ui/CollapsibleDock';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { StoryOverlay } from '../components/ui/StoryOverlay';
import { sound } from '../lib/audio/sound-synth';

// 10 Core Chapters Flow
const CHAPTERS = [
  {
    title: 'Scene 01: The Waiting Kingdom',
    sanskrit: '॥ अयोध्या प्रतीक्षते ॥',
    subtitle: 'The Calm Before Dawn',
    story: 'Deep in the midnight hours, the sacred kingdom of Ayodhya waits under a starry sky. Citizens hold their breath for the return of their beloved king.',
    actionHint: 'Scroll or click Next Chapter to journey to the battlefield',
  },
  {
    title: 'Scene 02: The Battlefield of Lanka',
    sanskrit: '॥ धर्मक्षेत्रे लंकायां ॥',
    subtitle: 'Confrontation of Destinies',
    story: 'Upon the fiery volcanic crags of Lanka, Lord Rama faces the ten-headed titan Ravana. Watch the smooth epic animation as Rama draws the flaming Agni Astra!',
    actionHint: 'Click "Play Rama Killing Ravana" to watch the battle choreography',
  },
  {
    title: 'Scene 03: The Divine Bow (Kodanda)',
    sanskrit: '॥ कोदण्ड धनुः ॥',
    subtitle: 'Celestial Craftsmanship',
    story: 'Lord Rama raises Kodanda, holding the bow poised. After 1 sec, Rama pulls the taut bowstring as the needle point arrow tip ignites with raging fire!',
    actionHint: 'Watch the flaming arrow tip ignite with sacred mantras',
  },
  {
    title: 'Scene 04: The Agni Astra (Fire Arrow)',
    sanskrit: '॥ अग्नि अस्त्रम् ॥',
    subtitle: 'Release of Divine Fire',
    story: 'The Agni Astra releases, flying towards Ravana. It strikes Ravana who catches fire and burns in purifying flames for 5 full seconds before crackers burst!',
    actionHint: 'Ravana burns in sacred fire for 5 seconds before crackers blow',
  },
  {
    title: 'Scene 05: The Triumph of Light',
    sanskrit: '॥ सत्यमेव जयते ॥',
    subtitle: 'Ascending Cracker Celebration',
    story: 'Ravana dissolves in purifying flames! From bottom to top, ground fountains erupt, rockets whistle upward, and fireworks explode across the sky!',
    actionHint: 'Bottom-to-top crackers celebrate the cosmic victory of light',
  },
  {
    title: 'Scene 06: The Return via Pushpak Vimana',
    sanskrit: '॥ पुष्पक विमानम् ॥',
    subtitle: 'The Celestial Flight Home',
    story: 'Soaring across moonlit clouds, the golden Pushpak Vimana carries Lord Rama, Sita Devi, Lakshmana, and Hanuman triumphantly back to Ayodhya.',
    actionHint: 'Watch the stardust trail as the celestial chariot glides',
  },
  {
    title: 'Scene 07: Lighting the Kingdom',
    sanskrit: '॥ दीपोत्सवः ॥',
    subtitle: 'The Birth of Diwali',
    story: 'Ayodhya awakens! Millions of terracotta diyas ignite in a radiant golden cascade across the palace, terraces, and steps, welcoming the divine king.',
    actionHint: 'Click "Light Royal Diya" to awaken the entire kingdom in lights',
  },
  {
    title: 'Scene 08: The Grand Celebration',
    sanskrit: '॥ आनन्दोत्सवः ॥',
    subtitle: 'Cosmic Rejoicing',
    story: 'The night sky bursts with brilliant fireworks, golden sparklers, and showering flower petals as drums beat and conch shells herald eternal joy.',
    actionHint: 'Click anywhere on screen to launch your own firework!',
  },
  {
    title: 'Scene 09: Sarayu River of Lights',
    sanskrit: '॥ पुण्य सरयू तरङ्गिणी ॥',
    subtitle: 'Waters of Serenity',
    story: 'Along the sacred banks of River Sarayu, thousands of glowing lamps drift gently on green leaves amidst blooming pink lotus blossoms under the full moon.',
    actionHint: 'Watch the floating diyas ripple across the sacred current',
  },
  {
    title: 'Scene 10: Final Blessing & Shubh Deepavali 2026',
    sanskrit: '॥ शुभ दीपावली २०२६ • जय श्री राम ॥',
    subtitle: 'May Eternal Light Guide You',
    story: '“May your life be illuminated with the divine light of wisdom, the warmth of pure love, the spark of joy, and the triumph of goodness. Shubh Deepavali 2026!”',
    actionHint: 'Click "Light Royal Diya" for personal prayer & blessing',
  },
];

export default function DiwaliPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(1); // Auto-start directly at Scene 02: The Battlefield of Lanka
  const [isOrbitMode, setIsOrbitMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [battleStage, setBattleStage] = useState<string>('IDLE');

  const canvasRef = useRef<DiwaliCanvasRef>(null);

  // Sound Toggle handler
  const handleToggleAudio = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  }, [isMuted]);

  // Actions passed to 3D Canvas
  const handleFireArrow = useCallback(() => {
    canvasRef.current?.playBattleSequence();
  }, []);

  const handleLightDiya = useCallback(() => {
    canvasRef.current?.lightPersonalDiya();
  }, []);

  const handleLaunchFirework = useCallback(() => {
    canvasRef.current?.launchFirework();
  }, []);

  // Automatic narrative progression matching the battle choreography
  const handleBattleStageChange = useCallback((stage: string) => {
    setBattleStage(stage);
    if (stage === 'HOLDING') {
      setCurrentChapter(1); // Scene 02: The Battlefield of Lanka (Rama holding bow & arrow)
    } else if (stage === 'DRAWING') {
      setCurrentChapter(2); // Scene 03: The Divine Bow (Kodanda drawn, needle tip in fire)
    } else if (stage === 'RELEASED' || stage === 'RAVANA_FIRE') {
      setCurrentChapter(3); // Scene 04: The Agni Astra (Ravana engulfed in fire for 5s)
    } else if (stage === 'CRACKERS') {
      setCurrentChapter(4); // Scene 05: The Triumph of Light (Crackers bottom-to-top)
    } else if (stage === 'COMPLETED') {
      // Automatically advance to Pushpak Vimana return and royal celebration
      setTimeout(() => {
        setCurrentChapter(5);
      }, 3000);
    }
  }, []);

  return (
    <main className="relative w-full h-full min-h-screen overflow-hidden bg-[#070914] text-white select-none">
      {/* 1. Cinematic Loading Screen */}
      {isLoading && (
        <LoadingScreen
          onLoaded={() => {
            setIsLoading(false);
            canvasRef.current?.playBattleSequence();
          }}
        />
      )}

      {/* 2. Three.js 3D Master Canvas */}
      <DiwaliCanvas
        ref={canvasRef}
        currentChapter={currentChapter}
        isOrbitMode={isOrbitMode}
        onBattleStageChange={handleBattleStageChange}
        onDiyaLit={() => {}}
        onArrowFired={() => {}}
        onRavanaDefeated={() => {}}
      />

      {/* 3. Minimal Story & Poetic Narrative Overlay */}
      {!isLoading && (
        <StoryOverlay
          currentChapter={currentChapter}
          chapterData={CHAPTERS[currentChapter]}
        />
      )}

      {/* 4. Unified Collapsible Bottom Dock */}
      {!isLoading && (
        <CollapsibleDock
          currentChapter={currentChapter}
          totalChapters={CHAPTERS.length}
          chapterTitles={CHAPTERS.map((c) => c.title)}
          isOrbitMode={isOrbitMode}
          isMuted={isMuted}
          battleStage={battleStage}
          onSelectChapter={(idx) => setCurrentChapter(idx)}
          onToggleOrbit={() => setIsOrbitMode((prev) => !prev)}
          onToggleAudio={handleToggleAudio}
          onFireArrow={handleFireArrow}
          onLightDiya={handleLightDiya}
          onLaunchFirework={handleLaunchFirework}
        />
      )}
    </main>
  );
}
