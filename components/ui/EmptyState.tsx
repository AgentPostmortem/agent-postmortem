import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({
  title = "No cases on file.",
  description,
  action = { label: "File the first report", href: "/submit" },
}: EmptyStateProps) {
  return (
    <div className="rounded-sm border border-dashed border-border-default py-16 text-center">
      <p className="font-sans text-lg font-medium text-text-secondary">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-text-tertiary">{description}</p>
      )}
      {action && (
        <p className="mt-2 text-sm text-text-tertiary">
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent-strong hover:underline"
          >
            {action.label} <ArrowRightIcon size={10} />
          </Link>
        </p>
      )}
    </div>
  );
}
