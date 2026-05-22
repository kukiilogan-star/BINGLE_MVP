import React from 'react';

/**
 * Hand-drawn premium SVG vector illustrations for the Fridge feeding items.
 * Designed with a consistent, premium claymation outline aesthetic matching Bingle.
 */
export default function FoodVector({ id, size = 32, className = '', style = {} }) {
  const svgStyle = {
    width: '100%',
    height: '100%',
    overflow: 'visible',
    filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.15))',
    ...style
  };

  return (
    <div className={`flex items-center justify-center select-none pointer-events-none ${className}`} style={{ width: size, height: size }}>
      {id === 'water' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Water Bottle Body */}
          <path
            d="M40 25 C40 20, 44 15, 44 10 L56 10 C56 15, 60 20, 60 25 L64 45 C65 52, 68 60, 68 75 C68 88, 62 90, 50 90 C38 90, 32 88, 32 75 C32 60, 35 52, 36 45 Z"
            fill="#dbeafe"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Liquid Water inside */}
          <path
            d="M33.5 65 C33.5 55, 36 50, 37 45 L63 45 C64 50, 66.5 55, 66.5 65 C66.5 78, 60 88, 50 88 C40 88, 33.5 78, 33.5 65 Z"
            fill="#60a5fa"
            opacity="0.85"
          />
          {/* Bubbles inside */}
          <circle cx="44" cy="55" r="3" fill="#ffffff" opacity="0.7" />
          <circle cx="56" cy="65" r="4.5" fill="#ffffff" opacity="0.6" />
          <circle cx="48" cy="74" r="2.5" fill="#ffffff" opacity="0.8" />
          <circle cx="53" cy="52" r="2" fill="#ffffff" opacity="0.7" />
          
          {/* Label */}
          <rect x="40" y="55" width="20" height="15" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M46 62.5 H54 M50 58.5 V66.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          
          {/* Cork/Cap */}
          <rect x="44" y="5" width="12" height="6" rx="1" fill="#ea580c" stroke="#1e293b" strokeWidth="3" />
          
          {/* Gloss highlight */}
          <path d="M37 32 C37 25, 41 20, 45 18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 70 C36 60, 38 52, 38 52" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'orange' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Green Leaf */}
          <path
            d="M50 25 C45 15, 30 18, 35 32 C45 35, 48 30, 50 25 Z"
            fill="#22c55e"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M42 27 C38 22, 45 22, 45 22" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />

          {/* Orange Outer Rind */}
          <circle cx="50" cy="58" r="32" fill="#f97316" stroke="#1e293b" strokeWidth="4" />
          
          {/* Inner White Layer */}
          <circle cx="50" cy="58" r="28" fill="#fff7ed" />
          
          {/* Juicy Pulp Segments */}
          <path d="M50 58 L50 34 C54 34, 57 36, 59 39 Z" fill="#fb923c" stroke="#f97316" strokeWidth="1.5" />
          <path d="M50 58 L68 46 C71 50, 71 54, 70 58 Z" fill="#fb923c" stroke="#f97316" strokeWidth="1.5" />
          <path d="M50 58 L62 76 C58 79, 54 80, 50 80 Z" fill="#fb923c" stroke="#f97316" strokeWidth="1.5" />
          <path d="M50 58 L32 70 C29 66, 29 62, 30 58 Z" fill="#fb923c" stroke="#f97316" strokeWidth="1.5" />
          <path d="M50 58 L38 40 C42 36, 46 34, 50 34 Z" fill="#fb923c" stroke="#f97316" strokeWidth="1.5" />
          
          {/* Segment Details / Juice dots */}
          <circle cx="46" cy="42" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="58" cy="46" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="60" cy="58" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="48" cy="72" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="38" cy="60" r="1.5" fill="#ffffff" opacity="0.6" />

          {/* Highlights */}
          <path d="M26 44 C22 52, 22 64, 28 72" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'chocolate' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Chocolate Bar Wrapper Shadow Backing */}
          <path
            d="M25 35 L75 35 L75 88 C75 92, 70 94, 65 94 L35 94 C30 94, 25 92, 25 88 Z"
            fill="#dc2626"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          
          {/* Chocolate Blocks poking out */}
          <path
            d="M32 35 V15 C32 12, 35 10, 38 10 H62 C65 10, 68 12, 68 15 V35 Z"
            fill="#78350f"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Block cuts */}
          <rect x="36" y="14" width="12" height="15" rx="1.5" fill="#451a03" stroke="#1e293b" strokeWidth="2" />
          <rect x="52" y="14" width="12" height="15" rx="1.5" fill="#451a03" stroke="#1e293b" strokeWidth="2" />
          
          {/* Torn Foil Wrap (Silver/Metallic) */}
          <path
            d="M24 35 L33 30 L45 37 L55 28 L66 36 L76 33 L76 45 L24 45 Z"
            fill="#e2e8f0"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Red Foil Main wrapper detail */}
          <rect x="25" y="45" width="50" height="43" rx="0" fill="#ef4444" />
          
          {/* Cute logo on Wrapper */}
          <circle cx="50" cy="65" r="12" fill="#fef08a" stroke="#1e293b" strokeWidth="2" />
          <path d="M45 65 Q50 71, 55 65" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="47" cy="61" r="1.5" fill="#1e293b" />
          <circle cx="53" cy="61" r="1.5" fill="#1e293b" />

          {/* Highlights */}
          <path d="M29 48 V85" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 12 H42" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M51 12 H58" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'melon' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Striped Rind Base */}
          <path
            d="M15 45 C15 75, 45 85, 85 85 C85 85, 60 65, 45 45 Z"
            fill="#15803d"
            stroke="#1e293b"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          
          {/* Pale Inner Layer */}
          <path
            d="M20 48 C20 72, 44 80, 80 80 C80 80, 58 62, 45 48 Z"
            fill="#bbf7d0"
          />
          
          {/* Sweet Juicy Flesh (Light Orange or Bright Melon green) */}
          <path
            d="M25 50 C25 68, 42 75, 75 75 C75 75, 55 58, 45 50 Z"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="1.5"
          />
          
          {/* Seeds inside */}
          <circle cx="42" cy="64" r="2" fill="#7c2d12" />
          <circle cx="48" cy="68" r="2.5" fill="#7c2d12" />
          <circle cx="55" cy="71" r="2" fill="#7c2d12" />
          <circle cx="62" cy="73" r="2" fill="#7c2d12" />
          <circle cx="37" cy="58" r="2.2" fill="#7c2d12" />

          {/* Highlights */}
          <path d="M22 62 C26 70, 36 75, 48 76" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'milk' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Milk Jar Body */}
          <path
            d="M35 30 C35 22, 42 20, 42 12 L58 12 C58 20, 65 22, 65 30 V75 C65 85, 60 90, 50 90 C40 90, 35 85, 35 75 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Rich lavender creamy milk content inside */}
          <path
            d="M37 42 V75 C37 83, 42 88, 50 88 C58 88, 63 83, 63 75 V42 C63 42, 57 44, 50 42 C43 40, 37 42, 37 42 Z"
            fill="#faf5ff"
            stroke="#c084fc"
            strokeWidth="1"
          />
          {/* Lavender sprig decal / sticker on the glass */}
          <rect x="42" y="52" width="16" height="20" rx="3" fill="#f3e8ff" stroke="#c084fc" strokeWidth="2" />
          {/* Lavender flower drawing */}
          <circle cx="50" cy="58" r="2.5" fill="#a855f7" />
          <circle cx="50" cy="62" r="2.5" fill="#a855f7" />
          <circle cx="50" cy="66" r="2" fill="#c084fc" />
          <path d="M50 56 V69" stroke="#22c55e" strokeWidth="1.5" />
          
          {/* Cork stopper */}
          <path d="M42 12 C42 8, 58 8, 58 12 Z" fill="#d97706" stroke="#1e293b" strokeWidth="3" />
          <rect x="40" y="12" width="20" height="4" rx="1.5" fill="#d97706" stroke="#1e293b" strokeWidth="3" />

          {/* Highlight shimmer */}
          <path d="M39 32 C39 26, 42 22, 44 22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M61 38 V80" stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </svg>
      )}

      {id === 'icecream' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Cone (Waffle) */}
          <path
            d="M32 50 L50 92 L68 50 Z"
            fill="#d97706"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Crosshatch patterns */}
          <path d="M38 50 L53 85 M44 50 L56 78 M50 50 L59 70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M62 50 L47 85 M56 50 L44 78 M50 50 L41 70" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />

          {/* Pink Berry Cream Swirls */}
          <path
            d="M28 50 C26 40, 36 34, 46 38 C40 28, 55 20, 64 28 C74 34, 72 44, 68 50 C74 54, 24 54, 28 50 Z"
            fill="#f472b6"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          
          {/* Swirl layer 2 (white highlight / cream) */}
          <path
            d="M36 44 C36 38, 44 32, 54 36 C50 28, 62 26, 64 34"
            stroke="#fce7f3"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Bright red cherry on top! */}
          <circle cx="58" cy="20" r="7" fill="#dc2626" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M58 13 C60 5, 68 8, 70 8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <circle cx="56" cy="18" r="1.5" fill="#ffffff" />
        </svg>
      )}

      {id === 'apple' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Green leaf */}
          <path
            d="M52 22 C55 12, 68 15, 62 25 Z"
            fill="#22c55e"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Stem */}
          <path d="M50 30 Q53 20, 56 16" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />

          {/* Green Apple Body */}
          <path
            d="M32 38 C20 38, 20 68, 36 78 C42 82, 48 78, 50 76 C52 78, 58 82, 64 78 C80 68, 80 38, 68 38 C60 38, 54 44, 50 44 C46 44, 40 38, 32 38 Z"
            fill="#4ade80"
            stroke="#1e293b"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Highlights */}
          <path d="M28 48 C24 56, 26 66, 34 70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M68 44 C72 48, 74 54, 72 60" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="46" r="2.5" fill="#ffffff" />
        </svg>
      )}

      {id === 'coffee' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Straw */}
          <path d="M64 10 L52 45" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M64 10 L52 45" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Coffee Cup body */}
          <path
            d="M32 35 L38 85 C39 90, 42 92, 50 92 C58 92, 61 90, 62 85 L68 35 Z"
            fill="#f1f5f9"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {/* Coffee liquid inside */}
          <path
            d="M34 45 L38.5 83 C39.5 87, 42 89, 50 89 C58 89, 60.5 87, 61.5 83 L66 45 Z"
            fill="#451a03"
          />

          {/* Ice Cubes */}
          <rect x="42" y="48" width="10" height="10" rx="2" transform="rotate(15 42 48)" fill="#ffffff" opacity="0.6" stroke="#78350f" strokeWidth="1.5" />
          <rect x="52" y="55" width="9" height="9" rx="2" transform="rotate(-20 52 55)" fill="#ffffff" opacity="0.5" stroke="#78350f" strokeWidth="1.5" />
          
          {/* Cup Lid */}
          <ellipse cx="50" cy="35" rx="19" ry="5" fill="#e2e8f0" stroke="#1e293b" strokeWidth="4.5" />
          
          {/* Sleeve */}
          <path
            d="M33.5 50 L35.5 68 H64.5 L66.5 50 Z"
            fill="#fca5a5"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Coffee logo on Sleeve */}
          <circle cx="50" cy="59" r="5" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M48 59 Q50 61, 52 59" stroke="#1e293b" strokeWidth="1" fill="none" />

          {/* Highlights */}
          <path d="M37 38 L42 80" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}

      {id === 'cake' && (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
          {/* Triangular Cake Slice Base */}
          <path
            d="M20 70 L75 82 L82 50 L25 42 Z"
            fill="#fbcfe8"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Cake Layers (Sponge + Cream) */}
          <path d="M22 60 L76 72" stroke="#db2777" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M24 50 L79 60" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          
          {/* Top Whipped Cream (Frosting) */}
          <path
            d="M25 42 C25 42, 38 32, 50 35 C62 38, 75 28, 82 50 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M36 38 C42 35, 52 40, 58 36" stroke="#fbcfe8" strokeWidth="2" strokeLinecap="round" />

          {/* Red Juicy Strawberry sitting on top! */}
          <path
            d="M48 30 C45 25, 45 15, 52 14 C60 15, 60 25, 54 30 Z"
            fill="#dc2626"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Strawberry seeds */}
          <circle cx="49" cy="22" r="0.75" fill="#fef08a" />
          <circle cx="53" cy="24" r="0.75" fill="#fef08a" />
          <circle cx="54" cy="18" r="0.75" fill="#fef08a" />
          <circle cx="50" cy="16" r="0.75" fill="#fef08a" />
          {/* Strawberry green stem */}
          <path d="M50 14 C48 11, 54 11, 52 14 Z" fill="#22c55e" stroke="#1e293b" strokeWidth="1.5" />
          
          {/* Cream dollop lines */}
          <path d="M28 42 Q32 46, 36 42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M44 45 Q48 49, 52 45" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M60 48 Q64 52, 68 48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}
    </div>
  );
}
