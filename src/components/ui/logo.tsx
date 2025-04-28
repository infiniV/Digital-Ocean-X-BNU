export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 40"
        className="h-auto w-full max-w-[180px] fill-notion-text transition-colors dark:fill-notion-text-dark"
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
          className="stroke-notion-accent"
        />

        <text
          x="38"
          y="22"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-notion-accent text-lg font-bold tracking-tight transition-colors hover:fill-notion-accent-dark"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          WET
        </text>

        <line
          x1="70"
          y1="6"
          x2="70"
          y2="34"
          stroke="currentColor"
          strokeWidth="2.5"
          className="stroke-notion-accent"
        />

        <text
          x="150"
          y="22"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-notion-accent text-[8px] font-medium tracking-tight transition-colors"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          WOMEN EMPOWERMENT TRAINING
        </text>
      </svg>
    </div>
  );
}
