import React from 'react'

type CardProps = {
  children?: React.ReactNode
}

const Card: React.FC<CardProps> = (props) => {
  const { children } = props
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-6">
      {children}
    </div>
  )
}
export default Card
