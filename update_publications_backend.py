#!/usr/bin/env python3
"""
Backend скрипт для автоматического обновления публикаций
Запускать через cron: 0 2 * * * /usr/bin/python3 /path/to/update_publications_backend.py
"""

import os
import json
import pandas as pd
import numpy as np
from Bio import Entrez
import warnings
import re
from datetime import datetime
import plotly.graph_objects as go
from sentence_transformers import SentenceTransformer
import umap
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import nltk

warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)

# ==================== CONFIGURATION ====================
Entrez.email = "your.email@example.com"
AUTHOR_NAMES = ['"Gladyshev V"', '"Gladyshev Vadim"', '"Gladyshev VN"']
AUTHOR_NAMES_STRIPPED = ['Gladyshev V', 'Gladyshev Vadim', 'Gladyshev VN']
IMPACT_CSV = "journal_impact_factors_2023.csv"

# Paths (adjust for your server)
DATA_CSV = "all_publications.csv"
OUTPUT_JSON = "frontend/public/publications.json"  # JSON для frontend
OUTPUT_UMAP = "frontend/public/umap_visualization.html"  # UMAP визуализация

# UMAP settings
RNG_SEED = 42
MODEL_NAME = "intfloat/multilingual-e5-large"
N_CLUSTERS = 6
MAX_VOCAB = 10000
TOP_WORDS_FOR_LABEL = 3
TOP_WORDS_FOR_REPORT = 10

UMAP_3D_KW = dict(
    n_neighbors=15,
    min_dist=0.05,
    n_components=3,
    metric="cosine",
    random_state=RNG_SEED
)

KMEANS_KW = dict(
    n_clusters=N_CLUSTERS,
    n_init="auto",
    random_state=RNG_SEED
)

# Download stopwords if needed
try:
    stopwords.words("english")
except:
    nltk.download('stopwords')

# ==================== PUBMED FUNCTIONS ====================
def fetch_pubmed_articles(year: int):
    """Получить статьи из PubMed за год"""
    author_query = " OR ".join(AUTHOR_NAMES)
    date_range = f'"{year}/01/01"[PDAT] : "{year}/12/31"[PDAT]'
    query = f"({author_query}) AND {date_range}"
    
    handle = Entrez.esearch(db="pubmed", term=query, retmax=100)
    record = Entrez.read(handle)
    id_list = record["IdList"]
    
    if not id_list:
        return None
    
    handle = Entrez.efetch(db="pubmed", id=id_list, rettype="xml", retmode="xml")
    return Entrez.read(handle)

def parse_article(article):
    """Распарсить статью из XML"""
    try:
        journal = article['MedlineCitation']['Article']['Journal']['Title']
        if 'bioRxiv' in journal or 'biorxiv' in journal or 'medRxiv' in journal or 'medrxiv' in journal:
            return None
            
        pub_date = article['MedlineCitation']['Article']['Journal']['JournalIssue']['PubDate']
        date = pub_date.get('MedlineDate', f"{pub_date.get('Year', '')}-{pub_date.get('Month', '')}")
        
        doi = None
        pmid = None
        for article_id in article['PubmedData']['ArticleIdList']:
            if article_id.attributes.get('IdType') == 'doi':
                doi = str(article_id)
            elif article_id.attributes.get('IdType') == 'pubmed':
                pmid = str(article_id)
        
        return {
            'title': article['MedlineCitation']['Article']['ArticleTitle'],
            'journal': journal,
            'journal_lower': journal.lower(),
            'date': date,
            'authors': [f"{a['LastName']} {a['Initials']}" 
                       for a in article['MedlineCitation']['Article']['AuthorList']],
            'abstract': article['MedlineCitation']['Article'].get('Abstract', {}).get('AbstractText', [''])[0],
            'doi': doi,
            'pmid': pmid,
        }
    except KeyError:
        return None

