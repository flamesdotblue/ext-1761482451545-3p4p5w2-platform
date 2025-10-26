import Spline from '@splinetool/react-spline';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);

  // Ensure pixel crisp overlay title anim
  useEffect(() => {
    if (!ref.current) return;
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Jd4wcqFfe70N-TXP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#161616]" />
      </div>

      <div ref={ref} className="relative z-10 h-full w-full flex items-center justify-center text-center p-6">
        <div className="inline-block max-w-3xl">
          <h1 className="text-[#e3f9bf] drop-shadow-[4px_4px_0_#161616] text-2xl sm:text-3xl md:text-5xl leading-tight" style={{
            textShadow: '4px 4px 0 #161616',
          }}>
            A Retro 8-bit Portfolio Adventure
          </h1>
          <p className="mt-4 text-[#e3f9bf]/80 text-[10px] sm:text-xs md:text-sm">
            Explore levels, discover projects, earn XP, and level up.
          </p>
          <a href="#overworld" className="mt-6 inline-block px-4 py-3 bg-[#306850] text-[#e3f9bf] border-4 border-[#89c059] shadow-[4px_4px_0_0_#161616] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#161616] text-xs">
            PRESS START
          </a>
        </div>
      </div>
    </div>
  );
}
