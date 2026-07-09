// Shared inline SVG icons — replaces text-glyph icons (→ ← ✓ ✕ ▲ ▼ ◆ +).
// All icons inherit color via currentColor and are decorative by default.

interface IconProps {
  size?: number;
  className?: string;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

export function ArrowRightIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13.5 8h-11M6.5 4l-4 4 4 4" />
    </svg>
  );
}

export function CheckIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 8.5l3.5 3.5L13 4.5" />
    </svg>
  );
}

export function CloseIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 10l4.5-4.5L12.5 10" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3.5 6l4.5 4.5L12.5 6" />
    </svg>
  );
}

export function PlusIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function DiamondIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 2l5 6-5 6-5-6 5-6z" />
    </svg>
  );
}
