import "@/styles/globals.css"
import CustomCursor from "@/components/CustomCursor"
import { useState } from "react"

export default function App({ Component, pageProps }) {
  const [showInfo, setShowInfo] = useState(false)

  const toggleInfo = () => setShowInfo(prev => !prev)

  return (
    <div className="cursor-none">
      <CustomCursor isOpen={showInfo} onClick={toggleInfo} />
      <Component {...pageProps} showInfo={showInfo} toggleInfo={toggleInfo} />
    </div>
  )
}
