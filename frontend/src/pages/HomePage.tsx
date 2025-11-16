import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Publication {
  title: string
  authors: string[]
  journal: string
  date: string
  year: number
  doi: string | null
  pmid: string | null
}

interface NewsItem {
  date: string
  formatted_date: string
  year: number
  content: string
  title?: string
}

interface ResearchArea {
  title: string
  description: string
  imagePlaceholder: string
}

const RESEARCH_AREAS: ResearchArea[] = [
  {
    title: "Measuring Biological Age",
    description: "Multi-omics aging clocks and biomarkers",
    imagePlaceholder: "/research-images/aging-clocks.jpg"
  },
  {
    title: "Rejuvenation Biology",
    description: "From embryonic reset to cellular reprogramming",
    imagePlaceholder: "/research-images/rejuvenation.jpg"
  },
  {
    title: "Genetics of Longevity",
    description: "Centenarians and protective architectures",
    imagePlaceholder: "/research-images/longevity.jpg"
  },
  {
    title: "Brain Aging",
    description: "Neuroimmune mechanisms and connectome modeling",
    imagePlaceholder: "/research-images/brain-aging.jpg"
  },
  {
    title: "Redox & Selenium Biology",
    description: "Mammalian selenoproteins and health pathways",
    imagePlaceholder: "/research-images/redox.jpg"
  }
]

const HomePage: React.FC = () => {
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load publications
        const pubResponse = await fetch('/publications.json')
        if (pubResponse.ok) {
          const pubData = await pubResponse.json()
          const allPubs: Publication[] = []
          
          // Get first 5 publications from most recent years
          for (const year of pubData.years) {
            const yearPubs = pubData.publications_by_year[String(year)] || []
            allPubs.push(...yearPubs)
            if (allPubs.length >= 5) break
          }
          
          setRecentPublications(allPubs.slice(0, 5))
        }

        // Load news
        const newsResponse = await fetch('/news.json')
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          const allNews: NewsItem[] = []
          
          // Get first 5 news from most recent years
          for (const year of newsData.years) {
            const yearNews = newsData.news_by_year[String(year)] || []
            allNews.push(...yearNews)
            if (allNews.length >= 5) break
          }
          
          setRecentNews(allNews.slice(0, 5))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % RESEARCH_AREAS.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + RESEARCH_AREAS.length) % RESEARCH_AREAS.length)
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div>
      {/* Hero Banner - Full Width */}
      {/* <div className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-800 text-white overflow-hidden" style={{ height: '50vh' }}> */}
        {/* Animated gradient orbs */}
        {/* <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-red-500 rounded-full filter blur-[120px] opacity-40 animate-float-slow"></div>
          <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-orange-400 rounded-full filter blur-[140px] opacity-30 animate-float-medium"></div>
          <div className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] bg-red-600 rounded-full filter blur-[130px] opacity-35 animate-float-fast"></div>
        </div> */}
        
        {/* Radial gradient overlay for depth */}
        {/* <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-30"></div>
        
        <div className="relative h-full flex items-center justify-center z-10">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Gladyshev Lab
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}>
              Aging, Rejuvenation, and Lifespan Control
            </p>
          </div>
        </div>
        
        <style>{`
          @keyframes float-slow {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          
          @keyframes float-medium {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(-40px, 30px) scale(1.05);
            }
            66% {
              transform: translate(25px, -25px) scale(0.95);
            }
          }
          
          @keyframes float-fast {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(20px, 40px) scale(1.08);
            }
            66% {
              transform: translate(-30px, -20px) scale(0.92);
            }
          }
          
          .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
          }
          
          .animate-float-medium {
            animation: float-medium 25s ease-in-out infinite;
          }
          
          .animate-float-fast {
            animation: float-fast 18s ease-in-out infinite;
          }
        `}</style>
      </div> */}

      {/* Team Photo - Full Width */}
      <div className="bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <img
            src="/lab.jpg"
            alt="Gladyshev Lab team"
            className="w-full max-w-4xl mx-auto object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="500"%3E%3Crect width="1200" height="500" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="24"%3ELab Team Photo%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>
      </div>

      {/* Lab Description - Full Width with centered content */}
      <div className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            The Gladyshev Lab at Harvard Medical School investigates the fundamental nature of aging, 
            rejuvenation, and lifespan control. We combine experimental systems, human cohorts, and 
            computational analyses to understand why organisms age and how to measure, map, and modulate 
            this process.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            Our work spans quantitative biomarkers of biological age, mechanisms of rejuvenation, genetics 
            of exceptional longevity, cross-species analyses, and the interface between aging and disease. 
            The lab has pioneered research in redox and selenium biology, discovering how these systems 
            shape health, aging, and longevity across species.
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            Follow us on 𝕏:
            <a
              href="https://X.com/gladyshev_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 ml-2"
            >
              @gladyshev_lab
            </a>
          </p>
        </div>
      </div>

      {/* Research Areas Carousel - Full Width with large content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
            Research Areas
          </h2>
          
          <div className="relative">
            {/* Carousel Content */}
            <div className="flex items-center justify-center min-h-[500px] sm:min-h-[600px]">
              <div className="text-center w-full max-w-4xl">
                {/* Large Image */}
                <div className="mb-8 mx-auto">
                  <img
                    src={RESEARCH_AREAS[currentSlide].imagePlaceholder}
                    alt={RESEARCH_AREAS[currentSlide].title}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect width="800" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="20"%3E${encodeURIComponent(RESEARCH_AREAS[currentSlide].title)}%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14"%3E[Image placeholder]%3C/text%3E%3C/svg%3E`
                    }}
                  />
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {RESEARCH_AREAS[currentSlide].title}
                </h3>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  {RESEARCH_AREAS[currentSlide].description}
                </p>
              </div>
            </div>

            {/* Navigation Buttons - Larger */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots Indicator - Larger */}
            <div className="flex justify-center gap-3 mt-8">
              {RESEARCH_AREAS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-red-700' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/research"
              className="inline-block px-8 py-3 bg-red-700 text-white text-lg rounded-lg hover:bg-red-800 transition-colors shadow-md"
            >
              Learn More About Our Research
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Publications - Full Width with centered content */}
      <div className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recent Publications</h2>
            <Link to="/publications" className="text-red-700 hover:text-red-800 font-medium text-lg">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading publications...</div>
          ) : recentPublications.length > 0 ? (
            <div className="space-y-6">
              {recentPublications.map((pub, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {pub.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-1">
                    {pub.authors.slice(0, 3).join(', ')}
                    {pub.authors.length > 3 ? ', et al.' : ''}
                  </p>
                  <p className="text-base text-gray-500 italic mb-2">
                    {pub.journal} ({pub.year})
                  </p>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 hover:underline"
                    >
                      View Article
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No publications available.</p>
          )}
        </div>
      </div>

      {/* Recent News - Full Width with centered content */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Recent News</h2>
            <Link to="/news" className="text-red-700 hover:text-red-800 font-medium text-lg">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading news...</div>
          ) : recentNews.length > 0 ? (
            <div className="space-y-6">
              {recentNews.map((item, index) => (
                <div key={index} className="border-b border-gray-300 pb-6 last:border-b-0 last:pb-0">
                  <div className="text-sm font-medium text-red-700 mb-2">
                    {item.formatted_date}
                  </div>
                  {item.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                  )}
                  <p className="text-base text-gray-700 line-clamp-3">
                    {stripHtml(item.content)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No news available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage