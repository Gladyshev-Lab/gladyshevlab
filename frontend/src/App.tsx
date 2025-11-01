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
      <header className="bg-gray-100 border-b border-gray-200 items-center flex justify-center space-between">
        <img src="./src/assets/logo.png" alt="Gladyshev Lab Logo" className="h-30 w-40 object-contain" />
      </header>

      {/* Navigation Bar */}
      <nav className="bg-red-700 py-3">
        <ul className="flex space-x-10 text-white font-medium max-w-6xl mx-auto items-center justify-center">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/research" className="hover:underline">Research</Link></li>
          <li><Link to="/team" className="hover:underline">Team</Link></li>
          <li><Link to="/publications" className="hover:underline">Publications</Link></li>
          <li><Link to="/news" className="hover:underline">News</Link></li>
          <li><Link to="/tools" className="hover:underline">Lab Tools</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-10 px-50">
        <Routes>
          <Route path="/" element={
            <div className="">
              {/* Team Photo */}
              <img
                src="2022NRB.jpg"
                alt="Gladyshev Lab team in front of Pasteur Institute"
                className="w-full max-w-4xl mx-auto rounded-lg shadow-lg mb-8"
              />
              
              {/* Lab Description */}
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-6 max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  The Gladyshev Lab at Harvard Medical School studies the fundamental mechanisms of aging and 
                  age-related diseases. Our research focuses on selenium biology, oxidative stress, and the 
                  development of interventions to promote healthy longevity.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We combine computational biology, genomics, and experimental approaches to understand how 
                  cells age and how we can intervene in this process. Our work has implications for treating 
                  age-related diseases and extending healthspan.
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-4 mt-10">Follow us on 𝕏:
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
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="text-center">
          <p>&copy; 2025 Gladyshev Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App