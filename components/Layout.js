import { useEffect, useState } from 'react';
import Head from 'next/head';
import { isMobileDevice } from '../utils/mobileUtils';

export default function Layout({ children, title = 'CoffyLapse' }) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect mobile device on client side
    setIsMobile(isMobileDevice());
    
    // Add body classes for better styling
    document.body.classList.add('layout-initialized');
    if (isMobileDevice()) {
      document.body.classList.add('is-mobile');
    }
    
    // Fix for iOS Safari to prevent content shift when soft keyboard appears
    const inputs = document.querySelectorAll('input, textarea, select');
    const handleFocusIn = () => {
      // Add class to prevent unwanted scrolling behaviors
      document.body.classList.add('input-focused');
    };
    
    const handleFocusOut = () => {
      // Remove class when input is no longer focused
      document.body.classList.remove('input-focused');
      
      // For iOS, prevent content jump when keyboard closes
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };
    
    inputs.forEach(input => {
      input.addEventListener('focusin', handleFocusIn);
      input.addEventListener('focusout', handleFocusOut);
    });
    
    // Prevent pull-to-refresh on mobile browsers
    let startY;
    const handleTouchStart = (e) => {
      startY = e.touches[0].pageY;
    };
    
    const handleTouchMove = (e) => {
      const y = e.touches[0].pageY;
      // Prevent overscroll only when scrolled to top and pulling down
      if (window.scrollY === 0 && y > startY) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focusin', handleFocusIn);
        input.removeEventListener('focusout', handleFocusOut);
      });
      
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Head>
      
      <div className={`app-container ${isMobile ? 'mobile-view' : ''}`}>
        <main className="content-wrapper vh-fix no-bounce">
          {children}
        </main>
        
        {/* Safe area spacer for bottom notch on iOS */}
        <div className="safe-area-bottom-spacer"></div>
      </div>
    </>
  );
}
