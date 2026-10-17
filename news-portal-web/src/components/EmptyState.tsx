type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <p className="text-lg font-semibold text-ink-900 dark:text-white">
        {title}
      </p>
      {description && (
        <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
