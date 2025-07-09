'use client'

import { useRef, useState, useEffect } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import TimelineScroll from '../components/TimelineScroll'
import InfoPanel from '../components/InfoPanel'
import InfoPanelMobile from '../components/InfoPanelMobile'
import TimelineText from '../components/TimelineText'

export default function Home() {
  const [showInfo, setShowInfo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [isDesktop, setIsDesktop] = useState(true)

  const videoRef = useRef(null)

  const toggleInfo = () => setShowInfo(prev => !prev)

  useEffect(() => {
    const checkScreen = () => {
      const isDesk = window.innerWidth >= 1024
      setIsDesktop(isDesk)
      document.body.classList.toggle('is-desktop', isDesk)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  const handleTimeUpdate = (current, total) => {
    setCurrentTime(current)
    setDuration(total)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      <VideoPlayer
        onTimeUpdate={handleTimeUpdate}
        videoRef={videoRef}
        showInfo={showInfo}
        toggleInfo={toggleInfo}
      />

      <div
        className={`home-title absolute z-30 text-xs font-semibold tracking-widest text-black transition-all duration-500 ${
          isDesktop
            ? `top-5 ${showInfo ? 'left-4 text-left' : 'left-1/2 -translate-x-1/2 text-center'}`
            : 'top-5 left-4'
        }`}
      >
        SAMY BOUARD CART
      </div>

      <TimelineScroll
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        isPlaying={isPlaying}
        videoRef={videoRef}
        onScrollUpdate={(x) => {
          if (typeof x === 'number' && !isNaN(x)) setScrollX(x)
        }}
        muteControl={
          isDesktop && (
            <div data-cursor="none" className="pointer-events-auto">
              <button
                onClick={toggleMute}
                className={`text-xs tracking-widest text-black bg-transparent hover:opacity-70 font-semibold ${
                  isMuted ? '' : 'italic'
                }`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          )
        }
        showInfo={showInfo}
      />

      {isDesktop && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={togglePlay}
            data-cursor="none"
            className={`text-xs tracking-widest text-black bg-transparent hover:opacity-70 font-semibold ${
              isPlaying ? '' : 'italic'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}

      {showInfo && <TimelineText scrollX={scrollX} showInfo={showInfo} />}

      {!isDesktop && (
        <>
          <button
            onClick={togglePlay}
            className={`fixed bottom-4 left-4 z-50 text-xs text-black bg-transparent font-semibold ${
              isPlaying ? '' : 'italic'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="fixed bottom-4 right-4 z-50 md:hidden">
            <button
              onClick={toggleMute}
              className={`text-xs text-black bg-transparent font-semibold ${
                isMuted ? '' : 'italic'
              }`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </>
      )}

      {showInfo && (
        isDesktop ? (
          <InfoPanel onClose={toggleInfo} />
        ) : (
          <InfoPanelMobile onClose={toggleInfo} />
        )
      )}

      {!isDesktop && (
        <div className="fixed top-3 right-4 z-50 md:hidden">
          <button
            onClick={toggleInfo}
            className="text-black text-[26px] leading-none transition-transform duration-300"
            aria-label={showInfo ? 'Fermer le panneau info' : 'Ouvrir le panneau info'}
            style={{ transform: showInfo ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
