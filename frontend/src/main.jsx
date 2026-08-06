import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initViewportScale } from './styles/viewportScale.js'
import { initLenis } from './motion/lenis.js'

initViewportScale()
initLenis()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
