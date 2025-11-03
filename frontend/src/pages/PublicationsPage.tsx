import React, { useState, useEffect } from 'react'

interface Publication {
  title: string
  authors: string[]
  journal: string
  date: string
  year: number
  abstract: string
  doi: string | null
  pmid: string | null
}

interface PublicationsData {
  generated_at: string
  total_publications: number
  years: number[]
  publications_by_year: { [year: string]: Publication[] }
}

const PublicationsPage: React.FC = () => {
  const [data, setData] = useState<PublicationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Загрузить данные публикаций
    fetch('/publications.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load publications')
        }
        return response.json()
      })
      .then((data: PublicationsData) => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const toggleAbstract = (doi: string | null, index: number) => {
    const key = doi || `pub-${index}`
    const newExpanded = new Set(expandedAbstracts)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedAbstracts(newExpanded)
  }

  const isAbstractExpanded = (doi: string | null, index: number) => {
    const key = doi || `pub-${index}`
    return expandedAbstracts.has(key)
  }

  const filterPublications = (publications: Publication[]) => {
    if (!searchTerm) return publications
    
    const term = searchTerm.toLowerCase()
    return publications.filter(pub => 
      pub.title.toLowerCase().includes(term) ||
      pub.authors.some(author => author.toLowerCase().includes(term)) ||
      pub.journal.toLowerCase().includes(term) ||
      pub.abstract.toLowerCase().includes(term)
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Publications</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Publications</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading publications: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Publications</h1>
        <p className="text-gray-600">No publications data available.</p>
      </div>
    )
  }

  const yearsToDisplay = selectedYear ? [selectedYear] : data.years.map(String)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Publications
          <span className="text-xl text-gray-600 ml-3">({data.total_publications} total)</span>
        </h1>
        
        {/* UMAP Button - Commented out per Vadim's feedback (clusters are wrong)
        <a
          href="/umap_visualization.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View UMAP Visualization
        </a>
        */}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <input
          type="text"
          placeholder="Search publications by title, author, journal, or abstract..."
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

      {/* Publications by Year */}
      {yearsToDisplay.map(year => {
        const publications = filterPublications(data.publications_by_year[year] || [])
        
        if (publications.length === 0 && searchTerm) {
          return null
        }

        return (
          <div key={year} id={`year-${year}`} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-700 pb-2 mb-6">
              {year}
              <span className="text-lg text-gray-600 ml-3">({publications.length})</span>
            </h2>

            {publications.length === 0 ? (
              <p className="text-gray-500 italic">No publications found for this year matching your search.</p>
            ) : (
              <div className="space-y-6">
                {publications.map((pub, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    <p className="text-gray-700 mb-1">
                      {pub.authors.join(', ')}
                    </p>

                    {/* Journal */}
                    <p className="text-gray-600 italic mb-1">
                      {pub.journal}
                    </p>

                    {/* DOI */}
                    {pub.doi && (
                      <p className="text-gray-600 mb-3">
                        <span className="font-medium">DOI:</span> {pub.doi}
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 mt-3">
                      {/* Abstract Toggle */}
                      {pub.abstract && (
                        <button
                          onClick={() => toggleAbstract(pub.doi, index)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
                        >
                          {isAbstractExpanded(pub.doi, index) ? 'Hide Abstract' : 'Show Abstract'}
                        </button>
                      )}

                      {/* DOI Link */}
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
                        >
                          View Article
                        </a>
                      )}

                      {/* PubMed Link */}
                      {pub.pmid && (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm"
                        >
                          PubMed
                        </a>
                      )}
                    </div>

                    {/* Abstract (Collapsible) */}
                    {pub.abstract && isAbstractExpanded(pub.doi, index) && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {pub.abstract}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* No Results Message */}
      {searchTerm && yearsToDisplay.every(year => 
        filterPublications(data.publications_by_year[year] || []).length === 0
      ) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No publications found matching "{searchTerm}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
}

export default PublicationsPage