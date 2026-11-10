export default function Spinner({ size = 3 }: { size?: number }) {
  return (
    <span className="ct-loading-indicator" role="status" aria-label="Loading">
      <svg width={size * 16} height={size * 16} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path className="ct-loading-track" d="M24 4a20 20 0 1 0 20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="ct-loading-active" d="M24 4a20 20 0 0 1 20 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="m19 19-5 5 5 5m10-10 5 5-5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="sr-only">Loading</span>
    </span>
  );
}
