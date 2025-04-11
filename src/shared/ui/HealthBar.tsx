'use client'
import React from 'react'

export const HealthBar = ({ health }: { health: number }) => {
  return (
    <div className="w-40 h-4 bg-gray-800 border border-white rounded">
      <div
        className="h-full bg-green-500 rounded"
        style={{ width: `${Math.max(0, health)}%` }}
      >{health}</div>

    </div>
  )
}
