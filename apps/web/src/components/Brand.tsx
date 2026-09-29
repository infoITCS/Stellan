export function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <svg aria-hidden="true" className="brand-mark" height={size} viewBox="0 0 40 40" width={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stellan-mark-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4747" />
          <stop offset="52%" stopColor="#FF0000" />
          <stop offset="100%" stopColor="#C40000" />
        </linearGradient>
      </defs>
      <rect fill="url(#stellan-mark-fill)" height="40" rx="11" width="40" />
      <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.3">
        <path d="M19 13.4h-7a3.9 3.9 0 0 0 0 7.8h3.2a3.9 3.9 0 0 1 0 7.8h-7" />
        <path d="M32.6 13.4h-7a3.9 3.9 0 0 0 0 7.8h3.2a3.9 3.9 0 0 1 0 7.8h-7" />
      </g>
    </svg>
  );
}

export function BrandLockup() {
  return (
    <span className="brand-lockup">
      <BrandMark />
      <span className="brand-type">
        <span className="brand-name">Stellan</span>
        <span className="brand-subtitle">Solutions</span>
      </span>
    </span>
  );
}
