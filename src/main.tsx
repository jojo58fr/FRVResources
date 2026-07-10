import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import '@fontsource/geist-sans/latin.css'
import '@fontsource/geist-mono/latin.css'
import './styles/main.scss'

const root = document.getElementById('app')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
}
