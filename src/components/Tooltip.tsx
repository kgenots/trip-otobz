"use client";

interface TooltipProps {
  content: string;
  x: number;
  y: number;
}

export function Tooltip({ content, x, y }: TooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none px-3 py-2 bg-white text-[#222222] text-sm rounded-xl whitespace-nowrap font-medium"
      style={{
        left: x + 12,
        top: y - 12,
        boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px",
      }}
    >
      {content}
    </div>
  );
}
