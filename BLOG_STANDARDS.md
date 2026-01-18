# Blog Writing Standards & SEO Guidelines

> **CRITICAL**: This document MUST be read before creating ANY new blog post. All standards are mandatory.

---

## Table of Contents

1. [Technical SEO Requirements](#technical-seo-requirements)
2. [File Structure & Naming](#file-structure--naming)
3. [HTML Structure Template](#html-structure-template)
4. [Meta Tags (Required)](#meta-tags-required)
5. [Structured Data (JSON-LD)](#structured-data-json-ld)
6. [Content Structure](#content-structure)
7. [Semantic SEO & Keywords](#semantic-seo--keywords)
8. [FAQ Section (Required)](#faq-section-required)
9. [Related Posts Section (Required)](#related-posts-section-required)
10. [Images & Media](#images--media)
11. [Internal & External Links](#internal--external-links)
12. [Performance Requirements](#performance-requirements)
13. [Security Requirements](#security-requirements)
14. [Pre-Publication Checklist](#pre-publication-checklist)

---

## Technical SEO Requirements

### Must Have (Non-Negotiable)

- ✅ **Unique `<title>` tag** (50-60 characters optimal)
- ✅ **Meta description** (150-160 characters optimal)
- ✅ **Canonical URL** pointing to the blog's own URL
- ✅ **robots meta tag** set to `index, follow`
- ✅ **Author meta tag** with "Ujwal Budha"
- ✅ **Open Graph tags** (Facebook/LinkedIn)
- ✅ **Twitter Card tags**
- ✅ **JSON-LD structured data** (BlogPosting, HowTo, and/or FAQPage)
- ✅ **Responsive viewport** meta tag
- ✅ **Google Analytics** tracking code
- ✅ **Character encoding** UTF-8

---

## File Structure & Naming

### Blog File Location
```
/home/ujwal/self/portfolio/blogs/[blog-slug].html
```

### Blog Assets Location
```
/home/ujwal/self/portfolio/blogs/src/blog[N]/
```

Where `[N]` is the blog number (e.g., blog11, blog12, etc.)

### Naming Conventions

**Blog HTML File:**
- Use lowercase
- Use hyphens (not underscores)
- Be descriptive
- Example: `implementing-seo-best-practices.html`

**Image Files:**
- Use descriptive names (not "image1.png")
- Use hyphens for spaces
- Include context: `bedrock-finetuning.png`, `google-search-console.png`
- Must have `thumbnail.png` (or .webp) for blog card

**Image Formats:**
- ✅ MUST provide WebP versions for all images
- ✅ Keep PNG as fallback
- ✅ Use responsive images with `<picture>` element where appropriate

---

## HTML Structure Template

Every blog post MUST follow this structure:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- REQUIRED: Character encoding and viewport -->
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    
    <!-- REQUIRED: Title (50-60 chars) -->
    <title>[Your Blog Title - Keyword Rich]</title>
    
    <!-- REQUIRED: Meta description (150-160 chars) -->
    <meta content="[Compelling description with target keywords]" name="description">
    
    <!-- REQUIRED: Keywords (5-10 most relevant keywords) -->
    <meta content="Keyword1, Keyword2, Keyword3, ..." name="keywords">
    
    <!-- REQUIRED: Author and robots -->
    <meta name="author" content="Ujwal Budha">
    <meta name="robots" content="index, follow">
    
    <!-- REQUIRED: Canonical URL -->
    <link rel="canonical" href="https://ujwalbudha.com.np/blogs/[blog-slug].html">
    
    <!-- REQUIRED: Open Graph tags -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://ujwalbudha.com.np/blogs/[blog-slug].html">
    <meta property="og:title" content="[Blog Title]">
    <meta property="og:description" content="[Meta description]">
    <meta property="og:image" content="https://ujwalbudha.com.np/blogs/src/blog[N]/thumbnail.png">
    <meta property="og:site_name" content="Ujwal Budha Portfolio">
    <meta property="article:published_time" content="YYYY-MM-DDTHH:mm:ss+05:45">
    <meta property="article:modified_time" content="YYYY-MM-DDTHH:mm:ss+05:45">
    <meta property="article:author" content="Ujwal Budha">
    <meta property="article:section" content="[Category: AWS/DevOps/SEO/etc]">
    <meta property="article:tag" content="[Tag1]">
    <meta property="article:tag" content="[Tag2]">
    
    <!-- REQUIRED: Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://ujwalbudha.com.np/blogs/[blog-slug].html">
    <meta name="twitter:title" content="[Blog Title]">
    <meta name="twitter:description" content="[Shorter description]">
    <meta name="twitter:image" content="https://ujwalbudha.com.np/blogs/src/blog[N]/thumbnail.png">
    <meta name="twitter:creator" content="@ujjwal_budha">
    
    <!-- Stylesheets -->
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    
    <!-- REQUIRED: Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CQNVWBVCCD"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-CQNVWBVCCD');
    </script>
    
    <!-- REQUIRED: JSON-LD Structured Data (see section below) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      // ... see Structured Data section
    }
    </script>
    
    <!-- Shared Navigation Bar -->
    <script src="../assets/js/navbar.js"></script>
    
    <!-- REQUIRED: Custom styles (see below) -->
    <style>
        /* Blog-specific styles */
    </style>
</head>

<body>
    <!-- Blog Header -->
    <header>
        <div class="banner">
            <div class="content">
                <h1>[Blog Title]</h1>
                <p class="blog-date">[Day] [Month] [Year]</p>
            </div>
        </div>
    </header>
    
    <!-- Main Content -->
    <main>
        <!-- Introduction Section -->
        <section>
            <h2>Introduction</h2>
            <p>[Engaging introduction with semantic keywords]</p>
        </section>
        
        <!-- Content Sections -->
        <section>
            <h2>[Main Topic]</h2>
            <!-- Content -->
        </section>
        
        <!-- REQUIRED: FAQ Section -->
        <section>
            <h2>Frequently Asked Questions (FAQ)</h2>
            <!-- See FAQ section below -->
        </section>
        
        <!-- Conclusion -->
        <section>
            <h2>Conclusion</h2>
            <!-- Summary and key takeaways -->
        </section>
        
        <!-- REQUIRED: Related Posts Section -->
        <section class="related-posts">
            <!-- See Related Posts section below -->
        </section>
        
        <!-- REQUIRED: Author Section -->
        <section class="author-section">
            <h3>Written By</h3>
            <p class="author-name">Ujwal Budha</p>
            <p class="author-date">Published: [Date]</p>
            <p class="author-bio">
                Hello, I am Ujwal Budha. Currently working as a Jr. Cloud Engineer at Adex International Pvt. Ltd.
                Expert in creating scalable cloud infrastructure and automating the workflow for deployment. An AWS
                Certified Solution Architect Associate, Ujwal enjoys sharing knowledge in the form of technical blogs
                and helping others to go through their cloud journey.
            </p>
        </section>
    </main>
    
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>
```

---

## Meta Tags (Required)

### Title Tag Rules
- **Length**: 50-60 characters (Google truncates after ~60)
- **Format**: `[Main Topic] | [Benefit/Context]`
- **Include**: Primary keyword near the beginning
- **Example**: `Blog SEO Guide: Rank on Google's First Page in 2026`

### Meta Description Rules
- **Length**: 150-160 characters
- **Include**: Primary and 1-2 secondary keywords naturally
- **Call-to-action**: Encourage clicking
- **Unique**: Every blog must have unique description
- **Example**: `Master blog SEO with this comprehensive guide. Learn proven strategies to rank on Google's first page using technical SEO, meta tags, sitemaps, structured data, and automation.`

### Keywords Meta Tag
- **Count**: 5-10 keywords
- **Include**: Primary keyword, semantic variations, related terms
- **Format**: Comma-separated
- **Example**: `SEO, Technical SEO, Blog SEO, Google Search Console, Sitemap, Structured Data, Meta Tags`

---

## Structured Data (JSON-LD)

### REQUIRED: BlogPosting Schema

Every blog MUST include:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Blog Title - same as <title>]",
  "description": "[Meta description]",
  "image": "https://ujwalbudha.com.np/blogs/src/blog[N]/thumbnail.png",
  "datePublished": "YYYY-MM-DDTHH:mm:ss+05:45",
  "dateModified": "YYYY-MM-DDTHH:mm:ss+05:45",
  "author": {
    "@type": "Person",
    "name": "Ujwal Budha",
    "url": "https://ujwalbudha.com.np",
    "jobTitle": "DevOps Engineer"
  },
  "publisher": {
    "@type": "Person",
    "name": "Ujwal Budha",
    "url": "https://ujwalbudha.com.np"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ujwalbudha.com.np/blogs/[blog-slug].html"
  },
  "keywords": ["Keyword1", "Keyword2", "Keyword3"],
  "articleSection": "[Category]",
  "inLanguage": "en-US"
}
</script>
```

### OPTIONAL BUT RECOMMENDED: HowTo Schema

For tutorial/guide-style content:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [Do Something]",
  "description": "[Brief description]",
  "totalTime": "PT2H",
  "step": [
    {
      "@type": "HowToStep",
      "name": "[Step Name]",
      "text": "[Step description]"
    }
    // Include all major steps
  ]
}
</script>
```

### REQUIRED: FAQPage Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text exactly as in FAQ section]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text - can be condensed]"
      }
    }
    // Include all FAQ items
  ]
}
</script>
```

---

## Content Structure

### Heading Hierarchy

**MUST follow proper hierarchy:**

```
<h1> - Blog title (only ONE per page, in header)
<h2> - Main sections (Introduction, Step 1, FAQ, Conclusion, etc.)
<h3> - Subsections within main sections
<h4> - Minor subsections (rarely needed)
```

**Heading Best Practices:**
- Include keywords naturally in headings
- Use semantic variations (e.g., "Understanding Blog SEO" instead of just "SEO")
- Make headings descriptive and scannable
- Keep H2 tags under 10 per page if possible

### Content Sections (Standard Order)

1. **Introduction** (required)
   - Hook the reader
   - State the problem/topic
   - Include primary and secondary keywords
   - Preview what they'll learn

2. **Main Content** (required)
   - Use clear H2/H3 structure
   - Include code examples where relevant
   - Use bullet points and lists for scannability
   - Include images/diagrams with captions

3. **FAQ Section** (required)
   - Minimum 4 questions
   - Maximum 8 questions
   - Target common search queries
   - Give concise, actionable answers

4. **Conclusion** (required)
   - Summarize key takeaways
   - Reinforce main concepts
   - Optional: Call-to-action or next steps

5. **Related Posts** (required)
   - 2-4 related blog posts
   - Contextual descriptions
   - Build topical clusters

6. **Author Section** (required)
   - Standard bio (see template above)

---

## Semantic SEO & Keywords

### Keyword Research (Before Writing)

1. **Identify primary keyword** (e.g., "blog SEO")
2. **Find 5-10 semantic variations:**
   - "how to improve blog SEO"
   - "blog optimization"
   - "SEO for bloggers"
   - "rank blog on Google"
   - etc.

3. **Target question-based searches:**
   - "How long does blog SEO take?"
   - "What is the best SEO practice?"
   - etc.

### Keyword Placement (Natural Integration)

✅ **Primary keyword MUST appear in:**
- Title tag
- Meta description
- First paragraph
- At least one H2 heading
- Image alt text (where relevant)
- Conclusion

✅ **Semantic variations MUST appear throughout:**
- Introduction (2-3 variations)
- Body content (naturally integrated)
- FAQ questions and answers
- Related posts descriptions

❌ **AVOID:**
- Keyword stuffing
- Unnatural repetition
- Exact match keyword cramming
- Sacrificing readability for keywords

### Keyword Density
- **Primary keyword**: 1-2% of total content
- **Semantic cluster**: 3-5% combined
- **Focus**: Natural, readable content first

---

## FAQ Section (Required)

### Requirements

- **Minimum**: 4 questions
- **Maximum**: 8 questions
- **Target**: Real search queries people use

### FAQ Format

```html
<section>
    <h2>Frequently Asked Questions (FAQ)</h2>
    
    <h3>[Question 1 - exact phrasing users search]?</h3>
    <p>
        [Concise, actionable answer. 2-4 sentences. Include relevant keywords naturally.]
    </p>
    
    <h3>[Question 2]?</h3>
    <p>
        [Answer]
    </p>
    
    <!-- Repeat for 4-8 questions -->
</section>
```

### FAQ Question Types

1. **How long...?** (Timeline questions)
2. **What is...?** (Definition questions)
3. **How do I...?** (Action questions)
4. **Do I need...?** (Requirement questions)
5. **What are the best...?** (Recommendation questions)

### FAQ Best Practices

✅ Use exact questions people search for
✅ Answer concisely (50-150 words per answer)
✅ Include keywords naturally
✅ Link to related sections when relevant
✅ Match FAQ schema in JSON-LD exactly

---

## Related Posts Section (Required)

### Purpose
- Build internal linking structure
- Establish topical authority
- Keep users on site longer
- Improve crawlability

### Format

```html
<section class="related-posts" style="max-width: 800px; margin: 40px auto; padding: 30px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
    <h2 style="font-size: 28px; font-weight: 600; color: #18d26e; margin-bottom: 20px;">Related Articles</h2>
    <div style="display: grid; gap: 20px;">
        <a href="[related-blog-1].html" style="display: block; padding: 20px; background: rgba(255, 255, 255, 0.08); border-radius: 5px; border-left: 3px solid #18d26e; text-decoration: none; transition: all 0.3s ease;">
            <h4 style="font-size: 18px; color: #18d26e; margin-bottom: 8px;">[Related Blog Title]</h4>
            <p style="font-size: 14px; color: #ccc; margin: 0;">[Brief description with keywords]</p>
        </a>
        
        <!-- Repeat for 2-4 related posts -->
    </div>
</section>
```

### Selection Criteria

**Choose related posts based on:**
1. Same topic category (AWS, DevOps, SEO, etc.)
2. Complementary content
3. Natural progression (beginner → advanced)
4. Keyword overlap

**Example Topical Clusters:**
- **AWS Cluster**: CloudFront, EC2, Security, API Gateway
- **SEO Cluster**: Blog SEO, Content optimization, Analytics
- **DevOps Cluster**: Ansible, Git, CI/CD, Infrastructure

---

## Images & Media


> [!IMPORTANT]
> **CRITICAL IMAGE WORKFLOW**: All images MUST be converted to WebP format **BEFORE** being referenced in your HTML. Do NOT upload PNG images and reference them directly without creating WebP versions first.

### Image Workflow (MANDATORY)

**Step 1: Add PNG images to blog folder**
- Place all images in `blogs/src/blog[N]/` directory
- Use descriptive file names

**Step 2: Convert to WebP**
```bash
# From portfolio root directory, run:
python3 convert_images_to_webp.py
```
This will automatically create `.webp` versions of all PNG images.

**Step 3: Reference in HTML**
Only after conversion, reference images using the `<picture>` element:
```html
<picture>
  <source srcset="src/blog[N]/filename.webp" type="image/webp">
  <img src="src/blog[N]/filename.png" alt="Description" loading="lazy">
</picture>
```

❌ **WRONG WORKFLOW:**
1. Add PNG to folder → 2. Reference in HTML immediately → 3. Never convert to WebP

✅ **CORRECT WORKFLOW:**
1. Add PNG to `blogs/src/blog[N]/` → 2. Run conversion script → 3. Reference with `<picture>` element
### Image Requirements

✅ **MUST:**
- Provide WebP version for all images
- Include descriptive `alt` text with keywords
- Use descriptive file names (not "image1.png")
- Optimize file size (< 200 KB per image ideal)
- Include `loading="lazy"` for images below the fold

✅ **Image Format Pattern:**
```html
<picture>
  <source srcset="src/blog[N]/[descriptive-name].webp" type="image/webp">
  <img src="src/blog[N]/[descriptive-name].png" 
       alt="[Descriptive alt text with keywords]" 
       loading="lazy">
</picture>
```

### Thumbnail Requirements

Every blog MUST have:
- **File**: `src/blog[N]/thumbnail.png` AND `thumbnail.webp`
- **Size**: 1200x630px (Open Graph recommended)
- **Content**: Visually represent the blog topic
- **Text**: Blog title or key visual

### Image Captions

```html
<div class="image-container">
    <img src="src/blog[N]/example.png" alt="[Description]">
    <span class="image-caption">Fig: [Caption text]</span>
</div>
```

---

## Internal & External Links

### Internal Links

✅ **MUST include:**
- At least 2-3 internal links to related blog posts
- Contextual anchor text (use keywords)
- Links in Related Posts section

✅ **Best Practices:**
```html
<p>
    When implementing security, you should also 
    <a href="securing-aws-infrastructure.html">secure your AWS infrastructure</a>
    to prevent unauthorized access.
</p>
```

### External Links

✅ **Security requirement (MANDATORY):**
```html
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    External Link
</a>
```

❌ **NEVER:**
```html
<!-- Missing security attributes -->
<a href="https://external-site.com" target="_blank">Bad</a>
```

### Link Best Practices

- Use descriptive anchor text
- Avoid "click here" or generic text
- Open external links in new tab with security attributes
- Internal links can open in same tab
- Link to authoritative sources when citing information

---

## Performance Requirements

### Page Load Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

### Optimization Checklist

✅ Defer non-critical CSS/JS
✅ Inline critical CSS for above-the-fold content
✅ Use WebP images
✅ Implement lazy loading for images
✅ Minify CSS/JS if adding custom code
✅ Limit HTTP requests (< 20 ideal)

### Code Example: Deferred Loading

```html
<!-- Defer JavaScript -->
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js" defer></script>

<!-- Preload CSS -->
<link rel="preload" href="assets/css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="assets/css/style.css"></noscript>
```

---

## Security Requirements

### Required Security Measures

1. **External Links**: MUST have `rel="noopener noreferrer"`
2. **HTTPS**: All URLs must use HTTPS
3. **No Inline Events**: Avoid `onclick`, `onerror`, etc.
4. **CSP Compliance**: Follow Content Security Policy

### Example Security Implementation

```html
<!-- ✅ CORRECT -->
<a href="https://github.com/UjjwalBudha" target="_blank" rel="noopener noreferrer">
    GitHub
</a>

<!-- ❌ INCORRECT -->
<a href="https://github.com/UjjwalBudha" target="_blank">
    GitHub
</a>
```

---

## Pre-Publication Checklist

### Before Publishing, Verify:

#### SEO & Meta
- [ ] Unique, keyword-rich title (50-60 chars)
- [ ] Compelling meta description (150-160 chars)
- [ ] 5-10 relevant keywords in meta keywords tag
- [ ] Canonical URL correctly set
- [ ] All Open Graph tags present
- [ ] All Twitter Card tags present
- [ ] Author and robots meta tags set

#### Structured Data
- [ ] BlogPosting schema implemented
- [ ] HowTo schema (if applicable)
- [ ] FAQPage schema with all FAQ items
- [ ] All schema validated at schema.org validator
- [ ] Dates in correct format (ISO 8601)

#### Content
- [ ] Engaging introduction with keywords
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] No more than 10 H2 tags
- [ ] 4-8 FAQ questions included
- [ ] FAQ matches schema exactly
- [ ] Conclusion summarizes key points
- [ ] Author section included

#### Links
- [ ] 2-4 related posts linked
- [ ] Internal links use contextual anchors
- [ ] External links have rel="noopener noreferrer"
- [ ] All links tested and working

#### Images
- [ ] All images have WebP versions
- [ ] All images have descriptive alt text
- [ ] Thumbnail.png exists (1200x630px)
- [ ] Images use descriptive file names
- [ ] Lazy loading implemented
- [ ] Image file sizes optimized (< 200 KB)

#### Performance
- [ ] Google Analytics tracking code present
- [ ] CSS/JS deferred where possible
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive

#### Testing
- [ ] Test in Google Rich Results Test
- [ ] Test Open Graph with Facebook Debugger
- [ ] Test Twitter Card with Twitter Validator
- [ ] Test on mobile device
- [ ] Validate HTML (W3C Validator)
- [ ] Run through SEO checker tool

---

## Common Mistakes to Avoid

❌ **Don't:**
- Copy-paste meta tags from another blog without updating
- Use generic alt text like "image" or "screenshot"
- Forget to update dates in structured data
- Use `target="_blank"` without security attributes
- Skip the FAQ section
- Ignore mobile responsiveness
- Use PNG when WebP is available
- Keyword stuff
- Use too many H2 tags (> 10)
- Forget to add blog to sitemap.xml
- Use generic file names (image1.png)

✅ **Do:**
- Use unique, descriptive meta tags for each blog
- Write specific, keyword-rich alt text
- Keep dates current and accurate
- Always use `rel="noopener noreferrer"` with `target="_blank"`
- Include comprehensive FAQ section
- Test on mobile devices
- Always provide WebP images
- Write naturally with keywords
- Use semantic heading variations
- Update sitemap after publishing (automated via CI/CD)
- Use descriptive file names

---

## Updating sitemap.xml

After creating a new blog, the sitemap is **automatically updated** via GitHub Actions CI/CD pipeline. No manual action needed.

**Manual Update** (if needed):

Add new entry to `/home/ujwal/self/portfolio/sitemap.xml`:

```xml
<url>
    <loc>https://ujwalbudha.com.np/blogs/[new-blog-slug].html</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
</url>
```

---

## Adding Blog to Homepage

Update `/home/ujwal/self/portfolio/index.html` in the Blogs section:

```html
<!-- Blog Post [N] -->
<div class="col-lg-4 col-md-6">
    <a href="blogs/[blog-slug].html" class="blog-card-link">
        <div class="blog-card">
            <img src="blogs/src/blog[N]/thumbnail.png" alt="Blog [N]" class="img-fluid">
            <br><br>
            <h4>[Blog Title]</h4>
            <p class="blog-date">[Date]</p>
            <p>[Short teaser description...]</p>
        </div>
    </a>
</div>
```

---

## Example: Perfect Blog Post

See `implementing-seo-best-practices.html` as the **gold standard** reference implementation.

**What makes it perfect:**
- Complete meta tags with semantic keywords
- BlogPosting + HowTo + FAQPage schemas
- Comprehensive 6-question FAQ section
- Related Posts section with 3 links
- All external links have security attributes
- Semantic keyword variations throughout
- Proper heading hierarchy
- Images with descriptive names and alt text
- WebP versions of all images

---

## Questions?

If you encounter any scenario not covered in this guide, refer to:
1. `implementing-seo-best-practices.html` (reference implementation)
2. `/home/ujwal/.gemini/antigravity/brain/[conversation-id]/implementation_plan.md` (SEO strategy)
3. Google's SEO documentation
4. Schema.org documentation

---

## Version History

- **v1.0** (2026-01-18): Initial standards document created
  - Covers all SEO requirements
  - Includes semantic keyword optimization
  - Mandates FAQ and Related Posts sections
  - Requires WebP images
  - Security requirements for external links

---

## Final Note

**These standards exist to ensure:**
1. Consistent SEO performance across all blog posts
2. Ranking for related topics, not just exact title matches
3. Fast page load times and excellent UX
4. Rich snippets and featured snippet eligibility
5. Strong internal linking and topical authority
6. Professional, secure, accessible content

**Remember:** Quality over quantity. One excellent, well-optimized blog post is worth more than ten mediocre ones.

Happy writing! 🚀
