import React, { useState } from 'react';

/**
 * Wrapper component that provides tactile feedback for touch interactions
 */
export default function TouchFeedback({ 
  children, 
  onPress, 
  className = '', 
  activeClassName = 'touch-active',
  disabled = false,
  ...props 
}) {
  const [isActive, setIsActive] = useState(false);
  
  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsActive(true);
  };
  
  const handleTouchEnd = (e) => {
    if (disabled) return;
    setIsActive(false);
    
    // Only trigger onPress if touch ends within the element
    if (onPress) {
      // Prevent default to avoid double-clicks or ghost clicks
      e.preventDefault();
      onPress(e);
    }
  };
  
  const handleTouchCancel = () => {
    setIsActive(false);
  };
  
  const handleClick = (e) => {
    if (disabled) return;
    // For desktop/mouse users
    if (onPress) {
      onPress(e);
    }
  };

  const baseClassName = `touch-feedback ${className} ${isActive ? activeClassName : ''} ${disabled ? 'disabled' : ''}`;
  
  return (
    <div
      className={baseClassName}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
      role={onPress ? "button" : undefined}
      tabIndex={onPress && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
}
