'use client'
import React from 'react'

interface HealthBarProps {
  player1Health: number;
  player2Health: number;
}

export const HealthBar = ({ player1Health, player2Health }: HealthBarProps) => {

  return (
    <div className="flex justify-between items-center w-full gap-10 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}>
      <div className="flex items-center gap-3 flex-1">
        <span className="min-w-20 font-bold">Player 1:</span>
        <div 
          className="flex-1 h-5 rounded-full overflow-hidden border border-gray-500"
          style={{ backgroundColor: '#374151' }}
        >
          <div 
            className="h-full transition-all duration-300 ease-in-out"
            style={{ 
              width: `${player1Health}%`,
              backgroundColor: player1Health > 50 ? '#4CAF50' : player1Health > 25 ? '#FFC107' : '#F44336'
            }}
          />
        </div>
        <span className="min-w-12 text-right font-bold">{player1Health}%</span>
      </div>
      <div className="flex items-center gap-3 flex-1">
        <span className="min-w-12 text-left font-bold">{player2Health}%</span>
        <div
          className="flex-1 h-5 rounded-full overflow-hidden border border-gray-500"
          style={{ backgroundColor: '#374151', transform: 'scaleX(-1)' }}
        >
          <div
            className="h-full transition-all duration-300 ease-in-out"
            style={{
              width: `${player2Health}%`,
              backgroundColor: player2Health > 50 ? '#4CAF50' : player2Health > 25 ? '#FFC107' : '#F44336'
            }}
          />
        </div>
        <span className="min-w-20 text-right font-bold">Player 2:</span>
      </div>
    </div>
  )
}
