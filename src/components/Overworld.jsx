import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const TILE = 12; // base pixel tile, will be scaled via CSS for crispness

const palette = {
  ink: '#161616',
  pine: '#306850',
  lime: '#89c059',
  mist: '#e3f9bf',
};

const projects = [
  {
    id: 'forest-labs',
    title: 'Forest Labs',
    tech: ['React', 'Tailwind', 'Vite'],
    description: 'A reactive dashboard with pixel-perfect charts and retro UI. Explore the grove to find terminals.',
    link: '#',
    pos: { x: 6, y: 5 },
    icon: 'terminal'
  },
  {
    id: 'rocket-works',
    title: 'Rocket Works',
    tech: ['Node', 'WebSockets'],
    description: 'Realtime collaboration tool. Launch pad features shimmering interactions.',
    link: '#',
    pos: { x: 14, y: 8 },
    icon: 'rocket'
  },
  {
    id: 'pixel-commerce',
    title: 'Pixel Commerce',
    tech: ['Next.js', 'Stripe'],
    description: 'A retro shop front with crisp scaling and playful animations.',
    link: '#',
    pos: { x: 3, y: 12 },
    icon: 'shop'
  }
];

// Simple pixel objects drawn with CSS box-shadows
function PixelObject({ type, size = 1, selected }) {
  const s = TILE * size;
  const common = { width: s, height: s, imageRendering: 'pixelated' };
  const styles = {
    tree: {
      ...common,
      boxShadow:
        `0 ${-1 * size}px 0 0 #2a5a46, 0 ${-2 * size}px 0 0 #2a5a46, 0 ${-3 * size}px 0 0 #2a5a46,` +
        ` ${-1 * size}px ${-2 * size}px 0 0 #2a5a46, ${1 * size}px ${-2 * size}px 0 0 #2a5a46,` +
        ` 0 ${0}px 0 0 #4b3b2b`,
      background: '#2a5a46'
    },
    terminal: {
      ...common,
      background: '#2d2d2d',
      border: `${2 * size}px solid #0b0b0b`,
      boxShadow: `inset 0 0 0 ${2 * size}px #1a1a1a, 0 0 0 ${2 * size}px ${selected ? '#e3f9bf' : '#89c059'}`
    },
    rocket: {
      ...common,
      background: '#c0c0c0',
      boxShadow: `0 ${-1 * size}px 0 0 #ffffff, 0 ${1 * size}px 0 0 #8a8a8a, ${1 * size}px 0 0 0 #8a8a8a, ${-1 * size}px 0 0 0 #8a8a8a`
    },
    shop: {
      ...common,
      background: '#8b3f3f',
      boxShadow: `0 ${-1 * size}px 0 0 #ffd37b, 0 ${1 * size}px 0 0 #5e2a2a, ${1 * size}px 0 0 0 #5e2a2a, ${-1 * size}px 0 0 0 #5e2a2a`
    }
  };
  let style = styles[type] || styles.tree;
  return <div style={style} className="transition-transform duration-200 will-change-transform" />;
}

function Landmark({ icon, selected }) {
  return (
    <div className="flex items-center justify-center">
      <PixelObject type={icon} size={1} selected={selected} />
    </div>
  );
}

