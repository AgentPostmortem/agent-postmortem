import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { TAGS } from "@/lib/constants/tags";

interface TagBadgeProps {
  tag: string;
  className?: string;
  /** If false, renders as a span instead of a link */
  linked?: boolean;
}

export function TagBadge({ tag, className, linked = true }: TagBadgeProps) {
  const tagData = TAGS.find((t) => t.slug === tag);
  const label = tagData?.label ?? tag;

  const classes = cn(
    "inline-flex items-center rounded border border-border-default bg-bg-elevated px-2 py-0.5 font-mono text-xs text-text-tertiary transition-colors",
    linked && "hover:border-border-strong hover:text-text-secondary",
    className,
  );

  if (!linked) {
    return <span className={classes}>{label}</span>;
  }

  return (
    <Link href={`/tag/${tag}`} className={classes}>
      {label}
    </Link>
  );
}
