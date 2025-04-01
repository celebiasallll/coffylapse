/**
 * Global error handling utilities
 */
import { debugLog, errorLog } from './logUtils';

// Known error types
export const ERROR_TYPES = {
  NETWORK: 'NetworkError',
  WALLET: 'WalletError',
  TRANSACTION: 'TransactionError',
  STORAGE: 'StorageError',
  GAME_LOGIC: 'GameLogicError',
  AUTH: 'AuthenticationError',
  UNKNOWN: 'UnknownError'
};

// Error with categorization
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, details = {}) {
    super(message);
    this.name = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  
  // Create formatted error for display/logging
  format() {
    return {
      type: this.name,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined
    };
  }
}

// Create specific error instances
export const createNetworkError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.NETWORK, details);

export const createWalletError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.WALLET, details);

export const createTransactionError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.TRANSACTION, details);

export const createStorageError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.STORAGE, details);

export const createGameLogicError = (message, details = {}) => 
  new AppError(message, ERROR_TYPES.GAME_LOGIC, details);

// Format error for display to users
export const getUserFriendlyError = (error) => {
  // Default message
  let message = "Something went wrong. Please try again.";
  
  if (error instanceof AppError) {
    switch(error.name) {
      case ERROR_TYPES.NETWORK:
        message = "Network connection issue. Please check your internet connection and try again.";
        break;
      case ERROR_TYPES.WALLET:
        message = "Wallet connection issue. Please ensure your wallet is unlocked and try again.";
        break;
      case ERROR_TYPES.TRANSACTION:
        message = "Transaction failed. Please check your wallet and try again.";
        break;
      case ERROR_TYPES.STORAGE:
        message = "Data storage issue. Your progress might not be saved.";
        break;
      case ERROR_TYPES.GAME_LOGIC:
        message = "Game issue detected. Please refresh the page.";
        break;
      default:
        message = error.message || message;
    }
  } else if (error && typeof error === 'object') {
    // Handle standard errors or error-like objects
    message = error.message || message;
    
    // Detect common error patterns
    if (message.includes('User rejected') || message.includes('user rejected')) {
      message = "Transaction was rejected in your wallet.";
    } else if (message.includes('insufficient funds')) {
      message = "You don't have enough funds to complete this transaction.";
    }
  }
  
  return message;
};

// Global error handler
export const handleGlobalError = (error, { silent = false } = {}) => {
  const errorObj = error instanceof AppError ? error : new AppError(
    error?.message || "Unknown error occurred",
    ERROR_TYPES.UNKNOWN,
    { originalError: error }
  );
  
  // Log error
  errorLog(`${errorObj.name}: ${errorObj.message}`, errorObj);
  
  // In production, we could send to an error tracking service here
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(errorObj.format());
  }
  
  if (!silent) {
    // Display user-friendly message (could be replaced with UI notification)
    const userMessage = getUserFriendlyError(errorObj);
    if (typeof window !== 'undefined') {
      console.error(userMessage);
    }
  }
  
  return errorObj;
};

/**
 * Initialize global error handlers for better debugging
 */
export const initGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;

  // Override console.error to add more context
  const originalError = console.error;
  console.error = (...args) => {
    // Log original error
    originalError(...args);
    
    // Capture and format stack trace for easier debugging
    try {
      throw new Error('Console error stack trace');
    } catch (e) {
      originalError('Error occurred at:', e.stack.split('\n').slice(1, 4).join('\n'));
    }
  };

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.warn('Uncaught error:', event.error?.message || event.message);
    
    // Prevent default behavior to avoid full screen errors on mobile
    if (event.error?.message?.includes('Uncaught')) {
      event.preventDefault();
    }
    
    // You can implement error reporting here
    // reportErrorToAnalytics(event.error);
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    
    // You can implement error reporting here
    // reportErrorToAnalytics(event.reason);
  });

  debugLog('Global error handlers initialized');
};

/**
 * Safe function execution with error handling
 */
export const tryCatch = (fn, fallback = null, errorHandler = console.error) => {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    }
    return fallback;
  }
};

export default {
  ERROR_TYPES,
  AppError,
  createNetworkError,
  createWalletError,
  createTransactionError,
  createStorageError,
  createGameLogicError,
  getUserFriendlyError,
  handleGlobalError,
  initGlobalErrorHandlers,
  tryCatch
};
