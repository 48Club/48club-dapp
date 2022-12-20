import React from 'react'

export default function Label(props) {
  const { text } = props
  return (
    <div className="flex flex-row items-center">
      <div className="w-1 h-5 mr-2 bg-primary">&nbsp;</div>
      <span className="font-bold text-lg leading-6" style={{ color: '#1E1E1E' }}>{text}</span>
    </div>
  )
}
