import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, blogPostBySlug } from "@/data/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${post.title} | Trip OTOBZ`,
      description: post.description,
      url: `https://trip.otobz.com/blog/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
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
      // 테이블 파싱
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const row = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        tableRows.push(row);
        i++;
      }
      // 구분선(|--|--|) 행 제거
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

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-sky-600 hover:text-sky-700 underline">$1</a>'
    );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold text-[#222222] tracking-tight hover:text-sky-600 transition-colors"
          >
            Trip<span className="hidden sm:inline"> OTOBZ</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#6a6a6a] hover:text-sky-600 transition-colors"
          >
            블로그
          </Link>
        </div>
      </header>

      {post.coverImage ? (
        <div className="h-64 sm:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
      ) : (
        <div className={`h-64 sm:h-80 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
          <span className="text-8xl sm:text-9xl">{post.coverEmoji}</span>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <time className="text-sm text-[#6a6a6a]">{post.date}</time>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mt-2 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="prose-custom">{renderMarkdown(post.content)}</div>

        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link
            href="/blog"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            &larr; 블로그 목록으로
          </Link>
        </div>
      </article>
    </main>
  );
}
