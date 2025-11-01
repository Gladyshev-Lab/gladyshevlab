import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

interface NewsItem {
  date: string
  content: string
  image?: string
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/data/news/index.json')
        const files: string[] = await response.json()
        
        const newsItems = await Promise.all(
          files.map(async (filename) => {
            const baseName = filename.replace('.md', '')
            const mdResponse = await fetch(`/data/news/${filename}`)
            const mdText = await mdResponse.text()
            const html = marked(mdText)
            
            // Проверяем наличие изображения
            let image: string | undefined
            try {
              const imgResponse = await fetch(`/data/news/${baseName}.jpg`)
              if (imgResponse.ok) image = `/data/news/${baseName}.jpg`
            } catch {}
            
            return {
              date: baseName,
              content: html as string,
              image
            }
          })
        )
        
        // Сортируем по дате (новые сверху)
        newsItems.sort((a, b) => {
          const [aM, aD, aY] = a.date.split('-').map(Number)
          const [bM, bD, bY] = b.date.split('-').map(Number)
          const aDate = new Date(2000 + aY, aM - 1, aD)
          const bDate = new Date(2000 + bY, bM - 1, bD)
          return bDate.getTime() - aDate.getTime()
        })
        
        setNews(newsItems)
      } catch (error) {
        console.error('Error loading news:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadNews()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading news...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">News</h1>
      
      {news.length === 0 ? (
        <p className="text-gray-600">No news available yet.</p>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <article key={item.date} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-3">
                {new Date(
                  2000 + parseInt(item.date.split('-')[2]),
                  parseInt(item.date.split('-')[0]) - 1,
                  parseInt(item.date.split('-')[1])
                ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {item.image && (
                <img 
                  src={item.image} 
                  alt="News" 
                  className="w-full max-h-96 object-cover rounded-lg mb-4"
                />
              )}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default NewsPage