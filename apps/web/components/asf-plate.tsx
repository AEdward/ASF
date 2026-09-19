export function AsfPlate() {
  return (
    <svg viewBox="0 0 600 560" role="img" aria-label="A plate styled after the ASF logo" className="h-full w-full">
      <defs>
        <radialGradient id="plateGold" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#ffcf5c" />
          <stop offset="80%" stopColor="#f5a617" />
          <stop offset="100%" stopColor="#d9860f" />
        </radialGradient>
        <linearGradient id="plateLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8cde1e" />
          <stop offset="100%" stopColor="#2f7a1f" />
        </linearGradient>
      </defs>

      <ellipse cx="300" cy="470" rx="200" ry="34" fill="#08160b" opacity="0.14" />

      <circle cx="300" cy="410" r="168" fill="url(#plateGold)" stroke="#3f8f0e" strokeWidth="11" />
      <circle cx="300" cy="410" r="148" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.45" />

      <path d="M300 262 C270 232 250 190 268 158 C300 178 312 222 300 262 Z" fill="url(#plateLeaf)" />
      <path
        d="M300 262 C330 226 358 192 352 150 C314 168 296 216 300 262 Z"
        fill="url(#plateLeaf)"
        opacity="0.92"
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
    </svg>
  );
}
