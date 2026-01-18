#!/usr/bin/env python3
"""
Update all blog HTML files to use WebP images with PNG fallback.
This script finds all <img> tags in blog HTML files and replaces them
with <picture> elements that use WebP with PNG fallback.
"""

import re
from pathlib import Path
import sys

def update_img_to_picture(html_content, blog_file_path):
    """
    Replace <img> tags with <picture> elements for WebP support.
    
    Pattern: <img src="path/to/image.png" alt="...">
    Replace with:
    <picture>
        <source srcset="path/to/image.webp" type="image/webp">
        <img src="path/to/image.png" alt="..." loading="lazy">
    </picture>
    """
    
    # Find all img tags that reference PNG files in src/blog directories
    # Pattern matches: <img src="src/blogN/filename.png" alt="...">
    img_pattern = r'<img\s+src="(src/blog\d+/[^"]+\.png)"\s+alt="([^"]*)"([^>]*)>'
    
    def replace_with_picture(match):
        png_path = match.group(1)
        alt_text = match.group(2)
        other_attrs = match.group(3).strip()
        
        # Generate WebP path
        webp_path = png_path.replace('.png', '.webp')
        
        # Check if loading="lazy" already exists
        if 'loading=' not in other_attrs:
            loading_attr = ' loading="lazy"'
        else:
            loading_attr = ''
        
        # Build picture element
        picture_html = f'''<picture>
                    <source srcset="{webp_path}" type="image/webp">
                    <img src="{png_path}" alt="{alt_text}"{loading_attr}{other_attrs}>
                </picture>'''
        
        return picture_html
    
    # Replace all matching img tags
    updated_content, count = re.subn(img_pattern, replace_with_picture, html_content)
    
    return updated_content, count

def process_blog_file(blog_path):
    """Process a single blog HTML file."""
    try:
        # Read file
        with open(blog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update img tags
        updated_content, replacements = update_img_to_picture(content, blog_path)
        
        if replacements == 0:
            print(f"⊘ {blog_path.name}: No PNG images to update")
            return False
        
        # Write updated content
        with open(blog_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✓ {blog_path.name}: Updated {replacements} image(s) to use WebP")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {blog_path.name}: {e}")
        return False

def main():
    """Find and process all blog HTML files."""
    blogs_dir = Path('blogs')
    
    if not blogs_dir.exists():
        print(f"Error: {blogs_dir} directory not found")
        print("Please run this script from the portfolio root directory")
        return 1
    
    # Find all HTML files in blogs directory (excluding subdirectories)
    blog_files = list(blogs_dir.glob('*.html'))
    
    if not blog_files:
        print("No blog HTML files found")
        return 1
    
    print(f"Found {len(blog_files)} blog file(s) to process\n")
    
    updated = 0
    skipped = 0
    failed = 0
    
    for blog_file in sorted(blog_files):
        result = process_blog_file(blog_file)
        if result:
            updated += 1
        elif result is False:
            failed += 1
        else:
            skipped += 1
    
    print(f"\n{'='*60}")
    print(f"Processing complete!")
    print(f"Updated: {updated} file(s)")
    print(f"Skipped: {skipped} file(s)")
    if failed > 0:
        print(f"Failed: {failed} file(s)")
    print(f"{'='*60}")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
