export type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'arrow-down'
  | 'menu'
  | 'close'
  | 'support'
  | 'cloud'
  | 'shield'
  | 'network'
  | 'compass'
  | 'workflow'
  | 'spark'
  | 'code'
  | 'check'
  | 'check-circle'
  | 'plus'
  | 'minus'
  | 'mail'
  | 'map-pin'
  | 'clock'
  | 'external'
  | 'chevron-right'
  | 'chevron-down'
  | 'linkedin'
  | 'globe'
  | 'search'
  | 'play'
  | 'pause'
  | 'lock'
  | 'scan-search'
  | 'swords'
  | 'shield-check'
  | 'activity'
  | 'laptop'
  | 'siren'
  | 'radar'
  | 'key-round'
  | 'smartphone'
  | 'lock-keyhole'
  | 'brick-wall'
  | 'globe-lock'
  | 'mail-warning'
  | 'file-lock'
  | 'database-backup'
  | 'clipboard-check'
  | 'bar-chart-3'
  | 'graduation-cap'
  | 'layers';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
}

export function Icon({ name, size = 20, className, title }: IconProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
      fill="none"
      height={size}
      role={title ? 'img' : undefined}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {name === 'arrow-up-right' ? <><path d="M5 19 19 5" {...common} /><path d="M8 5h11v11" {...common} /></> : null}
      {name === 'arrow-right' ? <><path d="M4 12h15" {...common} /><path d="m13 6 6 6-6 6" {...common} /></> : null}
      {name === 'arrow-down' ? <><path d="M12 4v15" {...common} /><path d="m6 13 6 6 6-6" {...common} /></> : null}
      {name === 'menu' ? <><path d="M4 7h16" {...common} /><path d="M4 12h16" {...common} /><path d="M4 17h16" {...common} /></> : null}
      {name === 'close' ? <><path d="m6 6 12 12" {...common} /><path d="m18 6-12 12" {...common} /></> : null}
      {name === 'support' ? <><path d="M5 13a7 7 0 0 1 14 0" {...common} /><path d="M5 13v3a2 2 0 0 0 2 2h1v-5H7a2 2 0 0 0-2 2Z" {...common} /><path d="M19 13v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" {...common} /><path d="M19 18c0 1.1-.9 2-2 2h-2" {...common} /></> : null}
      {name === 'cloud' ? <><path d="M7.5 18h9.7a4.3 4.3 0 0 0 .6-8.55A6.5 6.5 0 0 0 5.3 11.3 3.5 3.5 0 0 0 7.5 18Z" {...common} /><path d="M12 11v6" {...common} /><path d="m9.5 13.5 2.5-2.5 2.5 2.5" {...common} /></> : null}
      {name === 'shield' ? <><path d="M12 3 19 6v5c0 4.5-2.9 8.1-7 10-4.1-1.9-7-5.5-7-10V6l7-3Z" {...common} /><path d="m8.5 12 2.2 2.2 4.8-5" {...common} /></> : null}
      {name === 'network' ? <><rect height="5" rx="1" width="5" x="3" y="15" {...common} /><rect height="5" rx="1" width="5" x="16" y="4" {...common} /><rect height="5" rx="1" width="5" x="16" y="15" {...common} /><path d="M8 17.5h4a4 4 0 0 0 4-4v-4" {...common} /><path d="M8 17.5h8" {...common} /></> : null}
      {name === 'compass' ? <><circle cx="12" cy="12" r="8.5" {...common} /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" {...common} /></> : null}
      {name === 'workflow' ? <><rect height="5" rx="1" width="5" x="3" y="4" {...common} /><rect height="5" rx="1" width="5" x="16" y="15" {...common} /><rect height="5" rx="1" width="5" x="3" y="15" {...common} /><path d="M8 6.5h4a4 4 0 0 1 4 4V15" {...common} /><path d="M8 17.5h4" {...common} /></> : null}
      {name === 'spark' ? <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" {...common} /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" {...common} /></> : null}
      {name === 'code' ? <><path d="m8 7-5 5 5 5" {...common} /><path d="m16 7 5 5-5 5" {...common} /><path d="m14 4-4 16" {...common} /></> : null}
        {name === 'check' ? <path d="m5 12 4.2 4.2L19 6.5" {...common} /> : null}
        {name === 'check-circle' ? <><circle cx="12" cy="12" r="9" {...common} /><path d="m9 12 2 2 4-4" {...common} /></> : null}
      {name === 'plus' ? <><path d="M12 5v14" {...common} /><path d="M5 12h14" {...common} /></> : null}
      {name === 'minus' ? <path d="M5 12h14" {...common} /> : null}
      {name === 'mail' ? <><rect height="14" rx="2" width="18" x="3" y="5" {...common} /><path d="m4 7 8 6 8-6" {...common} /></> : null}
      {name === 'map-pin' ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" {...common} /><circle cx="12" cy="10" r="2.2" {...common} /></> : null}
      {name === 'clock' ? <><circle cx="12" cy="12" r="8.5" {...common} /><path d="M12 7v5l3.5 2" {...common} /></> : null}
      {name === 'external' ? <><path d="M14 5h5v5" {...common} /><path d="m19 5-8 8" {...common} /><path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" {...common} /></> : null}
      {name === 'chevron-right' ? <path d="m9 5 7 7-7 7" {...common} /> : null}
      {name === 'chevron-down' ? <path d="m5 9 7 7 7-7" {...common} /> : null}
      {name === 'linkedin' ? <><path d="M6 9v9" {...common} /><path d="M6 6.5v.1" {...common} /><path d="M10 18v-5a3 3 0 0 1 6 0v5" {...common} /><path d="M10 9v9" {...common} /><rect height="15" rx="2" width="15" x="4.5" y="4.5" {...common} /></> : null}
      {name === 'globe' ? <><circle cx="12" cy="12" r="8.5" {...common} /><path d="M3.8 12h16.4" {...common} /><path d="M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5S14.1 18.2 12 20.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z" {...common} /></> : null}
      {name === 'search' ? <><circle cx="10.8" cy="10.8" r="6.3" {...common} /><path d="m16 16 4.5 4.5" {...common} /></> : null}
      {name === 'play' ? <path d="m9 7 8 5-8 5V7Z" {...common} /> : null}
      {name === 'pause' ? <><path d="M9 8v8" {...common} /><path d="M15 8v8" {...common} /></> : null}
      {name === 'lock' ? <><rect height="10" rx="2" width="14" x="5" y="10" {...common} /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" {...common} /></> : null}
      {name === 'layers' ? <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" {...common} /><path d="m4 12 8 4.5 8-4.5" {...common} /><path d="m4 16.5 8 4.5 8-4.5" {...common} /></> : null}
      {name === 'scan-search' ? <><circle cx="11" cy="11" r="7" {...common} /><path d="m20 20-3.5-3.5" {...common} /><path d="M11 8v6M8 11h6" {...common} /></> : null}
      {name === 'swords' ? <><path d="m14.5 17.5-5-5" {...common} /><path d="m9.5 6.5 5 5" {...common} /><path d="M6 3v5h5" {...common} /><path d="M18 21v-5h-5" {...common} /><path d="M3 18l6-6" {...common} /><path d="M21 6l-6 6" {...common} /></> : null}
      {name === 'shield-check' ? <><path d="M12 3 19 6v5c0 4.5-2.9 8.1-7 10-4.1-1.9-7-5.5-7-10V6l7-3Z" {...common} /><path d="m9 12 2 2 4-4" {...common} /></> : null}
      {name === 'activity' ? <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...common} /> : null}
      {name === 'laptop' ? <><rect x="3" y="4" width="18" height="12" rx="2" ry="2" {...common} /><line x1="2" y1="20" x2="22" y2="20" {...common} /></> : null}
      {name === 'siren' ? <><path d="M7 18v-6a5 5 0 1 1 10 0v6" {...common} /><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" {...common} /><path d="M21 12h1M18.5 4.5 19 5M2 12h1M4.5 4.5 4 5M12 2v1" {...common} /></> : null}
      {name === 'radar' ? <><circle cx="12" cy="12" r="2" {...common} /><path d="M12 12 19 5" {...common} /><path d="M16.24 7.76a6 6 0 1 1-8.49 8.49" {...common} /></> : null}
      {name === 'key-round' ? <><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" {...common} /><circle cx="16.5" cy="7.5" r=".5" {...common} /></> : null}
      {name === 'smartphone' ? <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" {...common} /><line x1="12" y1="18" x2="12.01" y2="18" {...common} /></> : null}
      {name === 'lock-keyhole' ? <><circle cx="12" cy="16" r="1" {...common} /><rect x="8" y="10" width="8" height="10" rx="2" {...common} /><path d="M10 10V7a2 2 0 1 1 4 0v3" {...common} /></> : null}
      {name === 'brick-wall' ? <><rect x="3" y="3" width="18" height="18" rx="2" {...common} /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" {...common} /></> : null}
      {name === 'globe-lock' ? <><circle cx="12" cy="12" r="8" {...common} /><path d="M3.6 9h16.8M3.6 15h16.8M12 3a17 17 0 0 1 0 18M12 3a17 17 0 0 0 0 18" {...common} /><rect x="14" y="14" width="6" height="6" rx="1.5" {...common} /><path d="M16 14v-1.5a1 1 0 0 1 2 0V14" {...common} /></> : null}
      {name === 'mail-warning' ? <><path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" {...common} /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...common} /><path d="M20 14v4M20 22v.01" {...common} /></> : null}
      {name === 'file-lock' ? <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" {...common} /><path d="M14 2v4a2 2 0 0 0 2 2h4" {...common} /><rect x="8" y="12" width="8" height="6" rx="1" {...common} /><path d="M10 12V9a2 2 0 0 1 4 0v3" {...common} /></> : null}
      {name === 'database-backup' ? <><ellipse cx="12" cy="5" rx="9" ry="3" {...common} /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" {...common} /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" {...common} /><path d="m14 15-2 2-2-2M12 17v-4" {...common} /></> : null}
      {name === 'clipboard-check' ? <><rect x="8" y="2" width="8" height="4" rx="1" ry="1" {...common} /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...common} /><path d="m9 14 2 2 4-4" {...common} /></> : null}
      {name === 'bar-chart-3' ? <><path d="M3 3v18h18" {...common} /><path d="M18 17V9M13 17V5M8 17v-3" {...common} /></> : null}
      {name === 'graduation-cap' ? <><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" {...common} /><path d="M22 10v6" {...common} /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" {...common} /></> : null}
    </svg>
  );
}
