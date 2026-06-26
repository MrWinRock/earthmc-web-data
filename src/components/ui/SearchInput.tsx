import type { FormEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  ariaLabel = "Search",
}: SearchInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };
  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <span className="search__icon" aria-hidden>
        ⌕
      </span>
      <input
        className="search__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </form>
  );
}