function Modal({ open, onClose, project }) {
  if (!open || !project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-w-lg w-full bg-[#161616] text-[#e3f9bf] border-8" style={{ borderColor: '#89c059', imageRendering: 'pixelated' }}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <PixelObject type={project.icon} size={1} selected />
            </div>
            <div>
              <h3 className="text-sm md:text-base">{project.title}</h3>
              <p className="text-[10px] md:text-xs opacity-90 mt-2">{project.description}</p>
              <p className="text-[10px] mt-2">Tech: {project.tech.join(', ')}</p>
              <a href={project.link} className="mt-4 inline-block px-3 py-2 bg-[#306850] text-[#e3f9bf] border-4 border-[#89c059] shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] text-[10px]">VIEW PROJECT</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Overworld({ onGainXP, theme }) {
  const cols = 20;
  const rows = 14;
  const [scale, setScale] = useState(3);
  const [avatar, setAvatar] = useState({ x: 2, y: 2, color: '#e3f9bf', hat: true });
  const [visited, setVisited] = useState({});
  const [openProject, setOpenProject] = useState(null);
  const [achievement, setAchievement] = useState(null);

  const gridRef = useRef(null);

  // Responsive pixel scaling to keep things crisp
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 400) setScale(2);
      else if (w < 768) setScale(3);
      else setScale(4);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bounds = useMemo(() => ({
    minX: 0, minY: 0, maxX: cols - 1, maxY: rows - 1
  }), [cols, rows]);

  const levelTiles = useMemo(() => {
    // Basic terrain: path and grass
    const tiles = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isPath = (y === 7) || (x === 10) || (x > 4 && x < 8 && y > 3 && y < 10);
        tiles.push({ x, y, type: isPath ? 'path' : 'grass' });
      }
    }
    return tiles;
  }, [rows, cols]);

  const projectLookup = useMemo(() => {
    const map = new Map();
    projects.forEach(p => map.set(`${p.pos.x}:${p.pos.y}`, p));
    return map;
  }, []);

  // Easter egg: hidden star at a corner
  const starPos = { x: cols - 2, y: 1 };

  const move = useCallback((dx, dy) => {
    setAvatar(prev => {
      const nx = Math.max(bounds.minX, Math.min(bounds.maxX, prev.x + dx));
      const ny = Math.max(bounds.minY, Math.min(bounds.maxY, prev.y + dy));
      return { ...prev, x: nx, y: ny };
    });
  }, [bounds]);

  const onKey = useCallback((e) => {
    const key = e.key.toLowerCase();
    if (['arrowup','w'].includes(key)) { e.preventDefault(); move(0,-1); }
    if (['arrowdown','s'].includes(key)) { e.preventDefault(); move(0,1); }
    if (['arrowleft','a'].includes(key)) { e.preventDefault(); move(-1,0); }
    if (['arrowright','d'].includes(key)) { e.preventDefault(); move(1,0); }
    if (['enter',' '].includes(key)) { e.preventDefault();
      const p = projectLookup.get(`${avatar.x}:${avatar.y}`);
      if (p) setOpenProject(p);
    }
  }, [move, projectLookup, avatar]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    el.tabIndex = 0;
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [onKey]);

  // Discover mechanics
  useEffect(() => {
    const key = `${avatar.x}:${avatar.y}`;
    const proj = projectLookup.get(key);
    if (proj && !visited[proj.id]) {
      setVisited(v => ({ ...v, [proj.id]: true }));
      onGainXP?.(40);
    }
    if (avatar.x === starPos.x && avatar.y === starPos.y && achievement !== 'stargazer') {
      setAchievement('stargazer');
      onGainXP?.(60);
    }
  }, [avatar, projectLookup, visited, onGainXP, starPos, achievement]);

  const tileSize = TILE * scale;

  return (
    <div className="w-full" style={{ imageRendering: 'pixelated' }}>
      <div className="flex flex-col md:flex-row gap-4 md:items-start">
        <div className="md:w-2/3 w-full">
          <div
            ref={gridRef}
            aria-label="Overworld Map"
            role="application"
            className="outline-none select-none"
            style={{
              width: cols * tileSize,
              height: rows * tileSize,
              background: palette.ink,
              position: 'relative',
              boxShadow: '0 0 0 8px ' + palette.pine,
            }}
          >
            {/* Terrain */}
            {levelTiles.map(t => (
              <div
                key={`${t.x}-${t.y}`}
                style={{
                  position: 'absolute',
                  left: t.x * tileSize,
                  top: t.y * tileSize,
                  width: tileSize,
                  height: tileSize,
                  background: t.type === 'grass' ? palette.pine : '#3b5b4a',
                }}
              />
            ))}

            {/* Decorative trees */}
            {[{x:1,y:1},{x:2,y:2},{x:5,y:3},{x:12,y:2},{x:16,y:10}].map((t,i)=>(
              <div key={i} style={{ position:'absolute', left:t.x*tileSize, top:t.y*tileSize }}>
                <PixelObject type="tree" size={1} />
              </div>
            ))}

            {/* Projects */}
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setOpenProject(p)}
                aria-label={`Open ${p.title}`}
                style={{
                  position: 'absolute',
                  left: p.pos.x * tileSize,
                  top: p.pos.y * tileSize,
                  width: tileSize,
                  height: tileSize,
                }}
                className="group"
              >
                <div className="transition-transform group-hover:-translate-y-0.5" style={{ transform: 'translateZ(0)' }}>
                  <Landmark icon={p.icon} selected={!!visited[p.id]} />
                </div>
              </button>
            ))}

            {/* Avatar */}
            <div
              aria-label="Player Avatar"
              style={{
                position: 'absolute',
                left: avatar.x * tileSize,
                top: avatar.y * tileSize,
                width: tileSize,
                height: tileSize,
              }}
            >
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {/* body */}
                <div style={{
                  width: tileSize * 0.7,
                  height: tileSize * 0.7,
                  background: avatar.color,
                  position: 'absolute',
                  left: tileSize * 0.15,
                  top: tileSize * 0.2,
                  boxShadow: `0 0 0 ${Math.max(1, Math.floor(scale/1))}px ${palette.ink}`,
                  imageRendering: 'pixelated'
                }} />
                {/* hat */}
                {avatar.hat && (
                  <div style={{
                    width: tileSize * 0.8,
                    height: tileSize * 0.25,
                    background: palette.lime,
                    position: 'absolute',
                    left: tileSize * 0.1,
                    top: tileSize * 0.05,
                    boxShadow: `0 0 0 ${Math.max(1, Math.floor(scale/1))}px ${palette.ink}`,
                    imageRendering: 'pixelated'
                  }} />
                )}
              </div>
            </div>

            {/* Easter egg star */}
            <div aria-hidden style={{ position:'absolute', left: starPos.x*tileSize, top: starPos.y*tileSize, width: tileSize, height: tileSize }}>
              <div className="animate-pulse" style={{
                width: tileSize * 0.3,
                height: tileSize * 0.3,
                background: palette.mist,
                position:'absolute', left: tileSize*0.35, top: tileSize*0.35,
                boxShadow: `0 0 0 ${Math.max(1, Math.floor(scale/1))}px ${palette.lime}`,
                transform: 'rotate(45deg)',
                imageRendering: 'pixelated'
              }} />
            </div>
          </div>
          <p className="mt-2 text-[10px] opacity-80">Use Arrow Keys or WASD to move. Press Enter/Space to interact.</p>
        </div>

        {/* Sidebar: Customization and Achievements */}
        <div className="md:w-1/3 w-full space-y-4">
          <div className="p-3 bg-[#161616] border-8" style={{ borderColor: palette.lime }}>
            <h4 className="text-xs mb-2">Avatar Customization</h4>
            <div className="flex items-center gap-2">
              {['#e3f9bf','#89c059','#306850','#f0e68c'].map(c => (
                <button key={c} onClick={() => setAvatar(a => ({ ...a, color: c }))} className="w-6 h-6 border-4" style={{ background: c, borderColor: palette.pine }} aria-label={`Set color ${c}`} />
              ))}
              <button onClick={() => setAvatar(a => ({ ...a, hat: !a.hat }))} className="ml-2 px-3 py-2 text-[10px] bg-[#306850] border-4" style={{ borderColor: palette.lime }}>
                {avatar.hat ? 'Hat: ON' : 'Hat: OFF'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#161616] border-8" style={{ borderColor: palette.lime }}>
            <h4 className="text-xs mb-2">Achievements</h4>
            <ul className="space-y-2 text-[10px]">
              <li className={visited['forest-labs'] ? 'opacity-100' : 'opacity-40'}>Entered Forest Labs</li>
              <li className={visited['rocket-works'] ? 'opacity-100' : 'opacity-40'}>Visited Rocket Works</li>
              <li className={visited['pixel-commerce'] ? 'opacity-100' : 'opacity-40'}>Shopped Pixel Commerce</li>
              <li className={achievement === 'stargazer' ? 'opacity-100' : 'opacity-40'}>Found the Hidden Star</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal open={!!openProject} onClose={() => setOpenProject(null)} project={openProject} />
    </div>
  );
}
