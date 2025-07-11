'use client'

import { useEffect, useState } from 'react'
import data from '../data/projects'

const VIGNETTE_WIDTH = 50
const NUM_ENTRIES = 51

export default function TimelineText({ scrollX, showInfo, timelineRef }) {
  const [windowWidth, setWindowWidth] = useState(0)
  const [timelineTop, setTimelineTop] = useState('50%')

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    const updatePosition = () => {
      if (timelineRef?.current) {
        const rect = timelineRef.current.getBoundingClientRect()
        setTimelineTop(`${rect.bottom + 10}px`) // 10px sous la timeline
      }
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [timelineRef])

  if (!showInfo || typeof scrollX !== 'number' || isNaN(scrollX) || windowWidth === 0) return null

  const sectionWidth = VIGNETTE_WIDTH * NUM_ENTRIES
  const markerOffset = windowWidth >= 768 ? VIGNETTE_WIDTH / 2 : 0
  const relativeX = ((scrollX % sectionWidth) + sectionWidth) % sectionWidth
  const index = Math.floor((relativeX + markerOffset) / VIGNETTE_WIDTH)
  const clampedIndex = Math.max(0, Math.min(index, NUM_ENTRIES - 1))

  const entry = data.find(d => d.timeIndex === clampedIndex)
  if (!entry) return null

  return (
    <div
      className="fixed z-30 pointer-events-none w-full transition-all duration-300"
      style={{ top: timelineTop }}
    >
      <div
        className={`relative pointer-events-auto text-[12px] md:text-xs text-black font-normal leading-[1.2] md:leading-tight space-y-[0.05rem] px-4 md:px-0 ${
windowWidth >= 768
  ? 'w-[320px] text-left absolute left-1/2'
  : 'w-full text-left px-4'
        }`}
      >
       <div className="absolute -top-5 left-4 md:left-1/2 md:-translate-x-[160px] w-[1px] h-5 bg-black" />

<div className="pt-2"></div>
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
