export function AnimalFeastArt() {
  return (
    <svg
      viewBox="0 0 600 560"
      role="img"
      aria-label="A cow, ox, sheep, goat, camel and chicken gathered around a plate shaped like the ASF logo"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient id="gradCow" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f2ede2" />
          <stop offset="100%" stopColor="#d8d0bd" />
        </radialGradient>
        <radialGradient id="gradOx" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#c9925c" />
          <stop offset="55%" stopColor="#9a6636" />
          <stop offset="100%" stopColor="#6b4322" />
        </radialGradient>
        <radialGradient id="gradSheep" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f3ecd9" />
          <stop offset="100%" stopColor="#dcd0ae" />
        </radialGradient>
        <radialGradient id="gradGoat" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#f3f5f6" />
          <stop offset="55%" stopColor="#d3d8db" />
          <stop offset="100%" stopColor="#a7adb2" />
        </radialGradient>
        <radialGradient id="gradCamel" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#f2d9b0" />
          <stop offset="55%" stopColor="#dcb280" />
          <stop offset="100%" stopColor="#ab7c4d" />
        </radialGradient>
        <radialGradient id="gradChicken" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f6f6f6" />
          <stop offset="100%" stopColor="#e1e1e1" />
        </radialGradient>
        <radialGradient id="gradSnout" cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffd9dd" />
          <stop offset="60%" stopColor="#f0a9b4" />
          <stop offset="100%" stopColor="#d98899" />
        </radialGradient>
        <radialGradient id="gradPlate" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#ffcf5c" />
          <stop offset="80%" stopColor="#f5a617" />
          <stop offset="100%" stopColor="#d9860f" />
        </radialGradient>
        <linearGradient id="gradLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8cde1e" />
          <stop offset="100%" stopColor="#2f7a1f" />
        </linearGradient>
      </defs>

      <ellipse cx="300" cy="470" rx="200" ry="34" fill="#08160b" opacity="0.14" />

      {/* Plate, styled after the ASF logo */}
      <g>
        <circle cx="300" cy="410" r="168" fill="url(#gradPlate)" stroke="#3f8f0e" strokeWidth="11" />
        <circle cx="300" cy="410" r="148" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.45" />

        <path
          d="M300 262 C270 232 250 190 268 158 C300 178 312 222 300 262 Z"
          fill="url(#gradLeaf)"
        />
        <path
          d="M300 262 C330 226 358 192 352 150 C314 168 296 216 300 262 Z"
          fill="url(#gradLeaf)"
          opacity="0.92"
        />
        <path
          d="M300 260 C292 236 288 208 296 182"
          stroke="#e9ffcf"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />

        <text
          x="300"
          y="401"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="58"
          fill="#c97a0e"
        >
          ASF
        </text>
        <text
          x="300"
          y="398"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="58"
          fill="#ffffff"
        >
          ASF
        </text>

        <line x1="196" y1="438" x2="222" y2="438" stroke="#2f6f16" strokeWidth="3" />
        <text
          x="300"
          y="444"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="16"
          letterSpacing="1"
          fill="#2f6f16"
        >
          Agro Industry
        </text>
        <line x1="378" y1="438" x2="404" y2="438" stroke="#2f6f16" strokeWidth="3" />

        <g fill="#a9662a">
          <ellipse cx="230" cy="440" rx="7" ry="5" transform="rotate(20 230 440)" />
          <ellipse cx="250" cy="480" rx="7" ry="5" transform="rotate(-10 250 480)" />
          <ellipse cx="360" cy="475" rx="7" ry="5" transform="rotate(15 360 475)" />
          <ellipse cx="375" cy="435" rx="7" ry="5" transform="rotate(-25 375 435)" />
          <ellipse cx="300" cy="500" rx="7" ry="5" transform="rotate(5 300 500)" />
          <ellipse cx="210" cy="405" rx="6" ry="4.5" transform="rotate(40 210 405)" />
          <ellipse cx="392" cy="400" rx="6" ry="4.5" transform="rotate(-40 392 400)" />
        </g>
      </g>

      {/* Back row: cow / ox / camel */}

      <g transform="translate(150,175)">
        <ellipse cx="-88" cy="-15" rx="30" ry="42" transform="rotate(-25 -88 -15)" fill="url(#gradCow)" />
        <ellipse cx="88" cy="-15" rx="30" ry="42" transform="rotate(25 88 -15)" fill="url(#gradCow)" />
        <ellipse cx="-88" cy="-15" rx="16" ry="26" transform="rotate(-25 -88 -15)" fill="#f0b9c2" />
        <ellipse cx="88" cy="-15" rx="16" ry="26" transform="rotate(25 88 -15)" fill="#f0b9c2" />
        <path d="M-58 -78 C-66 -95 -60 -110 -46 -112 C-50 -98 -46 -86 -38 -78 Z" fill="#e9e2d2" />
        <path d="M58 -78 C66 -95 60 -110 46 -112 C50 -98 46 -86 38 -78 Z" fill="#e9e2d2" />
        <ellipse cx="0" cy="-10" rx="82" ry="92" fill="url(#gradCow)" />
        <path d="M-70 -55 C-40 -65 -20 -50 -28 -20 C-46 -14 -66 -24 -70 -55 Z" fill="#2b2b2b" />
        <path d="M30 30 C55 18 78 30 74 55 C56 66 34 58 30 30 Z" fill="#2b2b2b" />
        <ellipse cx="0" cy="58" rx="60" ry="34" fill="url(#gradSnout)" />
        <ellipse cx="-16" cy="58" rx="5" ry="7" fill="#7a3b45" />
        <ellipse cx="16" cy="58" rx="5" ry="7" fill="#7a3b45" />
        <path d="M-20 76 Q0 84 20 76" stroke="#5c2a33" strokeWidth="3" fill="none" strokeLinecap="round" />
        <g>
          <ellipse cx="-32" cy="-14" rx="12" ry="15" fill="#fff" />
          <circle cx="-30" cy="-11" r="7" fill="#221a12" />
          <circle cx="-33" cy="-15" r="2.2" fill="#fff" />
          <ellipse cx="32" cy="-14" rx="12" ry="15" fill="#fff" />
          <circle cx="34" cy="-11" r="7" fill="#221a12" />
          <circle cx="31" cy="-15" r="2.2" fill="#fff" />
        </g>
      </g>

      <g transform="translate(300,140)">
        <path d="M-70 -60 C-125 -78 -150 -110 -132 -128 C-108 -104 -84 -92 -58 -78 Z" fill="#e6e1d6" />
        <path d="M70 -60 C125 -78 150 -110 132 -128 C108 -104 84 -92 58 -78 Z" fill="#e6e1d6" />
        <ellipse cx="-92" cy="0" rx="26" ry="36" transform="rotate(-15 -92 0)" fill="url(#gradOx)" />
        <ellipse cx="92" cy="0" rx="26" ry="36" transform="rotate(15 92 0)" fill="url(#gradOx)" />
        <ellipse cx="0" cy="-5" rx="86" ry="96" fill="url(#gradOx)" />
        <ellipse cx="0" cy="65" rx="66" ry="38" fill="url(#gradSnout)" />
        <ellipse cx="-18" cy="65" rx="5.5" ry="7.5" fill="#7a3b45" />
        <ellipse cx="18" cy="65" rx="5.5" ry="7.5" fill="#7a3b45" />
        <path d="M-22 84 Q0 92 22 84" stroke="#5c2a33" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-90 30 Q0 55 90 30" stroke="#4a2c14" strokeWidth="4" fill="none" opacity="0.4" />
        <g>
          <ellipse cx="-34" cy="-16" rx="12.5" ry="15.5" fill="#fff" />
          <circle cx="-32" cy="-13" r="7.2" fill="#1c130a" />
          <circle cx="-35" cy="-17" r="2.2" fill="#fff" />
          <ellipse cx="34" cy="-16" rx="12.5" ry="15.5" fill="#fff" />
          <circle cx="36" cy="-13" r="7.2" fill="#1c130a" />
          <circle cx="33" cy="-17" r="2.2" fill="#fff" />
        </g>
      </g>

      <g transform="translate(465,175)">
        <ellipse cx="-6" cy="-72" rx="58" ry="50" fill="url(#gradCamel)" />
        <ellipse cx="4" cy="10" rx="44" ry="42" fill="url(#gradCamel)" />
        <ellipse cx="-32" cy="-30" rx="12" ry="16" transform="rotate(-25 -32 -30)" fill="url(#gradCamel)" />
        <ellipse cx="34" cy="-32" rx="12" ry="16" transform="rotate(20 34 -32)" fill="url(#gradCamel)" />
        <ellipse cx="-32" cy="-30" rx="6" ry="9" transform="rotate(-25 -32 -30)" fill="#8a6636" />
        <ellipse cx="34" cy="-32" rx="6" ry="9" transform="rotate(20 34 -32)" fill="#8a6636" />
        <path d="M-6 -34 C-14 -46 -6 -56 6 -54 C0 -46 0 -39 8 -31 Z" fill="#c99a5f" />
        <ellipse cx="48" cy="36" rx="35" ry="19" fill="url(#gradCamel)" />
        <ellipse cx="46" cy="40" rx="3.8" ry="5" fill="#7a5236" />
        <ellipse cx="66" cy="42" rx="3.8" ry="5" fill="#7a5236" />
        <path d="M40 54 Q58 61 78 52" stroke="#6b4322" strokeWidth="3" fill="none" strokeLinecap="round" />
        <g>
          <ellipse cx="-16" cy="-2" rx="11" ry="13.5" fill="#fff" />
          <circle cx="-14" cy="1" r="6.3" fill="#221a12" />
          <circle cx="-17" cy="-3" r="2" fill="#fff" />
          <ellipse cx="18" cy="-6" rx="10" ry="12.5" fill="#fff" />
          <circle cx="20" cy="-3" r="5.8" fill="#221a12" />
          <circle cx="17" cy="-7" r="1.9" fill="#fff" />
        </g>
      </g>

      {/* Front row: sheep / goat / chicken */}

      <g transform="translate(95,320)">
        <circle cx="-58" cy="-48" r="30" fill="url(#gradSheep)" />
        <circle cx="-30" cy="-72" r="30" fill="url(#gradSheep)" />
        <circle cx="8" cy="-80" r="32" fill="url(#gradSheep)" />
        <circle cx="48" cy="-64" r="30" fill="url(#gradSheep)" />
        <circle cx="66" cy="-30" r="28" fill="url(#gradSheep)" />
        <circle cx="-70" cy="-10" r="26" fill="url(#gradSheep)" />
        <ellipse cx="-52" cy="-20" rx="16" ry="20" transform="rotate(-25 -52 -20)" fill="#6a5749" />
        <ellipse cx="52" cy="-20" rx="16" ry="20" transform="rotate(25 52 -20)" fill="#6a5749" />
        <ellipse cx="0" cy="10" rx="58" ry="60" fill="#6a5749" />
        <ellipse cx="0" cy="62" rx="34" ry="22" fill="#5a4a3e" />
        <ellipse cx="-11" cy="62" rx="4" ry="5.5" fill="#3a2f27" />
        <ellipse cx="11" cy="62" rx="4" ry="5.5" fill="#3a2f27" />
        <path d="M-14 78 Q0 84 14 78" stroke="#2c231d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <g>
          <ellipse cx="-20" cy="0" rx="10.5" ry="13" fill="#fff" />
          <circle cx="-18" cy="3" r="6" fill="#151210" />
          <circle cx="-21" cy="-1" r="2" fill="#fff" />
          <ellipse cx="20" cy="0" rx="10.5" ry="13" fill="#fff" />
          <circle cx="22" cy="3" r="6" fill="#151210" />
          <circle cx="19" cy="-1" r="2" fill="#fff" />
        </g>
      </g>

      <g transform="translate(300,295)">
        <path d="M-24 -45 C-34 -64 -30 -78 -14 -76 C-18 -62 -15 -50 -6 -42 Z" fill="#e7c98f" />
        <path d="M24 -45 C34 -64 30 -78 14 -76 C18 -62 15 -50 6 -42 Z" fill="#e7c98f" />
        <ellipse cx="-56" cy="-4" rx="17" ry="24" transform="rotate(-18 -56 -4)" fill="url(#gradGoat)" />
        <ellipse cx="56" cy="-4" rx="17" ry="24" transform="rotate(18 56 -4)" fill="url(#gradGoat)" />
        <ellipse cx="0" cy="4" rx="56" ry="62" fill="url(#gradGoat)" />
        <path
          d="M-6 52 C-14 56 -16 68 -9 73 C-2 75 3 75 7 71 C12 66 10 55 -6 52 Z"
          fill="#e7c98f"
        />
        <ellipse cx="0" cy="52" rx="30" ry="20" fill="#9aa0a6" />
        <ellipse cx="-10" cy="52" rx="3.6" ry="5" fill="#4b4f52" />
        <ellipse cx="10" cy="52" rx="3.6" ry="5" fill="#4b4f52" />
        <path d="M-13 66 Q0 71 13 66" stroke="#4b4f52" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <g>
          <ellipse cx="-19" cy="-6" rx="10" ry="12.5" fill="#f2e9c9" />
          <rect x="-21.5" y="-11" width="5" height="12" rx="2.4" fill="#151210" />
          <circle cx="-22.5" cy="-11" r="1.8" fill="#fff" />
          <ellipse cx="19" cy="-6" rx="10" ry="12.5" fill="#f2e9c9" />
          <rect x="16.5" y="-11" width="5" height="12" rx="2.4" fill="#151210" />
          <circle cx="15.5" cy="-11" r="1.8" fill="#fff" />
        </g>
      </g>

      <g transform="translate(500,325)">
        <path d="M-8 -78 C-20 -92 -12 -102 2 -96 C0 -90 2 -84 8 -80 Z" fill="#e1483f" />
        <path d="M4 -84 C4 -98 16 -104 24 -94 C16 -92 12 -86 12 -78 Z" fill="#e1483f" />
        <path d="M14 -72 C22 -80 32 -78 32 -68 C26 -66 18 -66 14 -72 Z" fill="#e1483f" />
        <ellipse cx="0" cy="-10" rx="54" ry="62" fill="url(#gradChicken)" />
        <ellipse cx="0" cy="56" rx="46" ry="44" fill="url(#gradChicken)" />
        <path d="M8 -18 L34 -8 L8 2 Z" fill="#f2a11e" />
        <ellipse cx="26" cy="-26" rx="7" ry="6" fill="#e1483f" />
        <g>
          <ellipse cx="-10" cy="-24" rx="10.5" ry="12.5" fill="#fff" />
          <circle cx="-8" cy="-21" r="6" fill="#151210" />
          <circle cx="-11" cy="-25" r="2" fill="#fff" />
          <ellipse cx="18" cy="-30" rx="9" ry="11" fill="#fff" />
          <circle cx="20" cy="-27" r="5.2" fill="#151210" />
          <circle cx="17" cy="-31" r="1.8" fill="#fff" />
        </g>
        <path d="M-40 30 C-56 24 -60 8 -48 -2 C-42 14 -40 22 -40 30 Z" fill="#f2f2f2" />
        <path d="M40 30 C56 24 60 8 48 -2 C42 14 40 22 40 30 Z" fill="#e6e6e6" />
      </g>

      <g fill="#c98a3f">
        <ellipse cx="150" cy="255" rx="5" ry="4" transform="rotate(30 150 255)" />
        <ellipse cx="300" cy="240" rx="5" ry="4" />
        <ellipse cx="440" cy="270" rx="5" ry="4" transform="rotate(-30 440 270)" />
      </g>
    </svg>
  );
}
