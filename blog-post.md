# Writing a Blog Post Locally

This is the local-machine version of the workflow — for when you're at your dev machine and want to write/preview a post before pushing, instead of using the live `/admin` CMS. See `BLOG_STANDARDS.md` for the full field-by-field SEO requirements; this file is just the mechanics of doing it locally.

## Steps

1. **Create the post file**: `content/blogs/<your-slug>.md`. Copy `content/blogs/headscale-mesh-vpn-aws.md` as a starting template — it has every front-matter field filled in with real values you can adapt.

2. **Fill in the front matter** at minimum:
   ```yaml
   ---
   layout: layouts/blog.njk
   permalink: "blogs/<your-slug>.html"
   tags: ["blogPost"]
   title: "Your Post Title"
   description: "150-160 character meta description"
   keywords: ["keyword1", "keyword2"]
   date: 2026-09-21
   dateDisplay: "21st September 2026"
   articleSection: "DevOps"
   articleTags: ["Tag1", "Tag2"]
   heroImage: "src/<your-slug>/thumbnail.png"   # or a full https:// URL
   heroAlt: "Descriptive alt text"
   excerpt: "One or two sentences for the homepage card"
   faq:
     - q: "A question?"
       a: "The answer."
     # 4-8 required
   relatedPosts:
     - href: "some-other-post"       # slug only, no .html
       title: "That Post's Title"
       excerpt: "Brief description."
     # 2-4 required
   ---
   Your post body goes here — Markdown or raw HTML both work.
   ```
   `howTo` is optional, only for tutorial-style posts with discrete numbered steps.

3. **Add images** to `blogs/src/<your-slug>/` (matching the `heroImage` path above), or just use a full `https://` URL directly in `heroImage`/inline `<img>` tags instead — both work.

4. **Preview it**:
   ```bash
   npx @11ty/eleventy --serve
   ```
   This builds the whole site into `_site/` and serves it with live-reload at the URL it prints (e.g. `http://localhost:8081`). Check:
   - `/blogs/<your-slug>.html` — the post itself
   - `/` — your post's card appears in the homepage grid, sorted by date
   - `/sitemap.xml` — your post has an entry

5. **Commit and push.** Vercel builds it the same way automatically — nothing else to do.

## Gotcha

If your post body contains literal `{{ }}` (Jinja/Ansible/Helm variable syntax in a code sample), leave it as-is — Markdown files aren't run through the Nunjucks template engine in this pipeline, so it won't be mistaken for a template variable.
