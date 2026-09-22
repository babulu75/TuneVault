import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search songs, artists…' }: Props) {
  return (
    <div className="search-bar">
      <Search size={15} className="search-bar__icon" />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} aria-label="Clear search">
          <X size={13} />
        </button>
      )}
    </div>
  )
}