def get_articles_by_year(year: int, verbose: bool = False):
    """Получить и обработать статьи за год"""
    try:
        articles_data = fetch_pubmed_articles(year)
        if not articles_data:
            if verbose:
                print(f"No articles found for year {year}")
            return pd.DataFrame()
            
        if verbose:
            print(f"Found {len(articles_data['PubmedArticle'])} articles for year {year}")
    except Exception as e:
        print(f"Error fetching articles for year {year}: {e}")
        return pd.DataFrame()
    
    parsed_articles = [parse_article(a) for a in articles_data['PubmedArticle']]
    if verbose:
        print(f"Parsed {len([a for a in parsed_articles if a is not None])} articles")
  
    df = pd.DataFrame([a for a in parsed_articles if a is not None])
    if df.empty:
        return df

    # Load impact factors
    if os.path.exists(IMPACT_CSV):
        try:
            impact_df = pd.read_csv(IMPACT_CSV, sep=';', usecols=['Rank', 'Title'])
            impact_df['journal_lower'] = impact_df['Title'].str.lower()
            df = df.merge(impact_df, how='left', on='journal_lower')
        except:
            pass
    
    # Sort by author position
    df_good = df[df['authors'].apply(lambda x: x[-1] in AUTHOR_NAMES_STRIPPED)]
    df_good = df_good.sort_values(by=['Rank'] if 'Rank' in df_good.columns else ['date'], ascending=True)
    df_bad = df[df['authors'].apply(lambda x: x[-1] not in AUTHOR_NAMES_STRIPPED)]
    df_bad = df_bad.sort_values(by=['Rank'] if 'Rank' in df_bad.columns else ['date'], ascending=True)
    df = pd.concat([df_good, df_bad]).reset_index(drop=True)

    # Clean titles
    df['title'] = df['title'].apply(lambda x: x[:-1] if x and x[-1] == '.' else x)
    df = df[df['date'].str.contains(str(year))]
    
    return df

def update_publications_csv():
    """Обновить CSV с публикациями"""
    print(f"\n{'='*60}")
    print(f"Starting publications update: {datetime.now()}")
    print(f"{'='*60}\n")
    
    # Load existing data or create empty
    if os.path.exists(DATA_CSV):
        print(f"Loading existing data from {DATA_CSV}")
        existing_df = pd.read_csv(DATA_CSV)
        existing_dois = set(existing_df['doi'].dropna())
        print(f"Found {len(existing_df)} existing publications")
    else:
        print("No existing data found, creating new dataset")
        existing_df = pd.DataFrame()
        existing_dois = set()
    
    # Get current year
    current_year = datetime.now().year
    
    # Collect all publications
    all_publications = []
    new_count = 0
    
    for year in range(1993, current_year + 1):
        print(f"\nProcessing year {year}...")
        year_df = get_articles_by_year(year, verbose=True)
        
        if not year_df.empty:
            # Filter only new articles
            if existing_dois:
                year_df['is_new'] = ~year_df['doi'].isin(existing_dois)
                new_in_year = year_df['is_new'].sum()
                if new_in_year > 0:
                    print(f"  -> Found {new_in_year} new articles")
                    new_count += new_in_year
                year_df = year_df.drop('is_new', axis=1)
            
            all_publications.append(year_df)
    
    # Combine all
    if all_publications:
        all_df = pd.concat(all_publications, ignore_index=True)
        
        # Remove duplicates by DOI
        all_df = all_df.drop_duplicates(subset=['doi'], keep='first')
        
        # Save CSV
        all_df.to_csv(DATA_CSV, index=False)
        print(f"\n{'='*60}")
        print(f"Total publications: {len(all_df)}")
        print(f"New publications added: {new_count}")
        print(f"Saved to: {DATA_CSV}")
        print(f"{'='*60}\n")
        
        return all_df
    else:
        print("No publications found")
        return existing_df

# ==================== JSON GENERATION ====================
def extract_year(date_str):
    """Извлечь год из даты"""
    if pd.isna(date_str):
        return None
    match = re.search(r'(\d{4})', str(date_str))
    return int(match.group(1)) if match else None

