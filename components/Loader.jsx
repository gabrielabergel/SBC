'use client'

import { useEffect, useState } from 'react'

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onDone) onDone()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black font-semibold text-[11px] md:text-[13px] tracking-widest transition-opacity duration-500">
      SAMY BOUARD CART
    </div>
  )
}
