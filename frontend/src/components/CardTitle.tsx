import React from 'react'

type CardTitleProps = {
  children?: React.ReactNode
}

const CardTitle: React.FC<CardTitleProps> = (props) => {
  const { children } = props
  return (
    <div className="text-xl font-bold text-gray-800 pb-2">
      {children}
    </div>
  )
}
export default CardTitle
