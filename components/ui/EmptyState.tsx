import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({
  title = "No cases on file.",
  description,
  action = { label: "File the first report →", href: "/submit" },
}: EmptyStateProps) {
  return (
    <div className="rounded border border-dashed border-border-default py-16 text-center">
      <p className="font-serif text-lg text-text-secondary">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-text-tertiary">{description}</p>
      )}
      {action && (
        <p className="mt-2 text-sm text-text-tertiary">
          <Link href={action.href} className="text-accent-red hover:underline">
            {action.label}
          </Link>
        </p>
      )}
    </div>
  );
}
