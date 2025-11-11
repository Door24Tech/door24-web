'use client';

import { useEffect } from "react";
import { getAllBlogPosts } from "@/lib/blog";

export default function RSSFeed() {
  useEffect(() => {
    generateAndDownloadRSS();
  }, []);

  const generateAndDownloadRSS = async () => {
    try {
      const posts = await getAllBlogPosts(true);

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Door 24 Blog</title>
    <link>https://door24.app/blog</link>
    <description>Insights, updates, and stories from Door 24.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://door24.app/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map((post) => {
        const pubDate = post.publishedAt
          ? new Date(
              post.publishedAt instanceof Date
                ? post.publishedAt.getTime()
                : (post.publishedAt as any).toMillis?.() || post.publishedAt.seconds * 1000
            ).toUTCString()
          : new Date().toUTCString();

        const content = post.content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

        return `
    <item>
      <title>${post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
      <link>https://door24.app/blog/${post.slug}</link>
      <description>${post.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">https://door24.app/blog/${post.slug}</guid>
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

      // Create blob and trigger download
      const blob = new Blob([rss], { type: "application/rss+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rss.xml";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--door24-muted)] mb-4">Generating RSS feed...</p>
        <p className="text-sm text-[var(--door24-muted)]">If download doesn't start, check your browser settings.</p>
      </div>
    </div>
  );
}

