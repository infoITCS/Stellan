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
    </svg>
  );
}
