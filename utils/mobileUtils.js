/**
 * Utilities for mobile device optimization
 */

// Detect if the device is mobile
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (window.innerWidth <= 768);
};

// Handle viewport height issues on mobile browsers
export const fixMobileVh = () => {
  if (typeof window !== 'undefined') {
    // Set CSS variable for real viewport height
    const setVhVariable = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Also set additional variables for different percentages
      document.documentElement.style.setProperty('--vh-50', `${window.innerHeight * 0.5}px`);
      document.documentElement.style.setProperty('--vh-75', `${window.innerHeight * 0.75}px`);
      document.documentElement.style.setProperty('--vh-90', `${window.innerHeight * 0.9}px`);
    };
    
    // Initial set
    setVhVariable();
    
    // Update on resize and orientation change with throttling
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setVhVariable();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // For orientation change, wait a bit longer
      setTimeout(setVhVariable, 200);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }
};

// Completely disable overscroll/bouncing effect
export const preventOverscroll = () => {
  if (typeof document !== 'undefined') {
    // Add touch handling for entire body
    document.body.style.overscrollBehavior = 'none';
    
    // Prevent default touch moves on body unless element is marked as scrollable
    const preventBodyTouchMove = (e) => {
      if (!e.target.closest('.scrollable') && 
          !e.target.classList.contains('scrollable')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventBodyTouchMove, { 
      passive: false 
    });
    
    // Fix for iOS momentum scrolling in overflow elements
    const scrollableElements = document.querySelectorAll('.scrollable');
    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
    });
    
    // Return cleanup function
    return () => {
      document.removeEventListener('touchmove', preventBodyTouchMove);
    };
  }
};

// Fix for safe area insets on notched devices
export const applySafeAreaInsets = () => {
  if (typeof document !== 'undefined') {
    const updateSafeAreaVariables = () => {
      // Check for env() support and apply if available
      try {
        // Test if CSS.supports exists and if it supports env()
        if (
          window.CSS && 
          window.CSS.supports && 
          window.CSS.supports('padding-bottom', 'env(safe-area-inset-bottom)')
        ) {
          document.body.classList.add('has-safe-area-support');
          
          // Update custom properties if needed
          document.documentElement.style.setProperty(
            '--safe-area-inset-top', 
            'env(safe-area-inset-top)'
          );
          document.documentElement.style.setProperty(
            '--safe-area-inset-bottom', 
            'env(safe-area-inset-bottom)'
          );
        } else {
          document.body.classList.add('no-safe-area-support');
        }
      } catch (e) {
        console.warn('Could not detect safe area support', e);
      }
    };
    
    updateSafeAreaVariables();
    window.addEventListener('resize', updateSafeAreaVariables);
    
    return () => {
      window.removeEventListener('resize', updateSafeAreaVariables);
    };
  }
};

// Fix iOS keyboard issues
export const fixMobileKeyboard = () => {
  if (typeof document === 'undefined') return;
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // Handle iOS keyboard appearing and disappearing
    const inputs = document.querySelectorAll('input, textarea, select');
    
    const handleFocus = () => {
      // Add a small delay to allow keyboard to appear fully
      setTimeout(() => {
        // Scroll to the focused element
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'INPUT' || 
            focusedElement.tagName === 'TEXTAREA' || 
            focusedElement.tagName === 'SELECT') {
          
          focusedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 300);
    };
    
    const handleBlur = () => {
      // Force window to scroll back to top when input is blurred
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }
};

// Improve passive scrolling performance
export const optimizeScrolling = () => {
  if (typeof window === 'undefined') return;
  
  // Add passive listener for all scroll events where possible
  const supportsPassive = (() => {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return true;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) { /* ignore */ }
    return passiveSupported;
  })();
  
  const options = supportsPassive ? { passive: true } : false;
  
  // Apply passive scroll listeners to common scroll elements
  document.querySelectorAll('.scrollable').forEach(el => {
    el.addEventListener('scroll', null, options);
    el.addEventListener('touchstart', null, options);
  });
  
  // Main window scroll
  window.addEventListener('scroll', null, options);
};

// Main function to initialize all mobile optimizations
export const initMobileOptimizations = () => {
  const cleanupFunctions = [];
  
  // Fix vh units
  const cleanupVh = fixMobileVh();
  if (cleanupVh) cleanupFunctions.push(cleanupVh);
  
  // Prevent overscrolling
  const cleanupOverscroll = preventOverscroll();
  if (cleanupOverscroll) cleanupFunctions.push(cleanupOverscroll);
  
  // Handle safe area insets
  const cleanupSafeArea = applySafeAreaInsets();
  if (cleanupSafeArea) cleanupFunctions.push(cleanupSafeArea);
  
  // Fix iOS keyboard
  const cleanupKeyboard = fixMobileKeyboard();
  if (cleanupKeyboard) cleanupFunctions.push(cleanupKeyboard);
  
  // Optimize scrolling
  optimizeScrolling();
  
  // Add additional class for mobile-specific styling
  if (isMobileDevice()) {
    document.documentElement.classList.add('is-mobile-device');
  }
  
  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') cleanup();
    });
  };
};

export default {
  isMobileDevice,
  fixMobileVh,
  preventOverscroll,
  applySafeAreaInsets,
  fixMobileKeyboard,
  optimizeScrolling,
  initMobileOptimizations
};
