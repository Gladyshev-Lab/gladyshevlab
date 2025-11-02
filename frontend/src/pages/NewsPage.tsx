import React, { useState, useEffect } from 'react'

interface NewsItem {
  date: string
  formatted_date: string
  year: number
  content: string
  image?: string
  title?: string
}

interface NewsData {
  generated_at: string
  total_news: number
  years: number[]
  news_by_year: { [year: string]: NewsItem[] }
}

const NewsPage: React.FC = () => {
  const [data, setData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/news.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load news')
        }
        return response.json()
      })
      .then((data: NewsData) => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filterNews = (newsItems: NewsItem[]) => {
    if (!searchTerm) return newsItems
    
    const term = searchTerm.toLowerCase()
    return newsItems.filter(item => 
      item.content.toLowerCase().includes(term) ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      item.formatted_date.toLowerCase().includes(term)
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">News</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">News</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading news: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">News</h1>
        <p className="text-gray-600">No news data available.</p>
      </div>
    )
  }

  const yearsToDisplay = selectedYear ? [selectedYear] : data.years.map(String)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          News
          <span className="text-xl text-gray-600 ml-3">({data.total_news} total)</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <input
          type="text"
          placeholder="Search news by content or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Year Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <span className="font-semibold text-gray-700">Filter by year:</span>
          <button
            onClick={() => setSelectedYear(null)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              !selectedYear 
                ? 'bg-red-700 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Years
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(String(year))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedYear === String(year)
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500">
        Last updated: {new Date(data.generated_at).toLocaleString()}
      </div>

      {/* News by Year */}
      {yearsToDisplay.map(year => {
        const newsItems = filterNews(data.news_by_year[year] || [])
        
        if (newsItems.length === 0 && searchTerm) {
          return null
        }

        return (
          <div key={year} id={`year-${year}`} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-700 pb-2 mb-6">
              {year}
              <span className="text-lg text-gray-600 ml-3">({newsItems.length})</span>
            </h2>

            {newsItems.length === 0 ? (
              <p className="text-gray-500 italic">No news found for this year matching your search.</p>
            ) : (
              <div className="space-y-6">
                {newsItems.map((item, index) => (
                  <article key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    {/* Date */}
                    <div className="text-sm font-medium text-red-700 mb-3">
                      {item.formatted_date}
                    </div>

                    {/* Title (if exists) */}
                    {item.title && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                    )}

                    {/* Image */}
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt="News" 
                        className="max-h-140 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Content */}
                    <div 
                      className="prose max-w-none text-gray-700 news tracking-tight font-[Arial] text-justify mr-20"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </article>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* No Results Message */}
      {searchTerm && yearsToDisplay.every(year => 
        filterNews(data.news_by_year[year] || []).length === 0
      ) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No news found matching "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
}

export default NewsPage