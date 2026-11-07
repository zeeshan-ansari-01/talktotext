import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "@/store/store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
