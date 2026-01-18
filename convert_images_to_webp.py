#!/usr/bin/env python3
"""
Convert all PNG images in the blogs/src directory to WebP format
for improved page load performance and SEO.
"""

import os
from pathlib import Path
from PIL import Image

def convert_to_webp(image_path, quality=85):
    """Convert a PNG image to WebP format."""
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Create WebP filename
        webp_path = image_path.with_suffix('.webp')
        
        # Convert and save as WebP
        img.save(webp_path, 'WEBP', quality=quality)
        
        # Get file sizes
        original_size = os.path.getsize(image_path)
        webp_size = os.path.getsize(webp_path)
        savings = ((original_size - webp_size) / original_size) * 100
        
        print(f"✓ Converted: {image_path.name}")
        print(f"  Original: {original_size / 1024:.1f} KB → WebP: {webp_size / 1024:.1f} KB ({savings:.1f}% smaller)")
        
        return True
    except Exception as e:
        print(f"✗ Error converting {image_path.name}: {e}")
        return False

def main():
    """Find and convert all PNG images in blogs/src directory."""
    blogs_src_dir = Path('blogs/src')
    
    if not blogs_src_dir.exists():
        print(f"Error: Directory {blogs_src_dir} not found")
        return
    
    # Find all PNG files
    png_files = list(blogs_src_dir.rglob('*.png'))
    
    if not png_files:
        print("No PNG files found to convert")
        return
    
    print(f"Found {len(png_files)} PNG images to convert\n")
    
    converted = 0
    failed = 0
    
    for png_file in png_files:
        # Skip if WebP already exists and is newer
        webp_file = png_file.with_suffix('.webp')
        if webp_file.exists() and webp_file.stat().st_mtime > png_file.stat().st_mtime:
            print(f"⊘ Skipped: {png_file.name} (WebP already exists)")
            continue
        
        if convert_to_webp(png_file):
            converted += 1
        else:
            failed += 1
    
    print(f"\n{'='*60}")
    print(f"Conversion complete!")
    print(f"Converted: {converted} images")
    if failed > 0:
        print(f"Failed: {failed} images")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
