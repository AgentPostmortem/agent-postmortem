export function LogoIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="5" fill="#0a0a0b" />
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="4"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="10"
        x2="24"
        y2="10"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="15.5"
        x2="24"
        y2="15.5"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <line
        x1="8"
        y1="21"
        x2="17"
        y2="21"
        stroke="#dc2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="24" cy="24" r="3" fill="#dc2626" />
    </svg>
  );
}
