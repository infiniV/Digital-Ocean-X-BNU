export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 40"
        className="max-w-[180px] fill-notion-text-light transition-colors dark:fill-notion-text-dark"
        aria-labelledby="logo-title"
        role="img"
      >
        <title id="logo-title">WET | WOMEN EMPOWER TRAINING</title>
        <rect
          x="5"
          y="5"
          width="230"
          height="30"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="stroke-notion-pink"
        />

        <text
          x="38"
          y="22"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-notion-pink text-base font-bold tracking-tight transition-colors hover:fill-notion-pink-dark"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          WET
        </text>

        <line
          x1="65"
          y1="8"
          x2="65"
          y2="32"
          stroke="currentColor"
          strokeWidth="5"
          className="stroke-notion-pink-dark opacity-50"
        />

        <text
          x="150"
          y="20"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-notion-pink text-[10px] font-bold tracking-tight transition-colors"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          WOMEN EMPOWER TRAINING
        </text>
      </svg>
    </div>
  );
}
