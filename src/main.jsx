import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

// Load testing utilities (non-blocking)
try {
  import('./utils/datasetTestUtils.js');
} catch (error) {
  console.warn('Dataset utilities not available:', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
