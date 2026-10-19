import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import App from './App.tsx';
import './index.css';

// Smooth (eased) wheel scrolling only for people who haven't asked for reduced motion.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Scroll({ children }: { children: ReactNode }) {
  if (reduceMotion) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Scroll>
        <App />
      </Scroll>
    </MotionConfig>
  </StrictMode>,
);
