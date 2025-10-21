import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { DatabaseProvider } from './contexts/DatabaseContext.tsx' // <-- 1. Import this

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DatabaseProvider> {/* <-- 2. Wrap your App */}
        <App />
      </DatabaseProvider>
    </ThemeProvider>
  </React.StrictMode>,
)