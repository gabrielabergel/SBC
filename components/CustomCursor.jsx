'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor({ isOpen }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [mode, setMode] = useState('info')
  const [isClicking, setIsClicking] = useState(false)
  const [clickStartX, setClickStartX] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      setPos({ x, y })

      const el = document.elementFromPoint(x, y)
      const cursorType =
        el?.closest('[data-cursor]')?.getAttribute('data-cursor') || 'info'

      if (isClicking && cursorType === 'timeline') {
        const deltaX = x - clickStartX
        const threshold = 3

        const newMode =
          deltaX < -threshold ? 'left'
          : deltaX > threshold ? 'right'
          : 'timeline'

        if (newMode !== mode) {
          setMode(newMode)
        }
      } else {
        setMode(cursorType)
      }
    }

    const handleMouseDown = (e) => {
      setIsClicking(true)
      setClickStartX(e.clientX)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
      setClickStartX(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isClicking, clickStartX, mode])

  const renderCursor = () => {
    if (mode === 'none') return null

    if (mode === 'left') {
      return <img src="/public/rewind.png" alt="rewind" className="w-4 h-4" />
    }

    if (mode === 'right') {
      return <img src="/public/forward.png" alt="forward" className="w-4 h-4" />
    }

    if (mode === 'timeline') {
      return null
    }

    return (
      <>
        <div
          className="text-black text-[25px] font-normal leading-none transition-transform duration-300"
          style={{
            transform: `rotate(${isOpen ? 45 : 0}deg)`,
          }}
        >
          +
        </div>
        <div className="text-black text-sm font-semibold mt-0 ml-6">
          {isOpen ? 'Close' : 'Info'}
        </div>
      </>
    )
  }

  return (
    <div
      className="fixed z-[9999] pointer-events-none hidden lg:block"
      style={{
        top: pos.y,
        left: pos.x,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center select-none">
        {renderCursor()}
      </div>
    </div>
  )
}
