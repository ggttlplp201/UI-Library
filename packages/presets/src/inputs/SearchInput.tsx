export interface SearchInputProps {
  /** Placeholder text */
  placeholder?: string
}

/** Search field with a leading magnifier icon. */
export function SearchInput({ placeholder = 'Search components...' }: SearchInputProps) {
  return (
    <div className="bg-card rounded-lg px-3 py-2 border border-white/10 flex items-center gap-2 min-w-[200px]">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b6b7a"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-[#6b6b7a]"
      />
    </div>
  )
}
