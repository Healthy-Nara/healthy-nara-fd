import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RestrictPage from './components/RestrictPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <RestrictPage />
  </StrictMode>,
)
