---
layout: layouts/blog.njk
permalink: "blogs/eleventy-pipeline-test.html"
tags: ["blogPost"]
title: "Eleventy Pipeline Test Post (delete before merging)"
description: "A throwaway post used to validate the new Eleventy blog pipeline end to end — front matter, FAQ, related posts, HowTo, and code samples with literal curly braces."
keywords: ["Eleventy", "Test", "Pipeline", "Static Site", "Markdown"]
date: 2026-09-21
dateDisplay: "21st September 2026"
articleSection: "DevOps"
articleTags: ["Eleventy", "Testing"]
heroImage: "src/eleventy-pipeline-test/thumbnail.png"
heroAlt: "Eleventy pipeline test post thumbnail"
excerpt: "A test post that exercises the whole Eleventy pipeline: front matter, FAQ, related posts, a HowTo, and literal template-looking syntax in a code block..."
howTo:
  totalTime: "PT5M"
  steps:
    - name: "Create the Markdown file"
      text: "Add content/blogs/<slug>.md with front matter"
    - name: "Write the body"
      text: "Markdown or raw HTML, both are supported"
    - name: "Push"
      text: "Vercel builds it automatically via Eleventy"
faq:
  - q: "Does this post really need to exist?"
    a: "No — it's a throwaway used to confirm the pipeline works end to end (new file, FAQ, related posts, HowTo, homepage grid, sitemap, clean URLs). Delete content/blogs/eleventy-pipeline-test.md and blogs/src/eleventy-pipeline-test/ before merging this branch anywhere near production."
  - q: "Why does this post test a Helm-style variable?"
    a: "To confirm literal {{ }} syntax in a code sample survives untouched, since markdownTemplateEngine is disabled specifically to avoid Nunjucks trying to evaluate it as a template variable."
  - q: "Does the homepage grid pick this up automatically?"
    a: "Yes — it's tagged blogPost, so Eleventy's blogPosts collection includes it, sorted by date like every other post, with no index.html edits."
  - q: "Does the sitemap pick it up too?"
    a: "Yes, sitemap.njk iterates the same collection, so this post gets its own <url> entry automatically."
relatedPosts:
  - href: "headscale-mesh-vpn-aws"
    title: "How to Setup Headscale VPN on AWS"
    excerpt: "The first real post migrated into this same pipeline, worth comparing against for a front-matter example."
  - href: "ec2-configuration"
    title: "EC2 Instance Setup AWS"
    excerpt: "One of the 12 legacy static posts, untouched by this pipeline."
---
<section>
    <h2>Why This Post Exists</h2>
    <p>
        This is a throwaway post created purely to validate the new Eleventy blog pipeline end to end before it's used for anything real. It isn't meant to be published — delete it before merging this branch anywhere near production.
    </p>
</section>
<section>
    <h2>What It Exercises</h2>
    <ul>
        <li>A brand-new <code>content/blogs/*.md</code> file picked up automatically by the <code>blogPost</code>-tagged collection</li>
        <li>The homepage blog grid updating with zero <code>index.html</code> edits</li>
        <li><code>sitemap.xml</code> gaining a new entry automatically</li>
        <li>Clean, extension-less URLs end to end (this page, its related-post links, its canonical tag)</li>
        <li>FAQ and HowTo JSON-LD generated from front matter</li>
    </ul>
</section>
<section>
    <h2>A Code Sample With Literal Template Syntax</h2>
    <p>
        This is the exact kind of line that would break if Markdown files were run through Nunjucks:
    </p>
    <pre><code>image:
  repository: myapp
  tag: "{{ .Values.image.tag }}"</code></pre>
    <p>
        If you can read <code>{{ .Values.image.tag }}</code> above as literal text instead of a build error, the pipeline is handling this correctly.
    </p>
</section>
