'use client'

import { useEffect, useState } from 'react'

export default function VideoPlayer({ onTimeUpdate, videoRef, showInfo, toggleInfo }) {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const current = video.currentTime
      const duration = video.duration
      onTimeUpdate(current, duration)
    }

    const handleLoadedMetadata = () => {
      const current = video.currentTime
      const duration = video.duration
      onTimeUpdate(current, duration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [onTimeUpdate, videoRef])

  const videoSrc = isDesktop
    ? '/video/SBC_Showreel_Home.mp4'
    : '/video/SBC_Showreel_Mobile.mp4'

  const handleVideoClick = (e) => {
    if (isDesktop && !showInfo) {
      toggleInfo()
    } else if (isDesktop && showInfo) {
      toggleInfo()
    }
  }

  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      {/* Clique sur la vidéo → toggleInfo (desktop only) */}
      <div className="absolute inset-0 z-10" onClick={handleVideoClick} />

      {/* Fond blanc semi-transparent quand le panneau est ouvert */}
      {showInfo && (
        <div className="absolute inset-0 z-10 bg-white/40 pointer-events-none transition-opacity duration-100" />
      )}

      {/* Vidéo centrée */}
      <div
        className={`w-full h-full flex justify-center items-center transition duration-100 will-change-transform ${
          showInfo ? 'blur-xl scale-[1.001]' : ''
        }`}
      >
        <video
          ref={videoRef}
          className={`${
            isDesktop ? 'max-w-[80%] max-h-[80%]' : 'w-full h-full object-cover'
          } pointer-events-none`}
          autoPlay
          loop
          muted
          playsInline
          key={videoSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
