'use client'

import { useEffect, useState } from 'react'
import data from '../data/projects'

const VIGNETTE_WIDTH = 50
const NUM_ENTRIES = 51

export default function TimelineText({ scrollX, showInfo }) {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  if (!showInfo || typeof scrollX !== 'number' || isNaN(scrollX) || windowWidth === 0) return null

  const sectionWidth = VIGNETTE_WIDTH * NUM_ENTRIES
  const markerOffset = windowWidth >= 768 ? VIGNETTE_WIDTH / 2 : 0 // ← ⬅︎ clé : desktop = centré, mobile = gauche
  const relativeX = ((scrollX % sectionWidth) + sectionWidth) % sectionWidth
  const index = Math.floor((relativeX + markerOffset) / VIGNETTE_WIDTH)
  const clampedIndex = Math.max(0, Math.min(index, NUM_ENTRIES - 1))

  const entry = data.find(d => d.timeIndex === clampedIndex)
  if (!entry) return null

  return (
    <div
      className={`absolute top-[calc(50%+57px)] z-30 pointer-events-none ${
        windowWidth >= 768 ? 'left-1/2 w-[320px]' : 'left-4 w-[calc(100%-2rem)]'
      }`}
    >
      <div className="relative text-left pointer-events-auto text-[12px] md:text-xs text-black font-normal leading-[1.2] md:leading-tight space-y-[0.05rem]">
        <img
          src="/public/markerprojects.png"
          alt="Repère texte"
          className="absolute -top-22 left-0 h-19 w-auto"
          draggable="false"
        />

        {entry.project && <p><span className="font-semibold">Project:</span> {entry.project}</p>}
        {entry.client && <p><span className="font-semibold">Client:</span> {entry.client}</p>}
        {entry.director && <p><span className="font-semibold">Director:</span> {entry.director}</p>}
        {entry.creativeDirector && <p><span className="font-semibold">Creative Director:</span> {entry.creativeDirector}</p>}
        {entry.production && <p><span className="font-semibold">Production:</span> {entry.production}</p>}
        {entry.styling && <p><span className="font-semibold">Styling:</span> {entry.styling}</p>}
        {entry.model && <p><span className="font-semibold">Model:</span> {entry.model}</p>}
        {entry.mua && <p><span className="font-semibold">MUA:</span> {entry.mua}</p>}
        {entry.location && <p><span className="font-semibold">Location:</span> {entry.location}</p>}
      </div>
    </div>
  )
}
