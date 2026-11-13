/**
 * The four life stages of the fish. Every form shares the same 168×96 canvas, faces right,
 * and tags its moving parts with data attributes the animation loop drives:
 *   data-tail="cx cy"  data-fin="cx cy"  data-lure="cx cy"  data-eye="cx cy"
 */

export const STAGES = [
  { name: "Fry", line: "Fresh out of the stream" },
  { name: "Juvenile", line: "Riding the first real currents" },
  { name: "Adult", line: "Shipping in open water" },
  { name: "Luminous", line: "Lighting up the deep" },
] as const;

/** Stage 0: a tiny see-through fry with a yolk sac and a big curious eye. */
function Fry() {
  return (
    <g>
      <g data-tail="44 48">
        <path d="M44,48 C36,42 30,38 22,36 C27,44 27,52 22,60 C30,58 36,54 44,48 Z" fill="#ffc8b0" fillOpacity="0.8" stroke="#fff" strokeWidth="0.8" />
      </g>
      <path d="M42,48 C54,35 96,33 116,44 C122,48 120,54 114,56 C94,63 54,61 42,48 Z" fill="url(#fry-body)" stroke="#fff" strokeWidth="1.2" />
      <path d="M48,48 C66,46 88,45 108,46" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="2 3" fill="none" />
      <circle cx="82" cy="55" r="5.5" fill="#ffcf7a" opacity="0.9" />
      <g data-fin="92 54">
        <path d="M92,54 C88,60 82,62 78,62 C82,58 86,55 92,54 Z" fill="#ffb59a" />
      </g>
      <g data-eye="106 45">
        <circle cx="106" cy="45" r="7.5" fill="#fff" />
        <circle cx="107.5" cy="45.5" r="4.6" fill="#0b1a2b" />
        <circle cx="109.2" cy="43.4" r="1.6" fill="#fff" />
      </g>
    </g>
  );
}

/** Stage 1: the familiar little coral fish. */
function Juvenile() {
  return (
    <g transform="translate(22 12)">
      <g data-tail="26 36">
        <path d="M28,36 C18,26 10,16 2,12 C7,26 7,46 2,60 C10,56 18,46 28,36 Z" fill="url(#juv-fin)" />
      </g>
      <path d="M48,16 C56,2 74,2 82,16 Z" fill="url(#juv-fin)" />
      <path d="M22,36 C32,12 74,6 100,26 C110,33 110,41 100,48 C74,66 32,60 22,36 Z" fill="url(#juv-body)" />
      <path d="M52,13 C46,24 46,48 52,59" stroke="#fff6ea" strokeWidth="5" fill="none" opacity="0.9" strokeLinecap="round" />
      <path d="M36,40 C50,52 78,54 98,46" stroke="#ffe7c2" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
      <g data-fin="66 44">
        <path d="M66,44 C62,54 54,58 48,58 C54,50 58,46 66,44 Z" fill="url(#juv-fin)" />
      </g>
      <g data-eye="88 31">
        <circle cx="88" cy="31" r="6.5" fill="#fff" />
        <circle cx="89.5" cy="31.5" r="3.6" fill="#0b1a2b" />
        <circle cx="91" cy="29.8" r="1.3" fill="#fff" />
      </g>
      <ellipse cx="86" cy="42" rx="4" ry="2.2" fill="#ff8a7a" opacity="0.55" />
    </g>
  );
}

