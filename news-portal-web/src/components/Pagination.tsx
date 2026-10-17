type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
};

export function Pagination({
  page,
  totalPages,
  onChange,
  prevLabel,
  nextLabel,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
      >
        {prevLabel}
      </button>
      <span className="text-sm text-ink-500">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
      >
        {nextLabel}
      </button>
    </div>
  );
}
