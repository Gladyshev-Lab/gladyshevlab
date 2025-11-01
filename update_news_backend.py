#!/usr/bin/env python3
"""
Backend скрипт для генерации news.json из markdown файлов
Запуск: python update_news_backend.py
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
import markdown

# CONFIGURATION
NEWS_DIR = "frontend/public/data/news"  # Директория с markdown файлами новостей
OUTPUT_JSON = "frontend/public/news.json"  # Выходной JSON файл

def parse_news_filename(filename):
    """
    Извлечь дату из имени файла
    Форматы: MM-DD-YY.md или YYYY-MM-DD.md
    """
    basename = filename.replace('.md', '')
    
    # Try MM-DD-YY format
    match = re.match(r'(\d{1,2})-(\d{1,2})-(\d{2,4})', basename)
    if match:
        month, day, year = match.groups()
        month, day = int(month), int(day)
        year = int(year)
        
        # Convert 2-digit year to 4-digit
        if year < 100:
            year = 2000 + year
        
        try:
            date_obj = datetime(year, month, day)
            return date_obj, year
        except ValueError:
            return None, None
    
    # Try YYYY-MM-DD format
    match = re.match(r'(\d{4})-(\d{1,2})-(\d{1,2})', basename)
    if match:
        year, month, day = match.groups()
        year, month, day = int(year), int(month), int(day)
        
        try:
            date_obj = datetime(year, month, day)
            return date_obj, year
        except ValueError:
            return None, None
    
    return None, None

def extract_title_from_markdown(content):
    """Извлечь заголовок из markdown (первая строка с #)"""
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('#'):
            # Remove # symbols and whitespace
            title = re.sub(r'^#+\s*', '', line)
            return title.strip()
    return None

def read_markdown_file(filepath):
    """Прочитать и конвертировать markdown в HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Extract title before converting
        title = extract_title_from_markdown(md_content)
        
        # Convert to HTML
        html_content = markdown.markdown(md_content, extensions=['extra', 'nl2br'])
        
        # Remove title from html_content
        html_content = html_content.replace(f'<h1>{title}</h1>', '')
        
        return html_content, title
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None, None

def find_image(news_dir, basename):
    """Найти изображение для новости"""
    extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    for ext in extensions:
        img_path = os.path.join(news_dir, basename + ext)
        if os.path.exists(img_path):
            return f"/data/news/{basename}{ext}"
    
    return None

def generate_news_json():
    """Генерировать news.json из markdown файлов"""
    print(f"\n{'='*60}")
    print(f"Generating news.json from markdown files")
    print(f"{'='*60}\n")
    
    if not os.path.exists(NEWS_DIR):
        print(f"News directory not found: {NEWS_DIR}")
        print("Creating empty news.json...")
        
        empty_data = {
            'generated_at': datetime.now().isoformat(),
            'total_news': 0,
            'years': [],
            'news_by_year': {}
        }
        
        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(empty_data, f, ensure_ascii=False, indent=2)
        
        print(f"Empty news.json created: {OUTPUT_JSON}")
        return
    
    # Find all markdown files
    md_files = [f for f in os.listdir(NEWS_DIR) if f.endswith('.md')]
    print(f"Found {len(md_files)} markdown files")
    
    if len(md_files) == 0:
        print("No markdown files found. Creating empty news.json...")
        
        empty_data = {
            'generated_at': datetime.now().isoformat(),
            'total_news': 0,
            'years': [],
            'news_by_year': {}
        }
        
        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(empty_data, f, ensure_ascii=False, indent=2)
        
        print(f"Empty news.json created: {OUTPUT_JSON}")
        return
    
    # Process each file
    news_items = []
    
    for filename in md_files:
        print(f"Processing: {filename}")
        
        date_obj, year = parse_news_filename(filename)
        if not date_obj:
            print(f"  Warning: Could not parse date from {filename}, skipping")
            continue
        
        filepath = os.path.join(NEWS_DIR, filename)
        html_content, title = read_markdown_file(filepath)
        
        if html_content is None:
            print(f"  Warning: Could not read {filename}, skipping")
            continue
        
        basename = filename.replace('.md', '')
        image = find_image(NEWS_DIR, basename)
        
        news_item = {
            'date': date_obj.strftime('%Y-%m-%d'),
            'formatted_date': date_obj.strftime('%B %d, %Y'),
            'year': year,
            'content': html_content,
            'title': title
        }
        
        if image:
            news_item['image'] = image
            print(f"  Found image: {image}")
        
        news_items.append(news_item)
        print(f"  Added: {news_item['formatted_date']}")
    
    # Sort by date (newest first)
    news_items.sort(key=lambda x: x['date'], reverse=True)
    
    # Group by year
    news_by_year = {}
    years_set = set()
    
    for item in news_items:
        year = str(item['year'])
        years_set.add(item['year'])
        
        if year not in news_by_year:
            news_by_year[year] = []
        
        news_by_year[year].append(item)
    
    # Sort years (newest first)
    years = sorted(list(years_set), reverse=True)
    
    # Create output data
    output_data = {
        'generated_at': datetime.now().isoformat(),
        'total_news': len(news_items),
        'years': years,
        'news_by_year': news_by_year
    }
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    
    # Save JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"News JSON generated successfully!")
    print(f"{'='*60}")
    print(f"Total news items: {len(news_items)}")
    print(f"Years covered: {', '.join(map(str, years))}")
    print(f"Output file: {OUTPUT_JSON}")
    print()

def main():
    """Главная функция"""
    print("\n" + "="*70)
    print(" NEWS BACKEND UPDATE SCRIPT ")
    print("="*70)
    
    generate_news_json()
    
    print("\n" + "="*70)
    print(" UPDATE COMPLETE ")
    print("="*70)
    print(f"\nGenerated file:")
    print(f"  - {OUTPUT_JSON}")
    print(f"\nFrontend will automatically load data from {OUTPUT_JSON}")
    print()

if __name__ == "__main__":
    main()