/** Stage 2: a grown fish with a flowing veil tail, tall dorsal fin and shimmering scales. */
function Adult() {
  return (
    <g>
      <g data-tail="34 48">
        <path d="M34,48 C20,30 10,18 0,12 C8,30 12,40 6,48 C12,56 8,66 0,84 C10,78 20,66 34,48 Z" fill="url(#ad-fin)" />
        <path d="M30,48 C20,38 12,28 4,20 M30,48 C18,48 12,48 8,48 M30,48 C20,58 12,68 4,76" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
      </g>
      <path d="M62,24 C70,0 106,0 118,26 Z" fill="url(#ad-fin)" />
      <path d="M72,22 L76,12 M84,20 L88,9 M96,20 L99,10 M107,22 L109,15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <path d="M70,70 C66,84 56,92 46,92 C56,82 62,76 70,70 Z" fill="url(#ad-fin)" />
      <path d="M30,48 C44,18 100,12 132,36 C142,43 142,53 132,60 C100,82 44,78 30,48 Z" fill="url(#ad-body)" />
      <g opacity="0.35" stroke="#fff" strokeWidth="0.9" fill="none">
        {[[58, 40], [70, 34], [70, 50], [82, 42], [82, 58], [94, 36], [94, 52], [106, 44], [58, 56]].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x},${y} a5,5 0 0 1 8,0`} />
        ))}
      </g>
      <path d="M76,18 C66,36 66,62 76,80" stroke="#fff6ea" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.92" />
      <path d="M108,22 C100,38 100,58 108,72" stroke="#fff6ea" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M40,52 C70,64 104,66 134,56" stroke="#ffe7c2" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
      <path className="fish-shimmer" d="M54,30 C80,20 110,22 128,34" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g data-fin="100 60">
        <path d="M100,60 C94,74 84,78 74,78 C82,70 88,62 100,60 Z" fill="url(#ad-fin)" />
      </g>
      <g data-eye="120 42">
        <circle cx="120" cy="42" r="7.5" fill="#fff" />
        <circle cx="121.8" cy="42.6" r="4.4" fill="#0b1a2b" />
        <circle cx="123.4" cy="40.6" r="1.6" fill="#fff" />
      </g>
      <ellipse cx="118" cy="54" rx="5" ry="2.6" fill="#ff7a7a" opacity="0.5" />
      <path d="M137,47 C139,48.5 139,51 137,52" stroke="#7a3a1e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Stage 3: a bioluminescent deep-sea form with glowing lines, spots and a lure of light. */
function Luminous() {
  return (
    <g>
      <g data-tail="34 48" filter="url(#glow)">
        <path d="M34,48 C20,30 10,18 0,12 C8,30 12,40 6,48 C12,56 8,66 0,84 C10,78 20,66 34,48 Z" fill="rgba(95,212,244,0.14)" stroke="#7ff6ff" strokeWidth="1.2" />
        <path d="M30,48 C18,36 8,26 -6,16 M30,48 C18,60 8,70 -6,80" stroke="#7ff6ff" strokeWidth="0.8" fill="none" opacity="0.7" />
      </g>
      <path d="M62,24 C70,0 106,0 118,26 Z" fill="rgba(95,212,244,0.12)" stroke="#7ff6ff" strokeWidth="1" filter="url(#glow)" />
      <path d="M70,70 C66,84 56,92 46,92 C56,82 62,76 70,70 Z" fill="rgba(95,212,244,0.12)" stroke="#7ff6ff" strokeWidth="1" />
      <path d="M30,48 C44,18 100,12 132,36 C142,43 142,53 132,60 C100,82 44,78 30,48 Z" fill="url(#lum-body)" stroke="#7ff6ff" strokeWidth="1.3" filter="url(#glow)" />
      <path d="M40,50 C70,44 102,44 132,47" stroke="#9ffaff" strokeWidth="1.6" fill="none" filter="url(#glow)" />
      <g filter="url(#glow)">
        {[48, 60, 72, 84, 96, 108, 120].map((x, i) => (
          <circle key={x} className="fish-spot" cx={x} cy={61 - Math.abs(84 - x) * 0.05} r="2" fill="#d6fdff" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
        {[66, 82, 98].map((x, i) => (
          <circle key={x} className="fish-spot" cx={x} cy="34" r="1.4" fill="#ffe9a8" style={{ animationDelay: `${0.5 + i * 0.25}s` }} />
        ))}
      </g>
      <g data-lure="128 30">
        <path d="M128,30 C130,8 150,2 158,14" stroke="#9ffaff" strokeWidth="1.6" fill="none" filter="url(#glow)" />
        <circle cx="158" cy="16" r="14" fill="rgba(255,236,160,0.28)" className="fish-lure" />
        <circle cx="158" cy="16" r="5" fill="#fff6c8" filter="url(#glow)" />
      </g>
      <g data-fin="100 60">
        <path d="M100,60 C94,74 84,78 74,78 C82,70 88,62 100,60 Z" fill="rgba(95,212,244,0.18)" stroke="#7ff6ff" strokeWidth="1" />
      </g>
      <g data-eye="120 42">
        <circle cx="120" cy="42" r="7.5" fill="#02101c" stroke="#9ffaff" strokeWidth="1.6" filter="url(#glow)" />
        <circle cx="121.8" cy="42.6" r="2.6" fill="#ffe9a8" filter="url(#glow)" />
      </g>
    </g>
  );
}

export function FishDefs() {
  return (
    <defs>
      <linearGradient id="fry-body" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff1e6" />
        <stop offset="0.6" stopColor="#ffd2bd" />
        <stop offset="1" stopColor="#ffb7a0" />
      </linearGradient>
      <linearGradient id="juv-body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff9a5a" />
        <stop offset="0.6" stopColor="#ffb86b" />
        <stop offset="1" stopColor="#ffd58a" />
      </linearGradient>
      <linearGradient id="juv-fin" x1="0" x2="1">
        <stop offset="0" stopColor="#ff7a4d" />
        <stop offset="1" stopColor="#ffa86a" />
      </linearGradient>
      <linearGradient id="ad-body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff6f61" />
        <stop offset="0.45" stopColor="#ffa35c" />
        <stop offset="1" stopColor="#ffd98a" />
      </linearGradient>
      <linearGradient id="ad-fin" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff5f8a" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffb06b" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="lum-body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#06253d" />
        <stop offset="0.6" stopColor="#0b3a5c" />
        <stop offset="1" stopColor="#0f4d6e" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export const FORMS = [Fry, Juvenile, Adult, Luminous];