def generate_publications_json(df):
    """Генерировать JSON для frontend"""
    print("\nGenerating JSON for frontend...")
    
    # Extract years
    df['year'] = df['date'].apply(extract_year)
    df = df[df['year'].notna()].copy()
    
    # Group by year
    publications_by_year = {}
    
    for year in sorted(df['year'].unique(), reverse=True):
        year_df = df[df['year'] == year].copy()
        
        publications = []
        for _, row in year_df.iterrows():
            pub = {
                'title': row['title'],
                'authors': row['authors'],
                'journal': row['journal'],
                'date': row['date'],
                'year': int(row['year']),
                'abstract': row['abstract'] if pd.notna(row['abstract']) else '',
                'doi': row['doi'] if pd.notna(row['doi']) else None,
                'pmid': row['pmid'] if pd.notna(row['pmid']) else None,
            }
            publications.append(pub)
        
        publications_by_year[str(int(year))] = publications
    
    # Add metadata
    output_data = {
        'generated_at': datetime.now().isoformat(),
        'total_publications': len(df),
        'years': sorted([int(y) for y in df['year'].unique()], reverse=True),
        'publications_by_year': publications_by_year
    }
    
    # Create directory if doesn't exist
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    
    # Save JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"JSON saved to: {OUTPUT_JSON}")
    return output_data

# ==================== UMAP GENERATION ====================
def advanced_text_cleaning(text):
    """Очистка текста"""
    if pd.isna(text) or text == "":
        return ""
    
    text = str(text).lower()
    text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^\w\s\.\,\;\:\!\?\-]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    
    words = text.split()
    words = [word for word in words if len(word) >= 2 or word in ['a', 'i']]
    text = ' '.join(words)
    
    return text.strip()

def create_enhanced_stopwords():
    """Создать список стоп-слов"""
    en_stop = set(stopwords.words("english"))
    ru_stop = set(stopwords.words("russian"))
    
    academic_stop = {
        'abstract', 'introduction', 'conclusion', 'results', 'discussion',
        'method', 'methods', 'methodology', 'analysis', 'data', 'study',
        'research', 'paper', 'article', 'journal', 'conference', 'proceedings',
        'university', 'department', 'institute', 'laboratory', 'lab',
        'figure', 'table', 'section', 'chapter', 'page', 'pp', 'vol',
        'volume', 'issue', 'number', 'doi', 'isbn', 'issn', 'editor',
        'eds', 'ed', 'et', 'al', 'etc', 'ie', 'eg', 'cf', 'vs', 'via'
    }
    
    return list(en_stop | ru_stop | academic_stop)

