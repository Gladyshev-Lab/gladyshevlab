import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ResearchSection {
  id: string
  title: string
  description: string
  imagePlaceholder: string
}

const RESEARCH_SECTIONS: ResearchSection[] = [
  {
    id: 'biological-age',
    title: 'Measuring biological age',
    description: 'We benchmark and refine multi-omics aging "clocks" (DNA methylation, transcriptome, proteome) and publish guidance on how to measure biological aging in humans.',
    imagePlaceholder: '/research-images/biological-age.jpg'
  },
  {
    id: 'rejuvenation',
    title: 'Rejuvenation biology',
    description: 'We investigate natural and induced rejuvenation—from the embryonic rejuvenation event during early development to partial cellular reprogramming.',
    imagePlaceholder: '/research-images/rejuvenation-biology.jpg'
  },
  {
    id: 'longevity',
    title: 'Genetics of longevity',
    description: 'We analyze centenarians and long-lived organisms to identify protective architectures that contribute to exceptional lifespan.',
    imagePlaceholder: '/research-images/genetics-longevity.jpg'
  },
  {
    id: 'aging-disease',
    title: 'Aging → disease links',
    description: 'We map age-associated cellular states that drive pathology, such as age-associated clonal B cells that progress to lymphoma.',
    imagePlaceholder: '/research-images/aging-disease.jpg'
  },
  {
    id: 'redox-selenium',
    title: 'Redox & selenium biology',
    description: 'Our lab has a long track record defining mammalian selenoproteins and redox pathways that shape health and aging.',
    imagePlaceholder: '/research-images/redox-selenium.jpg'
  },
  {
    id: 'brain-aging',
    title: 'Brain aging',
    description: 'We probe brain aging through neuroimmune and glial mechanisms, using microglia-replacement models and longitudinal brain imaging in mice. In humans, we deploy connectome-based brain-age modeling to identify deviations, risks and resilience patterns.',
    imagePlaceholder: '/research-images/brain-aging-detail.jpg'
  },
  {
    id: 'reproductive-aging',
    title: 'Reproductive aging',
    description: 'We focus on why the reproductive system ages early and how that links to whole-body aging. Our work includes ovarian aging biomarkers, multi-omics atlases of reproductive tissues, and investigations of the embryonic rejuvenation reset.',
    imagePlaceholder: '/research-images/reproductive-aging.jpg'
  },
  {
    id: 'replacement',
    title: 'Replacement',
    description: 'We use heterochronic replacement experiments—swapping young and old organs, cells or environments—to test causality in aging. These models help distinguish organ-intrinsic aging from systemic drivers and inform rejuvenation strategies.',
    imagePlaceholder: '/research-images/replacement.jpg'
  }
]

const ResearchPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const isExpanded = (id: string) => expandedSections.has(id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-red-700 pb-2">
        Research
      </h1>

      {/* Mission */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 pb-2 mb-4">Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          We study how and why organisms age — and how to measure, map, and modulate this process. 
          Our work spans quantitative biomarkers of biological age, mechanisms of rejuvenation, genetics 
          of exceptional longevity, and the interface between aging and disease, grounded in decades of 
          expertise in redox and selenium biology.
        </p>
      </div>

      {/* What we study - Expandable Sections */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 pb-2 mb-6">What we study</h2>
        
        <div className="space-y-4">
          {RESEARCH_SECTIONS.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header - Always visible */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-bold text-gray-800">{section.title}</span>
                {isExpanded(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>

              {/* Content - Expandable */}
              {isExpanded(section.id) && (
                <div className="p-6 bg-white space-y-4">
                  {/* Image Placeholder */}
                  <div className="w-full max-w-2xl mx-auto">
                    <img
                      src={section.imagePlaceholder}
                      alt={section.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="300"%3E%3Crect width="600" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="16"%3E${encodeURIComponent(section.title)}%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="12"%3E[Image placeholder]%3C/text%3E%3C/svg%3E`
                      }}
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Place image at: /public{section.imagePlaceholder}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How we work */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 pb-2 mb-4">How we work</h2>
        <p className="text-gray-700 leading-relaxed">
          We combine multi-omics experiments (bulk & single-cell), cross-species analyses, and computational 
          modeling to derive interpretable, testable insights—often validating findings across mice, humans, 
          and other mammals.
        </p>
      </div>
    </div>
  )
}

export default ResearchPage