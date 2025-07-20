interface SearchResultHighlightProps {
  text: string;
  query: string;
  className?: string;
}

export default function SearchResultHighlight({ text, query, className = '' }: SearchResultHighlightProps) {
  if (!query || query.length < 2) {
    return <span className={className}>{text}</span>;
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        if (part.toLowerCase() === query.toLowerCase()) {
          return (
            <mark key={index} className="bg-yellow-200 text-slate-900 px-1 rounded">
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
} 