import { readFileSync } from "node:fs";

const legacyBlogs = JSON.parse(
  readFileSync(new URL("./_data/legacyBlogs.json", import.meta.url))
);

export default function (eleventyConfig) {
  eleventyConfig.addFilter("isoDate", (date) => {
    const d = new Date(date);
    return `${d.toISOString().slice(0, 10)}T00:00:00+05:45`;
  });

  eleventyConfig.addFilter("shortDate", (date) => new Date(date).toISOString().slice(0, 10));

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("blogs/src");
  eleventyConfig.addPassthroughCopy("blogs/*.html");
  eleventyConfig.addPassthroughCopy("forms");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("404.html");
  eleventyConfig.addPassthroughCopy("cf-test.html");
  eleventyConfig.addPassthroughCopy("cf-test.js");
  eleventyConfig.addPassthroughCopy("portfolio-details.html");

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    const legacy = legacyBlogs.map((post) => ({
      ...post,
      date: new Date(post.date),
    }));

    const generated = collectionApi.getFilteredByTag("blogPost").map((item) => ({
      href: item.url.replace(/^\//, ""),
      thumbnail: `blogs/${item.data.heroImage}`,
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
