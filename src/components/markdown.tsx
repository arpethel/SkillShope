"use client";

import Link from "next/link";

// Lightweight markdown renderer — no external deps
// Supports: bold, italic, code, code blocks, links, lists, headers
export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let key = 0;

  const renderInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Match: **bold**, `code`, [text](url), *italic*
    const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // Bold
        parts.push(<strong key={`b${match.index}`} className="font-semibold text-[var(--text)]">{match[2]}</strong>);
      } else if (match[3]) {
        // Inline code
        parts.push(
          <code key={`c${match.index}`} className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs">
            {match[3]}
          </code>
        );
      } else if (match[4] && match[5]) {
        // Link — block javascript:, data:, vbscript: protocols
        const href = match[5];
        const isSafe = /^(https?:\/\/|\/[^/])/.test(href);
        if (!isSafe) {
          // Render as plain text, not a link
          parts.push(match[4]);
        } else if (href.startsWith("/")) {
          parts.push(
            <Link key={`l${match.index}`} href={href} className="text-[var(--accent)] hover:underline">
              {match[4]}
            </Link>
          );
        } else {
          parts.push(
            <a key={`l${match.index}`} href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              {match[4]}
            </a>
          );
        }
      } else if (match[6]) {
        // Italic
        parts.push(<em key={`i${match.index}`}>{match[6]}</em>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={key++} className="my-2 overflow-x-auto rounded-lg bg-[var(--bg-secondary)] p-3 text-xs">
            {codeBuffer.join("\n")}
          </pre>
        );
        codeBuffer = [];
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else if (line.startsWith("### ")) {
      elements.push(<h4 key={key++} className="mt-3 mb-1 text-xs font-bold">{renderInline(line.slice(4))}</h4>);
    } else if (line.startsWith("## ")) {
      elements.push(<h3 key={key++} className="mt-3 mb-1 text-sm font-bold">{renderInline(line.slice(3))}</h3>);
    } else if (line.startsWith("# ")) {
      elements.push(<h2 key={key++} className="mt-3 mb-1 font-bold">{renderInline(line.slice(2))}</h2>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key++} className="flex gap-2 pl-2">
          <span className="shrink-0 text-[var(--text-secondary)]">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "");
      const num = line.match(/^(\d+)/)?.[1];
      elements.push(
        <div key={key++} className="flex gap-2 pl-2">
          <span className="shrink-0 text-[var(--text-secondary)]">{num}.</span>
          <span>{renderInline(text)}</span>
        </div>
      );
    } else {
      elements.push(<p key={key++}>{renderInline(line)}</p>);
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}
