'use client'

interface Props {
  muted: boolean
  onToggle: () => void
  top?: string
}

export function MuteButton({ muted, onToggle, top = '16px' }: Props) {
  return (
    <button
      data-mute
      onClick={onToggle}
      title={muted ? 'Включить музыку' : 'Выключить музыку'}
      style={{
        position: 'fixed',
        top,
        right: '16px',
        zIndex: 50,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        opacity: 0.45,
        padding: '6px',
        lineHeight: 0,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
    >
      {muted ? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M3.63 3.63a1 1 0 0 0 0 1.41L7.29 8.7 7 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 5v-6.59l4.18 4.18A6.92 6.92 0 0 1 13 19.93v2.02a8.9 8.9 0 0 0 4.35-2.09l1.31 1.31a1 1 0 0 0 1.41-1.41L5.05 3.63a1 1 0 0 0-1.42 0ZM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53A8.93 8.93 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM12 4 9.91 6.09 12 8.18V4Zm4.5 8c0-1.77-1-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24Z"/>
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M3 10v4a1 1 0 0 0 1 1h3l5 5V4L7 9H4a1 1 0 0 0-1 1Zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77Z"/>
        </svg>
      )}
    </button>
  )
}
