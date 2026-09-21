import type { PlatformId } from "@/lib/platforms";

export default function PlatformIcon({
  id,
  className = "h-6 w-6",
}: {
  id: PlatformId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {id === "instagram" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </>
      )}
      {id === "tiktok" && (
        <>
          <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.4 2.6 2.1 4.2 5 4.5" />
        </>
      )}
      {id === "threads" && (
        <text
          x="12"
          y="19"
          textAnchor="middle"
          fontSize="21"
          fontWeight="700"
          fontStyle="italic"
          fill="currentColor"
          stroke="none"
        >
          @
        </text>
      )}
    </svg>
  );
}