import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface WindowDimensions {
  width: number;
  height: number;
}

export interface WindowState extends WindowDimensions {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  scrollY: number;
  scrollX: number;
}

interface UseWindowSizeOptions {
  debounceDelay?: number;
  throttleDelay?: number;
}

// ============================================================================
// BREAKPOINT CONSTANTS
// ============================================================================

const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
};

// ============================================================================
// CUSTOM HOOK IMPLEMENTATION
// ============================================================================

/**
 * An advanced custom React hook that tracks window dimensions, 
 * device orientation, scroll position, and responsive breakpoints.
 * 
 * Includes built-in debouncing/throttling for performance optimization.
 * 
 * @param options - Configuration object for debounce/throttle delays
 * @returns Comprehensive window state object
 */
export const useWindowSize = (options: UseWindowSizeOptions = {}): WindowState => {
  const { debounceDelay = 150 } = options;

  // Initialize state with default values (safe for SSR)
  const [windowState, setWindowState] = useState<WindowState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLandscape: true,
    isPortrait: false,
    scrollY: 0,
    scrollX: 0,
  });

  // Helper to derive responsive properties from raw dimensions
  const deriveStateFromDimensions = useCallback((width: number, height: number, scrollX: number, scrollY: number): WindowState => {
    return {
      width,
      height,
      scrollX,
      scrollY,
      isMobile: width <= BREAKPOINTS.MOBILE_MAX,
      isTablet: width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX,
      isDesktop: width >= BREAKPOINTS.DESKTOP_MIN,
      isLandscape: width > height,
      isPortrait: height >= width,
    };
  }, []);

  useEffect(() => {
    // Safety check for SSR environment
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isTicking = false;

    // The actual update function
    const updateState = () => {
      setWindowState(
        deriveStateFromDimensions(
          window.innerWidth,
          window.innerHeight,
          window.scrollX,
          window.scrollY
        )
      );
    };

    // Initialize immediately on mount
    updateState();

    // Resize event handler with Debounce
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updateState();
      }, debounceDelay);
    };

    // Scroll event handler with RequestAnimationFrame (Throttling)
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          setWindowState(prevState => ({
            ...prevState,
            scrollY: window.scrollY,
            scrollX: window.scrollX,
          }));
          isTicking = false;
        });
        isTicking = true;
      }
    };

    // Orientation change handler
    const handleOrientationChange = () => {
      // Slight delay to ensure window dimensions have updated after rotation
      setTimeout(updateState, 100);
    };

    // Attach event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Modern browsers use 'change' on visualViewport, but fallback to orientationchange
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    // Cleanup phase
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debounceDelay, deriveStateFromDimensions]);

  return windowState;
};

// ============================================================================
// EXPORT DEFAULT (Optional alias)
// ============================================================================
export default useWindowSize;
