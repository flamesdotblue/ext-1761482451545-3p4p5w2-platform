export default function XPBar({ xp = 0, level = 1, theme }) {
  const pct = Math.min(100, (xp % 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-[10px]">
        <span>LV {level.toString().padStart(2, '0')}</span>
        <span>XP {xp}</span>
      </div>
      <div className="relative h-5 border-4" style={{ borderColor: theme.lime, background: theme.ink }} aria-label="XP Progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="absolute inset-0" style={{
          background: `repeating-linear-gradient(45deg, ${theme.pine}, ${theme.pine} 8px, ${theme.lime} 8px, ${theme.lime} 16px)`,
          clipPath: `inset(0 0 0 0)`,
          width: pct + '%',
          height: '100%',
          imageRendering: 'pixelated',
          transition: 'width 400ms steps(8)'
        }} />
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, rgba(227,249,191,0.15), transparent)' }} />
      </div>
    </div>
  );
}
