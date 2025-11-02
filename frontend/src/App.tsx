// src/App.tsx (Main page with navigation and home content)
import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import ResearchPage from './pages/ResearchPage'
import TeamPage from './pages/TeamPage'
import PublicationsPage from './pages/PublicationsPage'
import NewsPage from './pages/NewsPage'
import LabToolsPage from './pages/LabToolsPage'
import ContactPage from './pages/ContactPage'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header className="bg-gray-100 border-b border-gray-200 flex justify-center py-4 px-4">
        <img src="./src/assets/logo.png" alt="Gladyshev Lab Logo" className="h-12 w-auto sm:h-16 md:h-20 object-contain" />
      </header>

      {/* Navigation Bar */}
      <nav className="bg-red-700 py-2 sm:py-3 px-4">
        <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 text-white font-medium max-w-6xl mx-auto items-center justify-center text-center sm:text-left"> {/* ИЗМЕНЕНО: flex-col на мобильном, space-y, text-center */}
          <li><Link to="/" className="hover:underline block py-1">Home</Link></li>
          <li><Link to="/research" className="hover:underline block py-1">Research</Link></li>
          <li><Link to="/team" className="hover:underline block py-1">Team</Link></li>
          <li><Link to="/publications" className="hover:underline block py-1">Publications</Link></li>
          <li><Link to="/news" className="hover:underline block py-1">News</Link></li>
          <li><Link to="/tools" className="hover:underline block py-1">Lab Tools</Link></li>
          <li><Link to="/contact" className="hover:underline block py-1">Contact</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40">
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              {/* Team Photo */}
              <img
                src="lab.jpg"
                alt="Gladyshev Lab team in front of Pasteur Institute"
                className="w-full max-w-4xl mx-auto block rounded-lg shadow-lg"
              />
              
              {/* Lab Description */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 max-w-4xl mx-auto">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  The Gladyshev Lab at Harvard Medical School studies the fundamental mechanisms of aging and 
                  age-related diseases. Our research focuses on selenium biology, oxidative stress, and the 
                  development of interventions to promote healthy longevity.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                  We combine computational biology, genomics, and experimental approaches to understand how 
                  cells age and how we can intervene in this process. Our work has implications for treating 
                  age-related diseases and extending healthspan.
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-800 mb-4 mt-10">Follow us on 𝕏:
                  <a
                    href="https://X.com/gladyshev_lab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium ml-2"
                  >
                    <span>@gladyshev_lab</span>
                  </a>
                </p>
              </div>
            </div>
          } />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/tools" element={<LabToolsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      {/* Footer (Optional, simple for now) */}
      <footer className="bg-gray-800 text-white py-4 mt-12 px-4">
        <div className="text-center max-w-6xl mx-auto">
          <p>&copy; 2025 Gladyshev Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App