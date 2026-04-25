import React from "react";
import { replaceAffiliateTokens } from "./coupang";

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-sky-600 hover:text-sky-700 underline">$1</a>'
    );
}

export function renderMarkdown(content: string): React.ReactNode[] {
  // [AFFILIATE:tag] → 쿠팡 검색 URL 로 치환 (blog 본문 어필리에이트)
  const resolved = replaceAffiliateTokens(content);
  const lines = resolved.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-[#222222] mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-[#222222] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const row = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        tableRows.push(row);
        i++;
      }
      const filtered = tableRows.filter((row) => !row.every((c) => /^[-:]+$/.test(c)));
      if (filtered.length > 0) {
        const header = filtered[0];
        const body = filtered.slice(1);
        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {header.map((cell, ci) => (
                    <th
                      key={ci}
                      className="text-left px-3 py-2 bg-gray-50 text-[#222] font-semibold border-b border-gray-200"
                      dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 1 ? "bg-gray-50/50" : ""}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-2 text-[#444] border-b border-gray-100"
                        dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    } else if (line.startsWith("- [")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- [")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`tasks-${i}`} className="space-y-1.5 text-[#444] my-3 list-none pl-0">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item.replace(/^\[ \]\s*/, "☐ ").replace(/^\[x\]\s*/i, "☑ ")) }} />
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 text-[#444] my-3">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 text-[#444] my-3">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ol>
      );
      continue;
    } else if (/^!\[.*\]\(.+\)$/.test(line.trim())) {
      const match = line.trim().match(/^!\[(.*)?\]\((.+)\)$/);
      if (match) {
        elements.push(
          <figure key={i} className="my-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match[2]}
              alt={match[1] || ""}
              className="w-full h-56 sm:h-72 object-cover rounded-xl"
              loading="lazy"
            />
            {match[1] && (
              <figcaption className="text-xs text-[#999] text-center mt-2">
                {match[1]}
              </figcaption>
            )}
          </figure>
        );
      }
    } else if (line.trim() === "") {
      // skip empty lines
    } else if (line.trim() === "---") {
      elements.push(<hr key={i} className="my-8 border-gray-200" />);
    } else {
      elements.push(
        <p
          key={i}
          className="text-[#444] leading-7 my-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }
    i++;
  }

  return elements;
}
