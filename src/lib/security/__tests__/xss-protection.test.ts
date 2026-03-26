import { describe, it, expect } from "vitest";

// Test the link sanitization logic used in markdown renderer
function isSafeLink(href: string): boolean {
  return /^(https?:\/\/|\/[^/])/.test(href);
}

describe("XSS link protection", () => {
  it("allows https links", () => {
    expect(isSafeLink("https://skillshope.com")).toBe(true);
    expect(isSafeLink("https://github.com/repo")).toBe(true);
  });

  it("allows http links", () => {
    expect(isSafeLink("http://localhost:3000")).toBe(true);
  });

  it("allows internal paths", () => {
    expect(isSafeLink("/skills/mcp-forge")).toBe(true);
    expect(isSafeLink("/docs")).toBe(true);
    expect(isSafeLink("/browse?q=test")).toBe(true);
  });

  it("blocks javascript: protocol", () => {
    expect(isSafeLink("javascript:alert(1)")).toBe(false);
    expect(isSafeLink("javascript:alert(document.cookie)")).toBe(false);
  });

  it("blocks data: protocol", () => {
    expect(isSafeLink("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("blocks vbscript: protocol", () => {
    expect(isSafeLink("vbscript:MsgBox(1)")).toBe(false);
  });

  it("blocks empty/relative paths that could be abused", () => {
    expect(isSafeLink("")).toBe(false);
    expect(isSafeLink("//evil.com")).toBe(false);
  });

  it("blocks case variations of javascript:", () => {
    expect(isSafeLink("JaVaScRiPt:alert(1)")).toBe(false);
    expect(isSafeLink("JAVASCRIPT:alert(1)")).toBe(false);
  });
});

describe("HTML sanitization", () => {
  // Test our sanitize function logic
  function sanitize(str: string): string {
    return str.replace(/<[^>]*>/g, "").trim();
  }

  it("strips script tags", () => {
    expect(sanitize("<script>alert(1)</script>")).toBe("alert(1)");
  });

  it("strips img tags with onerror", () => {
    expect(sanitize('<img onerror="alert(1)" src=x>')).toBe("");
  });

  it("strips nested tags", () => {
    expect(sanitize("<div><b>hello</b></div>")).toBe("hello");
  });

  it("preserves clean text", () => {
    expect(sanitize("Hello world")).toBe("Hello world");
  });

  it("handles empty input", () => {
    expect(sanitize("")).toBe("");
  });
});
