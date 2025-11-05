"use client";

interface LoadMoreButtonProps {
  onClick: () => void;
  hasMore: boolean;
}

export default function LoadMoreButton({ onClick, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) return null; // hide if no more posts

  return (
    <div className="text-center mt-10">
      <button
        onClick={onClick}
        className="text-blue-600 hover:underline px-4 py-2 rounded-md transition-all duration-200"
      >
        Load More →
      </button>
    </div>
  );
}