def generate_umap_visualization(df):
    """Генерировать UMAP визуализацию"""
    print(f"\n{'='*60}")
    print("Generating UMAP visualization...")
    print(f"{'='*60}\n")
    
    # Clean and prepare data
    df = df.copy()
    df["title_clean"] = df["title"].apply(advanced_text_cleaning)
    df["abstract_clean"] = df["abstract"].apply(advanced_text_cleaning)
    
    mask_substantial = (df["title_clean"].str.len() >= 5) | (df["abstract_clean"].str.len() >= 20)
    df_filtered = df.loc[mask_substantial].reset_index(drop=True)
    
    if len(df_filtered) < 10:
        print("Not enough data for UMAP visualization")
        return
    
    # Build texts
    texts = (df_filtered["title_clean"] + " " + df_filtered["abstract_clean"]).str.strip().tolist()
    texts_filtered = [t for t in texts if len(t) >= 15]
    valid_indices = [i for i, t in enumerate(texts) if len(t) >= 15]
    df_filtered = df_filtered.iloc[valid_indices].reset_index(drop=True)
    texts = texts_filtered
    
    print(f"Processing {len(texts)} documents")
    
    # Generate embeddings
    print("Generating embeddings...")
    model = SentenceTransformer(MODEL_NAME)
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True,
        batch_size=32
    )
    
    # UMAP
    print("Performing UMAP...")
    reducer_3d = umap.UMAP(**UMAP_3D_KW)
    embedding_3d = reducer_3d.fit_transform(embeddings)
    
    # Clustering
    print("Clustering...")
    kmeans = KMeans(**KMEANS_KW)
    labels = kmeans.fit_predict(embeddings)
    
    sil = silhouette_score(embeddings, labels, metric="euclidean")
    print(f"Silhouette score: {sil:.3f}")
    
    # Generate cluster labels
    stop_words = create_enhanced_stopwords()
    tfidf = TfidfVectorizer(
        max_features=MAX_VOCAB,
        stop_words=stop_words,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.8
    )
    X = tfidf.fit_transform(texts)
    vocab = np.array(tfidf.get_feature_names_out())
    
    cluster_keywords = {}
    cluster_labels_for_plot = {}
    cluster_counts = pd.Series(labels).value_counts().sort_index()
    
    for c in range(N_CLUSTERS):
        mask = (labels == c)
        if mask.sum() == 0:
            continue
        
        avg_tfidf = X[mask].mean(axis=0).A1
        top_idx = np.argsort(avg_tfidf)[::-1][:TOP_WORDS_FOR_REPORT]
        words = vocab[top_idx].tolist()
        cluster_keywords[c] = words
        
        label_words = words[:TOP_WORDS_FOR_LABEL]
        label_words = [word.replace('_', ' ').title() for word in label_words]
        cluster_labels_for_plot[c] = " + ".join(label_words)
    
    # Prepare year data
    df_filtered['year'] = df_filtered['date'].apply(extract_year)
    df_filtered = df_filtered[df_filtered['year'].notna()].copy()
    
    # Sync arrays
    keep_idx = df_filtered.index.to_numpy()
    embedding_3d = embedding_3d[keep_idx]
    labels = labels[keep_idx]
    
    # Prepare hover texts
    hover_texts = []
    for i, row in df_filtered.iterrows():
        title = str(row['title'])[:80] + ('...' if len(str(row['title'])) > 80 else '')
        abstract = str(row['abstract'])[:120] + ('...' if len(str(row['abstract'])) > 120 else '')
        
        url_info = ""
        if pd.notna(row.get('doi')) and str(row['doi']).strip() != '':
            doi = str(row['doi'])
            url_info = f"<br><b>DOI:</b> <a href='https://doi.org/{doi}' style='color:#1E90FF'>{doi[:50]}</a>"
        
        year_str = f"<br><b>Year:</b> {int(row['year'])}"
        hover_text = f"<b>Title:</b> {title}<br><b>Abstract:</b> {abstract}{year_str}{url_info}"
        hover_texts.append(hover_text)
    
    years = df_filtered['year'].to_numpy().astype(int)
    year_min, year_max = int(years.min()), int(years.max())
    
    # Create 3D plot
    fig = go.Figure()
    
    for c in range(N_CLUSTERS):
        mask = (labels == c)
        if mask.sum() == 0:
            continue
        
        count = int(mask.sum())
        cluster_name = cluster_labels_for_plot[c]
        show_scale = (len(fig.data) == 0)
        
        fig.add_trace(go.Scatter3d(
            x=embedding_3d[mask, 0],
            y=embedding_3d[mask, 1],
            z=embedding_3d[mask, 2],
            mode='markers',
            name=f"{cluster_name} ({count})",
            text=[hover_texts[i] for i in np.where(mask)[0]],
            hovertemplate="<b>Cluster:</b> %{fullData.name}<br>"
                          "%{text}<br>"
                          "<b>Coord:</b> (%{x:.2f}, %{y:.2f}, %{z:.2f})<br>"
                          "<extra></extra>",
            marker=dict(
                size=5,
                opacity=0.8,
                line=dict(width=0.3, color='rgba(50,50,50,0.7)'),
                color=years[mask],
                colorscale='Turbo',
                cmin=year_min,
                cmax=year_max,
                showscale=show_scale,
                colorbar=dict(
                    title="Year",
                    len=0.8,
                    x=1.05
                ) if show_scale else None
            )
        ))
    
    # Add cluster centers
    for c in range(N_CLUSTERS):
        mask = (labels == c)
        if mask.sum() == 0:
            continue
        
        center = embedding_3d[mask].mean(axis=0)
        cluster_name = cluster_labels_for_plot[c]
        
        fig.add_trace(go.Scatter3d(
            x=[center[0]],
            y=[center[1]],
            z=[center[2]],
            mode='markers+text',
            name=f"Center {c}",
            text=[f"C{c}"],
            textposition="middle center",
            showlegend=False,
            marker=dict(
                size=12,
                color='red',
                opacity=0.95,
                symbol='diamond',
                line=dict(width=1, color='white')
            ),
            textfont=dict(size=10, color='white', family='Arial'),
            hovertemplate=f"<b>Cluster {c} Center</b><br>"
                          f"<b>Label:</b> {cluster_name}<br>"
                          f"<b>Documents:</b> {mask.sum()}<br>"
                          "<extra></extra>"
        ))
    
    # Layout
    fig.update_layout(
        title={
            'text': (f"<b>3D UMAP Research Clustering</b><br>"
                     f"<sub>{N_CLUSTERS} Clusters | {len(df_filtered)} Publications | "
                     f"Years: {year_min}–{year_max} | Silhouette: {sil:.3f}</sub>"),
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'family': 'Arial'}
        },
        scene=dict(
            xaxis=dict(
                title="UMAP Dim 1",
                backgroundcolor="rgba(0,0,0,0)",
                gridcolor="rgba(255,255,255,0.15)",
                showbackground=True,
                zerolinecolor="rgba(255,255,255,0.3)",
                tickfont=dict(size=8)
            ),
            yaxis=dict(
                title="UMAP Dim 2",
                backgroundcolor="rgba(0,0,0,0)",
                gridcolor="rgba(255,255,255,0.15)",
                showbackground=True,
                zerolinecolor="rgba(255,255,255,0.3)",
                tickfont=dict(size=8)
            ),
            zaxis=dict(
                title="UMAP Dim 3",
                backgroundcolor="rgba(0,0,0,0)",
                gridcolor="rgba(255,255,255,0.15)",
                showbackground=True,
                zerolinecolor="rgba(255,255,255,0.3)",
                tickfont=dict(size=8)
            ),
            bgcolor="rgba(10,10,20,1)",
            camera=dict(
                up=dict(x=0, y=0, z=1),
                center=dict(x=0, y=0, z=0),
                eye=dict(x=1.2, y=1.2, z=1.2)
            )
        ),
        paper_bgcolor="rgba(10,10,20,1)",
        plot_bgcolor="rgba(10,10,20,1)",
        font=dict(family="Arial", size=10, color="white"),
        legend=dict(
            bgcolor="rgba(20,20,30,0.9)",
            bordercolor="rgba(255,255,255,0.1)",
            borderwidth=1,
            font=dict(color="white", size=8),
            itemsizing="constant",
            yanchor="top",
            y=0.99,
            xanchor="left",
            x=0.01
        ),
        width=1200,
        height=800,
        margin=dict(l=10, r=10, t=60, b=10)
    )
    
    fig.update_traces(
        hoverlabel=dict(
            bgcolor="rgba(20,20,30,0.9)",
            bordercolor="rgba(255,255,255,0.2)",
            font=dict(color="white", size=10, family="Arial"),
            align="left",
            namelength=-1
        )
    )
    
    # Create directory if doesn't exist
    os.makedirs(os.path.dirname(OUTPUT_UMAP), exist_ok=True)
    
    # Save
    fig.write_html(OUTPUT_UMAP, config={'displayModeBar': True, 'displaylogo': False, 'responsive': True})
    print(f"UMAP visualization saved to: {OUTPUT_UMAP}")
    
    # Print cluster report
    print("\n" + "="*60)
    print("CLUSTER ANALYSIS REPORT")
    print("="*60)
    for c, words in cluster_keywords.items():
        count = cluster_counts.get(c, 0)
        pct = count/len(labels)*100 if len(labels) > 0 else 0
        print(f"\nCluster {c}: {cluster_labels_for_plot[c]}")
        print(f"Documents: {count} ({pct:.1f}%)")
        print(f"Keywords: {', '.join(words[:TOP_WORDS_FOR_REPORT])}")

# ==================== MAIN ====================
def main():
    """Главная функция"""
    print("\n" + "="*70)
    print(" PUBLICATIONS BACKEND UPDATE SCRIPT ")
    print("="*70)
    
    # 1. Update publications CSV
    df = update_publications_csv()
    
    if df.empty:
        print("No publications to process")
        return
    
    # 2. Generate JSON for frontend
    generate_publications_json(df)
    
    # 3. Generate UMAP
    generate_umap_visualization(df)
    
    print("\n" + "="*70)
    print(" UPDATE COMPLETE ")
    print("="*70)
    print(f"\nGenerated files:")
    print(f"  - {DATA_CSV}")
    print(f"  - {OUTPUT_JSON}")
    print(f"  - {OUTPUT_UMAP}")
    print(f"\nFrontend will automatically load data from {OUTPUT_JSON}")
    print()

if __name__ == "__main__":
    main()
