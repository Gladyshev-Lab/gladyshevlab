import React, { useState, useEffect } from 'react'

interface TeamMember {
  name: string
  title: string
  interests: string
  scholar: string
  photo?: string
  category: string
}

const CATEGORIES = [
  { key: 'principal-investigator', title: 'Principal Investigator' },
  { key: 'instructors', title: 'Instructors' },
  { key: 'postdocs', title: 'Postdocs' },
  { key: 'research-fellows', title: 'Research Fellows' },
  { key: 'phd-students', title: 'PhD Students' },
  { key: 'masters-students', title: 'Masters Students' },
  { key: 'administrative-staff', title: 'Administrative Staff' },
]

const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<{ [key: string]: TeamMember[] }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const allMembers: { [key: string]: TeamMember[] } = {}
        
        for (const category of CATEGORIES) {
          const response = await fetch(`/data/team/${category.key}/index.json`)
          const files: string[] = await response.json()
          
          const members = await Promise.all(
            files.map(async (filename) => {
              const baseName = filename.replace('.txt', '')
              const txtResponse = await fetch(`/data/team/${category.key}/${filename}`)
              const txtContent = await txtResponse.text()
              
              // .txt file parsing
              const lines = txtContent.trim().split('\n\n')
              const name = lines[0]
              const title = lines[1]
              const interests = lines[2]
              const scholar = lines[3]
              
              // Check for photo existence
              let photo: string | undefined
              try {
                const photoResponse = await fetch(`/data/team/${category.key}/${baseName}.jpg`)
                if (photoResponse.ok) photo = `/data/team/${category.key}/${baseName}.jpg`
              } catch {
                // No photo available
              }
              
              return {
                name,
                title,
                interests,
                scholar,
                photo,
                category: category.title
              }
            })
          )
          
          allMembers[category.key] = members
        }
        
        setTeam(allMembers)
      } catch (error) {
        console.error('Error loading team:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTeam()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading team...</div>
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 pb-2">
        Team
      </h1>
      
      {CATEGORIES.map((category) => {
        const members = team[category.key] || []
        if (members.length === 0) return null
        
        return (
          <section key={category.key}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-red-700 pb-2">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  {member.photo && (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-black-600 text-center mb-2">
                    {member.title}
                  </p>
                  <p className="text-sm text-gray-600 text-center mb-3">
                    {member.interests}
                  </p>
                  <p className="text-sm text-gray-700 text-center underline">
                    {member.scholar && /^https?:\/\/.+/.test(member.scholar) ? (
                      <a href={member.scholar} target="_blank" rel="noopener noreferrer">
                        Publications
                      </a>
                    ) : (
                      <span className="text-gray-400">No Publications Link</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default TeamPage