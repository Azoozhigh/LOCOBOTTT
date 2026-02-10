import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Successfully initiated render, handle loader cleanup
  const hideLoader = () => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      // Completely remove from DOM after fade out to free resources
      setTimeout(() => loader.remove(), 1000);
    }
  };

  // Ensure DOM is ready before removing loader
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
} catch (error) {
  console.error("LOCOBOT Synthesis Failed:", error);
  const loader = document.getElementById('initial-loader');
  if (loader) {
    const statusText = loader.querySelector('.text-white/50');
    if (statusText) statusText.textContent = "SYNTHESIS INTERRUPTED: CHECK CONSOLE";
  }
}
