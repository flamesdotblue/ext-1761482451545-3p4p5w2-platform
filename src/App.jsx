import { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import XPBar from './components/XPBar.jsx';
import Overworld from './components/Overworld.jsx';
import AboutDialog from './components/AboutDialog.jsx';

const NES_COLORS = {
  ink: '#161616',
  pine: '#306850',
  lime: '#89c059',
  mist: '#e3f9bf',
};

export default function App() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Dynamically inject Press Start 2P font for pixel style
  useEffect(() => {
    const id = 'press-start-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Level calculation: every 100 XP => +1 level
  useEffect(() => {
    setLevel(1 + Math.floor(xp / 100));
  }, [xp]);

  const theme = useMemo(() => NES_COLORS, []);

  return (
    <div className="min-h-screen w-full bg-[#161616] text-[#e3f9bf]" style={{ fontFamily: '"Press Start 2P", ui-monospace, Menlo, Monaco, monospace' }}>
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-[#161616]/70 border-b border-[#306850]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button aria-label="Open About" onClick={() => setAboutOpen(true)} className="px-3 py-2 text-xs md:text-sm bg-[#306850] text-[#e3f9bf] border-4 border-[#89c059] shadow-[4px_4px_0_0_#161616] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#161616]">
            ABOUT
          </button>
          <div className="ml-auto w-full max-w-md">
            <XPBar xp={xp} level={level} theme={theme} />
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="h-[80vh] md:h-[90vh] relative">
          <Hero />
        </section>
        <section id="overworld" className="relative max-w-6xl mx-auto px-3 md:px-6 py-8">
          <Overworld onGainXP={(amount) => setXp((x) => x + amount)} theme={theme} />
        </section>
      </main>

      <footer className="py-10 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Retro Portfolio
      </footer>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} theme={theme} />
    </div>
  );
}
