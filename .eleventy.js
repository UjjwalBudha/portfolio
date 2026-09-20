import { readFileSync } from "node:fs";

const legacyBlogs = JSON.parse(
  readFileSync(new URL("./_data/legacyBlogs.json", import.meta.url))
);

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

// Normalizes heroImage into something usable directly as an <img src> from
// the homepage. heroImage can be: a full external URL (CMS's "Insert from
// URL" option - used as-is), the CMS upload path ("/blogs/src/<slug>/file",
// per admin/config.yml's public_folder), or the convention used when
// hand-writing front matter ("src/<slug>/file", relative to blogs/).
function normalizeHeroImage(heroImage) {
  if (isAbsoluteUrl(heroImage)) return heroImage;
  const stripped = heroImage.replace(/^\//, "");
  return stripped.startsWith("blogs/") ? stripped : `blogs/${stripped}`;
}

export default function (eleventyConfig) {
  eleventyConfig.addFilter("isoDate", (date) => {
    const d = new Date(date);
    return `${d.toISOString().slice(0, 10)}T00:00:00+05:45`;
  });

  eleventyConfig.addFilter("shortDate", (date) => new Date(date).toISOString().slice(0, 10));

  // Vercel serves cleanUrls (vercel.json), so URLs we generate ourselves
  // (hrefs, canonical/OG tags, sitemap) should point straight at the
  // extension-less form rather than relying on the .html -> clean redirect.
  eleventyConfig.addFilter("cleanUrl", (url) => url.replace(/\.html$/, ""));

  // og:image/twitter:image/JSON-LD image need a fully-qualified absolute
  // URL. An external heroImage URL already is one; a repo-relative one
  // needs the site domain prefixed.
  eleventyConfig.addFilter("heroImageUrl", (heroImage, siteUrl) =>
    isAbsoluteUrl(heroImage) ? heroImage : `${siteUrl}/${normalizeHeroImage(heroImage)}`
  );

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("blogs/src");
  eleventyConfig.addPassthroughCopy("blogs/*.html");
  eleventyConfig.addPassthroughCopy("forms");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");
  eleventyConfig.addPassthroughCopy("cf-test.html");
  eleventyConfig.addPassthroughCopy("cf-test.js");
  eleventyConfig.addPassthroughCopy("portfolio-details.html");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    const legacy = legacyBlogs.map((post) => ({
      ...post,
      date: new Date(post.date),
    }));

    const generated = collectionApi.getFilteredByTag("blogPost").map((item) => ({
      href: item.url.replace(/^\//, "").replace(/\.html$/, ""),
      thumbnail: normalizeHeroImage(item.data.heroImage),
      alt: item.data.heroAlt || item.data.title,
      title: item.data.title,
      date: item.date,
      dateDisplay: item.data.dateDisplay,
      excerpt: item.data.excerpt,
    }));

    return [...legacy, ...generated].sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    // Blog bodies contain literal {{ }} in code samples (Ansible/Jinja vault
    // variables etc.) — disabling Nunjucks preprocessing for markdown avoids
    // those being mistaken for template variables. Layouts (.njk) still run
    // through Nunjucks normally.
    markdownTemplateEngine: false,
  };
}
