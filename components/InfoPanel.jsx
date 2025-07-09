'use client'

export default function InfoPanel({ onClose }) {
  const dashAnimation = `
    @keyframes dashDrop {
      0% { transform: scaleY(0); opacity: 0; }
      100% { transform: scaleY(1); opacity: 1; }
    }
  `;

  return (
    <div
      className="absolute inset-0 z-10 transition-opacity duration-500"
      onClick={onClose}
    >
      <style jsx>{dashAnimation}</style>

      {/* Dashs d’animation en haut */}
      <div className="absolute top-0 left-0 right-0 px-4 z-30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-30">
          {[0.2, 0.4, 0.6, 0.8].map((delay, index) => (
            <div className="relative" key={index}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                height: '14px',
                width: '1px',
                backgroundColor: 'black',
                transformOrigin: 'top',
                transform: 'scaleY(0)',
                opacity: '0',
                animation: `dashDrop 0.3s forwards`,
                animationDelay: `${delay}s`
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Texte cliquable pour scroll, mais ne ferme pas le panneau */}
      <div className="flex flex-col text-black px-4 pb-10 pt-5 text-xs overflow-y-auto h-full w-full">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-30 items-start">

          <div
            className="fade-start animate-fadein delay-1 whitespace-pre-line leading-relaxed relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-6"></p>
            is a French director obsessed by image and its evocative power.  
            He works mainly on fashion campaigns, music documentaries  
            and feature films.

            <br /><br />
            <div className="space-y-0.2 mb-13">
              <p><span className="font-semibold">Mail:</span> info@samybouardcart.com</p>
              <p><span className="font-semibold">Instagram:</span> samybouardcart</p>
              <p><span className="font-semibold">Phone:</span> +33 6 01 25 14 03</p>
            </div>
          </div>

          <div
            className="fade-start animate-fadein delay-2 leading-tight relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-2">AWARDS</p>
            {[{ year: '2022', price: 'Europe Film Festival', film: 'Symbiosis', location: 'Europe' },
              { year: '2021', price: 'FCAC', film: 'Symbiosis', location: 'Geneva' }
            ].map((award, i) => (
              <div key={i} className="space-y-0.5 mb-3">
                <p><span className="font-semibold">Year:</span> {award.year}</p>
                <p><span className="font-semibold">Price Name:</span> {award.price}</p>
                <p><span className="font-semibold">Film:</span> {award.film}</p>
                <p><span className="font-semibold">Location:</span> {award.location}</p>
              </div>
            ))}
          </div>

          <div
            className="fade-start animate-fadein delay-3 leading-tight relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-2">DISTINCTIONS</p>
            {[{
              year: '2020', price: 'The Design Film Festival', film: 'The Last Resort', location: 'London'
            }, {
              year: '2019', price: 'Cineglobe International Film Festival', film: 'Rocca', location: 'Geneva'
            }, {
              year: '2018', price: 'Prix de la Fondation BEA', film: 'Fractal Exploration', location: 'Geneva'
            }].map((award, i) => (
              <div key={i} className="space-y-0.5 mb-3">
                <p><span className="font-semibold">Year:</span> {award.year}</p>
                <p><span className="font-semibold">Price Name:</span> {award.price}</p>
                <p><span className="font-semibold">Film:</span> {award.film}</p>
                <p><span className="font-semibold">Location:</span> {award.location}</p>
              </div>
            ))}
          </div>

          <div
            className="fade-start animate-fadein delay-4 leading-relaxed relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold">PORTFOLIO ↘</p>
          </div>

        </div>
      </div>
    </div>
  )
}
