// src/App.tsx (Main page with navigation and home content)
import React, { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ResearchPage from './pages/ResearchPage'
import TeamPage from './pages/TeamPage'
import PublicationsPage from './pages/PublicationsPage'
import NewsPage from './pages/NewsPage'
import LabToolsPage from './pages/LabToolsPage'
import ContactPage from './pages/ContactPage'

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header className="bg-gray-100 flex justify-center py-4 px-4">
        <img src="./src/assets/logo.png" alt="Gladyshev Lab Logo" className="h-12 w-auto sm:h-16 md:h-20 object-contain" />
      </header>

      {/* Navigation Bar */}
      <nav className="bg-red-800 py-2 sm:py-3 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex justify-start">
            <button
              onClick={toggleMenu}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex sm:flex-row sm:space-x-8 text-white font-medium items-center justify-center text-center">
            <li><Link to="/" className="hover:underline block py-1">Home</Link></li>
            <li><Link to="/research" className="hover:underline block py-1">Research</Link></li>
            <li><Link to="/team" className="hover:underline block py-1">Team</Link></li>
            <li><Link to="/publications" className="hover:underline block py-1">Publications</Link></li>
            <li><Link to="/news" className="hover:underline block py-1">News</Link></li>
            <li><Link to="/tools" className="hover:underline block py-1">Lab Tools</Link></li>
            <li><Link to="/contact" className="hover:underline block py-1">Contact</Link></li>
          </ul>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <ul className="sm:hidden flex flex-col space-y-2 mt-4 text-white font-medium text-left">
              <li><Link to="/" className="hover:underline block py-2" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/research" className="hover:underline block py-2" onClick={closeMenu}>Research</Link></li>
              <li><Link to="/team" className="hover:underline block py-2" onClick={closeMenu}>Team</Link></li>
              <li><Link to="/publications" className="hover:underline block py-2" onClick={closeMenu}>Publications</Link></li>
              <li><Link to="/news" className="hover:underline block py-2" onClick={closeMenu}>News</Link></li>
              <li><Link to="/tools" className="hover:underline block py-2" onClick={closeMenu}>Lab Tools</Link></li>
              <li><Link to="/contact" className="hover:underline block py-2" onClick={closeMenu}>Contact</Link></li>
            </ul>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/research" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><ResearchPage /></div>} />
          <Route path="/team" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><TeamPage /></div>} />
          <Route path="/publications" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><PublicationsPage /></div>} />
          <Route path="/news" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><NewsPage /></div>} />
          <Route path="/tools" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><LabToolsPage /></div>} />
          <Route path="/contact" element={<div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-40"><ContactPage /></div>} />
        </Routes>
      </main>

      {/* Footer with Affiliations */}
      <footer className="text-white py-8 mt-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Affiliations */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <img 
                src="/logos/harvard.jpg" 
                alt="Harvard Medical School" 
                className="h-16 w-auto mx-auto mb-2p-2 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="h-16 w-32 bg-gray-600 rounded flex items-center justify-center text-xs">HMS Logo</div>
            </div>
            
            <div className="text-center">
              <img 
                src="/logos/mgb.svg" 
                alt="Mass General Brigham" 
                className="h-16 w-auto mx-auto mb-2 p-2 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="h-16 w-32 bg-gray-600 rounded flex items-center justify-center text-xs">MGB Logo</div>
            </div>
            
            <div className="text-center">
              <img 
                src="/logos/broad.png" 
                alt="Broad Institute" 
                className="h-16 w-auto mx-auto mb-2 p-2 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}} className="h-16 w-32 bg-gray-600 rounded flex items-center justify-center text-xs">Broad Logo</div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Gladyshev Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App