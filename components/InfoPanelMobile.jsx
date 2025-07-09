'use client'

import { useEffect } from 'react'

export default function InfoPanelMobile({ onClose }) {
  useEffect(() => {
    document.body.classList.add('hide-title')
    return () => document.body.classList.remove('hide-title')
  }, [])

  const dashAnimation = `
    @keyframes dashDrop {
      0% { transform: scaleY(0); opacity: 0; }
      100% { transform: scaleY(1); opacity: 1; }
    }
  `

  const scrollNext = () => {
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
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500">
      <style jsx>{dashAnimation}</style>

      {/* Trait d’intro */}
      <div className="absolute top-0 left-0 right-0 px-5 z-10 md:hidden">
        <div className="relative">
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '-4px',
              height: '10px',
              width: '1px',
              backgroundColor: 'black',
              transformOrigin: 'top',
              transform: 'scaleY(0)',
              opacity: '0',
              animation: `dashDrop 0.3s forwards`,
              animationDelay: `0.2s`,
            }}
          />
        </div>
      </div>

      <div className="w-full h-full pointer-events-auto">
        <div
          className="flex md:grid md:grid-cols-4 overflow-x-auto snap-x snap-mandatory h-full text-[13px] md:text-xs pt-6 pb-12 text-black"
          data-infoscroll
        >
          {/* Slide 1 */}
          <div className="snap-start min-w-[100vw] px-4 leading-[1.2] whitespace-pre-line fade-start animate-fadein delay-1">
            <p className="font-semibold mb-1 text-[12px]">SAMY BOUARD CART</p>
            is a French director obsessed by image and its evocative power.  
            He works mainly on fashion campaigns, music documentaries  
            and feature films.

            <br /><br />
            <div className="space-y-0.5 mb-12">
              <p><span className="font-semibold">Mail:</span> info@samybouardcart.com</p>
              <p><span className="font-semibold">Instagram:</span> samybouardcart</p>
              <p><span className="font-semibold">Phone:</span> +33 6 01 25 14 03</p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="snap-start min-w-[100vw] px-4 pr-12 leading-[1.2] fade-start animate-fadein delay-2">
            <p className="font-semibold mb-2 text-[12px]">AWARDS AND DISTINCTIONS</p>
            {[{ year: '2022', price: 'Europe Film Festival', film: 'Symbiosis', location: 'Europe' },
              { year: '2021', price: 'FCAC', film: 'Symbiosis', location: 'Geneva' },
              { year: '2020', price: 'The Design Film Festival', film: 'The Last Resort', location: 'London' },
            ].map((item, i) => (
              <div key={i} className="space-y-0.5 mb-2">
                <p><span className="font-semibold">Year:</span> {item.year}</p>
                <p><span className="font-semibold">Price Name:</span> {item.price}</p>
                <p><span className="font-semibold">Film:</span> {item.film}</p>
                <p><span className="font-semibold">Location:</span> {item.location}</p>
              </div>
            ))}
          </div>

          {/* Slide 3 */}
          <div className="snap-start min-w-[100vw] px-4 pr-12 leading-[1.2] fade-start animate-fadein delay-3">
            <p className="font-semibold mb-2 text-[12px]">AWARDS AND DISTINCTIONS</p>
            {[{ year: '2019', price: 'Cineglobe International Film Festival', film: 'Rocca', location: 'Geneva' },
              { year: '2018', price: 'Prix de la Fondation BEA', film: 'Fractal Exploration', location: 'Geneva' }
            ].map((item, i) => (
              <div key={i} className="space-y-0.5 mb-2">
                <p><span className="font-semibold">Year:</span> {item.year}</p>
                <p><span className="font-semibold">Price Name:</span> {item.price}</p>
                <p><span className="font-semibold">Film:</span> {item.film}</p>
                <p><span className="font-semibold">Location:</span> {item.location}</p>
              </div>
            ))}
          </div>

          {/* Slide 4 */}
          <div className="snap-start min-w-[100vw] px-4 leading-snug fade-start animate-fadein delay-4">
            <p className="font-semibold text-[12px]">PORTFOLIO ↘</p>
          </div>
        </div>
      </div>
    </div>
  )
}
