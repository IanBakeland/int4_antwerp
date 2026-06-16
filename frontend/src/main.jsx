import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/Stylesheets/reset.css'
import './assets/Stylesheets/style.css';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
