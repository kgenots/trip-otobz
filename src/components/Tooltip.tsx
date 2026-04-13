"use client";

interface TooltipProps {
  content: string;
  x: number;
  y: number;
}

export function Tooltip({ content, x, y }: TooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 whitespace-nowrap"
      style={{ left: x + 12, top: y - 12 }}
    >
      {content}
    </div>
  );
}
