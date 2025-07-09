'use client'

import { useRef, useEffect, useState, useMemo } from 'react'

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(Math.floor(seconds % 60)).padStart(2, '0')
  const ms = String(Math.floor((seconds % 1) * 100)).padStart(2, '0')
  return `${m}'${s}''${ms}`
}

const VIGNETTE_WIDTH = 50
const INACTIVITY_DELAY = 2500
const NUM_THUMBS = 51

export default function TimelineScroll({
  currentTime,
  duration,
  onSeek,
  isPlaying,
  muteControl,
  videoRef,
  onScrollUpdate,
  showInfo,
}) {
  const wrapperRef = useRef(null)
  const friseRef = useRef(null)
  const timelineRef = useRef(null)
  const hideTimer = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [internalTime, setInternalTime] = useState(0)
  const [isDesktop, setIsDesktop] = useState(true)
  const [showFrise, setShowFrise] = useState(true)

  const wasPlayingBeforeDrag = useRef(false)
  const continuousPosition = useRef(0)
  const sectionWidthRef = useRef(NUM_THUMBS * VIGNETTE_WIDTH)
  const skipNextSyncRef = useRef(false)
  const initialScrollDone = useRef(false)

  const baseThumbs = useMemo(() =>
    Array.from({ length: NUM_THUMBS }, (_, i) => ({
      src: `/thumbs/thumb_${String(i).padStart(3, '0')}.jpg`,
      time: ((i + 1) * duration) / (NUM_THUMBS + 1),
    }))
  , [duration])

  const thumbs = [...baseThumbs, ...baseThumbs, ...baseThumbs]
  const sectionWidth = sectionWidthRef.current
  const totalWidth = sectionWidth * 3

  const updateScrollX = (scrollX) => {
    const containerWidth = wrapperRef.current?.offsetWidth || window.innerWidth
    const markerOffset = containerWidth >= 768 ? containerWidth / 2 - VIGNETTE_WIDTH / 2 : 24
    const adjustedScrollX = scrollX + markerOffset
    onScrollUpdate?.(adjustedScrollX)
  }

  const resetInactivityTimer = () => {
    setShowFrise(true)
    clearTimeout(hideTimer.current)
    if (!showInfo) {
      hideTimer.current = setTimeout(() => setShowFrise(false), INACTIVITY_DELAY)
    }
  }

  const handleStart = (clientX) => {
    resetInactivityTimer()
    setIsDragging(true)
    wasPlayingBeforeDrag.current = !videoRef.current.paused
    videoRef.current.pause()
    timelineRef.current.setAttribute('data-start-x', clientX)
    timelineRef.current.setAttribute('data-start-scroll', continuousPosition.current)
  }

  const handleMove = (clientX) => {
    if (!isDragging || !duration) return
    const startX = parseFloat(timelineRef.current.getAttribute('data-start-x'))
    const startScroll = parseFloat(timelineRef.current.getAttribute('data-start-scroll'))
    const dx = clientX - startX
    const newScrollX = startScroll - dx
    const relative = ((newScrollX % sectionWidth) + sectionWidth) % sectionWidth
    const newTime = (relative / sectionWidth) * duration

    onSeek(newTime)
    setInternalTime(newTime)
    continuousPosition.current = newScrollX
    updateScrollX(newScrollX)
    if (videoRef.current) videoRef.current.currentTime = newTime
    if (friseRef.current) friseRef.current.style.transform = `translateX(-${newScrollX}px)`
  }

  const handleEnd = () => {
    setIsDragging(false)
    skipNextSyncRef.current = true
    if (videoRef.current && wasPlayingBeforeDrag.current) {
      videoRef.current.play()
    }
  }

  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 1024)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    if (!duration || !videoRef.current || isDragging) return
    let raf
    const update = () => {
      if (skipNextSyncRef.current) {
        skipNextSyncRef.current = false
        raf = requestAnimationFrame(update)
        return
      }
      const rawTime = videoRef.current.currentTime % duration
      setInternalTime(rawTime)
      const scrollX = sectionWidth + (rawTime / duration) * sectionWidth
      continuousPosition.current = scrollX
      if (friseRef.current) friseRef.current.style.transform = `translateX(-${scrollX}px)`
      updateScrollX(scrollX)
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, duration, isDragging])

  useEffect(() => {
    const triggerActivity = () => resetInactivityTimer()
    window.addEventListener('mousemove', triggerActivity)
    window.addEventListener('click', triggerActivity)
    window.addEventListener('touchstart', triggerActivity)
    return () => {
      window.removeEventListener('mousemove', triggerActivity)
      window.removeEventListener('click', triggerActivity)
      window.removeEventListener('touchstart', triggerActivity)
    }
  }, [showInfo])

  useEffect(() => {
    resetInactivityTimer()
    return () => clearTimeout(hideTimer.current)
  }, [showInfo])

  useEffect(() => {
    if (!initialScrollDone.current && duration > 0 && videoRef.current?.currentTime > 0) {
      const rawTime = videoRef.current.currentTime % duration
      const scrollX = sectionWidth + (rawTime / duration) * sectionWidth
      continuousPosition.current = scrollX
      if (friseRef.current) friseRef.current.style.transform = `translateX(-${scrollX}px)`
      updateScrollX(scrollX)
      initialScrollDone.current = true
    }
  }, [duration, currentTime])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleEnd()
    }
    const handleGlobalTouchEnd = () => {
      if (isDragging) handleEnd()
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalTouchEnd)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [isDragging])

  return (
    <div className="absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 z-30 pointer-events-none">
      {/* Compteur à gauche */}
      {(isDesktop || showFrise) && (
        <div className="absolute left-4 top-[-25px] z-40 pointer-events-none">
          <div className="text-xs font-semibold text-black select-none">
            {formatTime(internalTime)}
          </div>
        </div>
      )}

      {/* Mute bouton à droite (desktop seulement) */}
      {isDesktop && (
        <div className="absolute right-4 top-[-20px] z-60 pointer-events-auto">
          {muteControl}
        </div>
      )}

      {/* Flèche à droite (mobile seulement, si showInfo) */}
      {!isDesktop && showInfo && (
        <div className="absolute right-4 top-[-30px] z-0 pointer-events-auto">
          <button
            onClick={() => {
              const container = document.querySelector('[data-infoscroll]')
              if (!container) return
              const slideWidth = window.innerWidth
              const maxScroll = slideWidth * 3
              const current = container.scrollLeft
              if (current >= maxScroll - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' })
              } else {
                container.scrollBy({ left: slideWidth, behavior: 'smooth' })
              }
            }}
            className="text-black bg-transparent p-0.5"
            aria-label="Slide suivante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Timeline */}
      <div
        ref={(el) => { wrapperRef.current = el; timelineRef.current = el }}
        className="w-full h-full overflow-hidden pointer-events-auto interactive-zone"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX)}
        data-cursor="timeline"
      >
        <div
          ref={friseRef}
          className={`absolute top-0 left-0 h-full flex items-center will-change-transform transition-opacity duration-500 ease-in-out interactive-zone ${showFrise ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: `${totalWidth}px` }}
        >
          {thumbs.map((thumb, index) => (
            <img
              key={index}
              src={thumb.src}
              alt={`thumb-${index}`}
              className="h-[60px] w-[50px] object-cover select-none"
              draggable="false"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
