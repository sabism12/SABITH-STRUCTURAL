import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ReactLenis } from 'lenis/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <App />
    </ReactLenis>
  </StrictMode>,
);
