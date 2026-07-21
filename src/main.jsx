import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
        <ToastProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </ToastProvider>
    </ErrorBoundary>
  </BrowserRouter>,
)
