import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FinApp} from "./FinApp"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FinApp />
  </StrictMode>,
)
