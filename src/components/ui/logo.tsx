export function Logo({}: { className?: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Main EMPWR text */}
      <svg
        width="120"
        height="20"
        viewBox="0 0 120 40"
        className="fill-notion-text-light transition-colors dark:fill-notion-text-dark"
      >
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-notion-pink text-2xl font-bold tracking-tight transition-colors hover:fill-notion-pink-dark"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          EMPWR
        </text>
      </svg>

      {/* Subtitle */}
      <div className="text-xs font-medium tracking-wide text-notion-text-light/70 dark:text-notion-text-dark/70">
        DO X BNU
      </div>
    </div>
  );
}
