'use client';

import { useEffect, useState } from "react";
import { getAllBlogPosts } from "@/lib/blog";

export default function RSSFeed() {
  const [rssXml, setRssXml] = useState<string>("");

  useEffect(() => {
    const generateRSS = async () => {
      try {
        // Fetch all published blog posts
        const posts = await getAllBlogPosts(true);

        // Escape XML special characters
        const escapeXml = (str: string) => {
          if (!str) return "";
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
        };

        // Generate RSS XML following RSS 2.0 specification
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Door 24 Blog</title>
    <link>https://door24.app/blog</link>
    <description>Community Recovery, Not Counting Recovery. Articles, insights, and updates from Door 24.</description>
    <language>en-US</language>
    <managingEditor>support@door24.app (Door 24)</managingEditor>
    <webMaster>support@door24.app (Door 24)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://door24.app/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://door24.app/assets/door-24-logo.png</url>
      <title>Door 24 Blog</title>
      <link>https://door24.app/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${posts
      .map((post) => {
        const pubDate = post.publishedAt
          ? post.publishedAt instanceof Date
            ? post.publishedAt.toUTCString()
            : new Date(
                (post.publishedAt as any).toMillis?.() ||
                  post.publishedAt.seconds * 1000
              ).toUTCString()
          : new Date().toUTCString();

        const postUrl = `https://door24.app/blog/${post.slug}`;
        const description = escapeXml(post.description || "");
        const content = post.content || "";

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      ${post.author ? `<author>support@door24.app (${escapeXml(post.author)})</author>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.tags && post.tags.length > 0
          ? post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")
          : ""}
      ${post.featuredImage
          ? `<enclosure url="${escapeXml(post.featuredImage)}" type="image/jpeg"/>`
          : ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

        setRssXml(xml);
      } catch (error) {
        console.error("Error generating RSS feed:", error);
        setRssXml(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Door 24 Blog</title>
    <description>Error loading feed</description>
  </channel>
</rss>`);
      }
    };

    generateRSS();
  }, []);

  // Output XML content - RSS readers will parse this
  if (!rssXml) {
    return <div>Loading RSS feed...</div>;
  }

  // Render XML directly - browsers and RSS readers will parse this
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        margin: 0,
        padding: "1rem",
        fontSize: "12px",
        backgroundColor: "#0b1020",
        color: "#f7f9fc",
      }}
      dangerouslySetInnerHTML={{ __html: rssXml }}
    />
  );
}

