import { useState, useEffect } from 'react';
import { isMobileDevice } from '../utils/mobileUtils';

/**
 * Hook to detect if the current device is mobile
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export default function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Set initial value
    setIsMobile(isMobileDevice());
    
    // Also update when window is resized
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return isMobile;
}
