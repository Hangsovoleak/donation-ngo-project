/**
 * Software Framework: React (Frontend)
 * Description:
 *      Application entry point responsible for DOM mounting, 
 *      routing provider initialization, and performance monitoring.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global Styles
import './index.css';

// Root Component
import App from './App';

// Metrics
import reportWebVitals from './reportWebVitals';

/*------------------------------------------------------------------------------
                                INITIALIZATION
------------------------------------------------------------------------------*/

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * @brief Render application tree.
 */
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Performance tracking (optional)
reportWebVitals();
