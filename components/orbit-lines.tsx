/** Decorative orbit ellipses for accent cards. Pure SVG + CSS, rotates slowly. */
export function OrbitLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      fill="none"
      className={`orbit-spin pointer-events-none absolute h-[640px] w-[640px] opacity-40 ${className}`}
    >
      <ellipse cx="300" cy="300" rx="290" ry="120" stroke="currentColor" strokeWidth="1.2" transform="rotate(-24 300 300)" />
      <ellipse cx="300" cy="300" rx="290" ry="120" stroke="currentColor" strokeWidth="1.2" transform="rotate(36 300 300)" />
      <ellipse cx="300" cy="300" rx="220" ry="220" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" />
      <circle cx="560" cy="210" r="5" fill="currentColor" />
      <circle cx="110" cy="470" r="4" fill="currentColor" />
    </svg>
  );
}
