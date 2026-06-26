import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ← Prev
      </Button>
      <span className="pager__info">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Next →
      </Button>
    </nav>
  );
}
