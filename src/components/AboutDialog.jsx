export default function AboutDialog({ open, onOpenChange, theme }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={() => onOpenChange(false)} />
      <div className="relative max-w-xl w-full bg-[#161616] text-[#e3f9bf] border-8" style={{ borderColor: theme.lime, imageRendering: 'pixelated' }}>
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Pixel Portrait */}
            <div aria-hidden className="shrink-0" style={{ width: 96, height: 96, position: 'relative', imageRendering: 'pixelated' }}>
              <div style={{ position:'absolute', inset:0, background:'#306850' }} />
              <div style={{ position:'absolute', left: 20, top: 24, width: 56, height: 56, background:'#e3f9bf', boxShadow:'0 0 0 4px #161616' }} />
              <div style={{ position:'absolute', left: 20, top: 16, width: 56, height: 12, background:'#89c059', boxShadow:'0 0 0 4px #161616' }} />
              <div style={{ position:'absolute', left: 32, top: 48, width: 8, height: 8, background:'#161616' }} />
              <div style={{ position:'absolute', left: 56, top: 48, width: 8, height: 8, background:'#161616' }} />
            </div>
            <div>
              <h3 className="text-sm md:text-base">About Me</h3>
              <p className="text-[10px] md:text-xs mt-2 opacity-90">
                I build playful, performant web experiences that blend modern engineering with nostalgic game aesthetics. I focus on accessibility, crisp pixel scaling, and gamified UX.
              </p>
              <div className="mt-4 flex gap-2">
                <a href="#overworld" className="px-3 py-2 bg-[#306850] text-[#e3f9bf] border-4 border-[#89c059] shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] text-[10px]">Back to Map</a>
                <button onClick={() => onOpenChange(false)} className="px-3 py-2 bg-[#161616] text-[#e3f9bf] border-4 border-[#89c059] shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] text-[10px]">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
