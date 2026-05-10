import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// COMPREHENSIVE TYPES & INTERFACES FOR ADVANCED WINDOW TRACKING
// ============================================================================

export interface WindowDimensions {
  width: number;
  height: number;
  outerWidth: number;
  outerHeight: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
}

export interface ScrollState {
  scrollY: number;
  scrollX: number;
  maxScrollY: number;
  maxScrollX: number;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  isScrollingLeft: boolean;
  isScrollingRight: boolean;
  scrollProgressY: number; // 0 to 1
  scrollProgressX: number; // 0 to 1
}

export interface ResponsiveState {
  isMobileSmall: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopSmall: boolean;
  isDesktop: boolean;
  isDesktopLarge: boolean;
  is4k: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  isSquare: boolean;
  aspectRatio: number;
}

export interface DeviceFeatures {
  hasTouch: boolean;
  hasMouse: boolean;
  isRetina: boolean;
  prefersDarkMode: boolean;
  prefersReducedMotion: boolean;
  prefersContrast: boolean;
  connectionType: string;
  isOnline: boolean;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isPWA: boolean;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
}

export interface AdvancedWindowState extends WindowDimensions, ScrollState, ResponsiveState, DeviceFeatures {
  timestamp: number;
  resizeCount: number;
  scrollCount: number;
  lastScrollDirection: 'up' | 'down' | 'left' | 'right' | 'none';
  idleTime: number; // in milliseconds
  isIdle: boolean;
  pointerX: number;
  pointerY: number;
}

export interface UseAdvancedWindowOptions {
  debounceDelay?: number;
  throttleDelay?: number;
  idleTimeout?: number;
  trackScroll?: boolean;
  trackPointer?: boolean;
  trackDeviceFeatures?: boolean;
}

// ============================================================================
// BREAKPOINT CONSTANTS & MEDIA QUERIES
// ============================================================================

const BREAKPOINTS = {
  MOBILE_SMALL_MAX: 375,
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_SMALL_MIN: 1024,
  DESKTOP_SMALL_MAX: 1439,
  DESKTOP_MIN: 1440,
  DESKTOP_LARGE_MIN: 1920,
  UHD_4K_MIN: 3840,
};

const QUERIES = {
  DARK_MODE: '(prefers-color-scheme: dark)',
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
  HIGH_CONTRAST: '(prefers-contrast: more)',
  TOUCH: '(hover: none) and (pointer: coarse)',
  MOUSE: '(hover: hover) and (pointer: fine)',
  DISPLAY_STANDALONE: '(display-mode: standalone)',
};

// ============================================================================
// HELPER UTILITIES FOR STATE DERIVATION
// ============================================================================

const getSafeWindowProperty = (prop: keyof Window | keyof Screen, fallback: number = 0): number => {
  if (typeof window === 'undefined') return fallback;
  if (prop in window) return Number(window[prop as keyof Window]) || fallback;
  if (window.screen && prop in window.screen) return Number(window.screen[prop as keyof Screen]) || fallback;
  return fallback;
};

const calculateScrollState = (
  prev: ScrollState | null,
  currentX: number,
  currentY: number,
  docWidth: number,
  docHeight: number,
  winWidth: number,
  winHeight: number
): ScrollState => {
  const maxScrollY = Math.max(0, docHeight - winHeight);
  const maxScrollX = Math.max(0, docWidth - winWidth);
  
  const scrollProgressY = maxScrollY > 0 ? Math.min(1, Math.max(0, currentY / maxScrollY)) : 0;
  const scrollProgressX = maxScrollX > 0 ? Math.min(1, Math.max(0, currentX / maxScrollX)) : 0;

  const isScrollingUp = prev ? currentY < prev.scrollY : false;
  const isScrollingDown = prev ? currentY > prev.scrollY : false;
  const isScrollingLeft = prev ? currentX < prev.scrollX : false;
  const isScrollingRight = prev ? currentX > prev.scrollX : false;

  return {
    scrollY: currentY,
    scrollX: currentX,
    maxScrollY,
    maxScrollX,
    isScrollingUp,
    isScrollingDown,
    isScrollingLeft,
    isScrollingRight,
    scrollProgressY,
    scrollProgressX,
  };
};

const calculateResponsiveState = (width: number, height: number): ResponsiveState => {
  const aspectRatio = height > 0 ? width / height : 1;
  return {
    isMobileSmall: width <= BREAKPOINTS.MOBILE_SMALL_MAX,
    isMobile: width <= BREAKPOINTS.MOBILE_MAX,
    isTablet: width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX,
    isDesktopSmall: width >= BREAKPOINTS.DESKTOP_SMALL_MIN && width <= BREAKPOINTS.DESKTOP_SMALL_MAX,
    isDesktop: width >= BREAKPOINTS.DESKTOP_MIN && width < BREAKPOINTS.DESKTOP_LARGE_MIN,
    isDesktopLarge: width >= BREAKPOINTS.DESKTOP_LARGE_MIN && width < BREAKPOINTS.UHD_4K_MIN,
    is4k: width >= BREAKPOINTS.UHD_4K_MIN,
    isLandscape: width > height,
    isPortrait: height > width,
    isSquare: width === height,
    aspectRatio,
  };
};

const checkMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
};

// ============================================================================
// CUSTOM HOOK IMPLEMENTATION
// ============================================================================

/**
 * An enterprise-grade, comprehensive custom React hook that tracks almost 
 * everything about the browser window, device capabilities, scroll positions,
 * media queries, idle status, pointer coordinates, and network status.
 * 
 * Performance is handled via precise debouncing, requestAnimationFrame throttling,
 * and passive event listeners.
 * 
 * @param options - Configuration object for toggling tracking features and delays
 * @returns Comprehensive window state object (AdvancedWindowState)
 */
export const useWindowSize = (options: UseAdvancedWindowOptions = {}): AdvancedWindowState => {
  const {
    debounceDelay = 200,
    throttleDelay = 50, // not directly used with rAF, but conceptually representing threshold
    idleTimeout = 60000, // 1 minute
    trackScroll = true,
    trackPointer = true,
    trackDeviceFeatures = true,
  } = options;

  // Track previous scroll for directional calc
  const prevScrollRef = useRef<ScrollState | null>(null);
  
  // Track idle timer
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Core State Initialization
  const [state, setState] = useState<AdvancedWindowState>(() => {
    // Determine initial dimensions safely
    const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const height = typeof window !== 'undefined' ? window.innerHeight : 900;
    
    // Initial responsive
    const resp = calculateResponsiveState(width, height);
    
    // Initial scroll
    const scroll: ScrollState = {
      scrollY: 0, scrollX: 0, maxScrollY: 0, maxScrollX: 0,
      isScrollingUp: false, isScrollingDown: false, 
      isScrollingLeft: false, isScrollingRight: false,
      scrollProgressY: 0, scrollProgressX: 0
    };

    // Initial Features
    const feats: DeviceFeatures = {
      hasTouch: false, hasMouse: true, isRetina: false,
      prefersDarkMode: false, prefersReducedMotion: false, prefersContrast: false,
      connectionType: 'unknown', isOnline: true, batteryLevel: null, isCharging: null,
      isPWA: false, isFullscreen: false, isPictureInPicture: false
    };

    return {
      width, height,
      outerWidth: width, outerHeight: height,
      availWidth: width, availHeight: height,
      colorDepth: 24, pixelDepth: 24, devicePixelRatio: 1,
      ...scroll, ...resp, ...feats,
      timestamp: Date.now(), resizeCount: 0, scrollCount: 0,
      lastScrollDirection: 'none', idleTime: 0, isIdle: false,
      pointerX: 0, pointerY: 0
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let isScrollTicking = false;
    let isPointerTicking = false;
    let localResizeCount = 0;
    let localScrollCount = 0;

    // ------------------------------------------------------------------------
    // FEATURE DETECTION
    // ------------------------------------------------------------------------
    const detectFeatures = (): DeviceFeatures => {
      const isRetina = window.devicePixelRatio > 1;
      const prefersDarkMode = checkMediaQuery(QUERIES.DARK_MODE);
      const prefersReducedMotion = checkMediaQuery(QUERIES.REDUCED_MOTION);
      const prefersContrast = checkMediaQuery(QUERIES.HIGH_CONTRAST);
      const hasTouch = checkMediaQuery(QUERIES.TOUCH) || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      const hasMouse = checkMediaQuery(QUERIES.MOUSE);
      const isPWA = checkMediaQuery(QUERIES.DISPLAY_STANDALONE) || (window.navigator as any).standalone;
      const isFullscreen = !!document.fullscreenElement;
      
      // Connection
      let connectionType = 'unknown';
      const nav: any = navigator;
      if (nav.connection) {
        connectionType = nav.connection.effectiveType || nav.connection.type || 'unknown';
      }

      return {
        hasTouch, hasMouse, isRetina, prefersDarkMode, prefersReducedMotion, prefersContrast,
        connectionType, isOnline: navigator.onLine, batteryLevel: state.batteryLevel, 
        isCharging: state.isCharging, isPWA, isFullscreen, isPictureInPicture: false
      };
    };

    // ------------------------------------------------------------------------
    // RESIZE HANDLER (Debounced)
    // ------------------------------------------------------------------------
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      
      resizeTimer = setTimeout(() => {
        localResizeCount++;
        setState(prev => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const resp = calculateResponsiveState(w, h);
          const feats = trackDeviceFeatures ? detectFeatures() : {};
          
          return {
            ...prev,
            width: w, height: h,
            outerWidth: window.outerWidth, outerHeight: window.outerHeight,
            availWidth: window.screen.availWidth, availHeight: window.screen.availHeight,
            devicePixelRatio: window.devicePixelRatio,
            ...resp,
            ...feats,
            resizeCount: localResizeCount,
            timestamp: Date.now(),
            isIdle: false,
          };
        });
      }, debounceDelay);
    };

    // ------------------------------------------------------------------------
    // SCROLL HANDLER (Throttled via rAF)
    // ------------------------------------------------------------------------
    const handleScroll = () => {
      if (!trackScroll) return;
      if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
          localScrollCount++;
          
          setState(prev => {
            const doc = document.documentElement;
            const scroll = calculateScrollState(
              prev, window.scrollX, window.scrollY, 
              doc.scrollWidth, doc.scrollHeight, window.innerWidth, window.innerHeight
            );
            
            let lastDir: 'up'|'down'|'left'|'right'|'none' = prev.lastScrollDirection;
            if (scroll.isScrollingUp) lastDir = 'up';
            else if (scroll.isScrollingDown) lastDir = 'down';
            else if (scroll.isScrollingLeft) lastDir = 'left';
            else if (scroll.isScrollingRight) lastDir = 'right';

            return {
              ...prev,
              ...scroll,
              scrollCount: localScrollCount,
              lastScrollDirection: lastDir,
              timestamp: Date.now(),
              isIdle: false,
            };
          });
          
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    };

    // ------------------------------------------------------------------------
    // POINTER/MOUSE MOVE HANDLER
    // ------------------------------------------------------------------------
    const handlePointerMove = (e: MouseEvent) => {
      if (!trackPointer) return;
      if (!isPointerTicking) {
        window.requestAnimationFrame(() => {
          setState(prev => ({
            ...prev,
            pointerX: e.clientX,
            pointerY: e.clientY,
            isIdle: false,
          }));
          isPointerTicking = false;
          resetIdleTimer();
        });
        isPointerTicking = true;
      }
    };

    // ------------------------------------------------------------------------
    // IDLE TIMER LOGIC
    // ------------------------------------------------------------------------
    const setIdle = () => {
      setState(prev => ({ ...prev, isIdle: true }));
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(setIdle, idleTimeout);
    };

    // Interaction handlers to reset idle timer
    const handleInteraction = () => {
      setState(prev => prev.isIdle ? { ...prev, isIdle: false, timestamp: Date.now() } : prev);
      resetIdleTimer();
    };

    // ------------------------------------------------------------------------
    // NETWORK STATUS HANDLERS
    // ------------------------------------------------------------------------
    const handleOnline = () => setState(p => ({ ...p, isOnline: true }));
    const handleOffline = () => setState(p => ({ ...p, isOnline: false }));

    // ------------------------------------------------------------------------
    // INITIALIZATION & EVENT BINDING
    // ------------------------------------------------------------------------
    
    // Initial update for features
    if (trackDeviceFeatures) {
      setState(p => ({ ...p, ...detectFeatures() }));
    }
    
    resetIdleTimer();

    // Attach listeners
    window.addEventListener('resize', handleResize, { passive: true });
    if (trackScroll) window.addEventListener('scroll', handleScroll, { passive: true });
    if (trackPointer) window.addEventListener('mousemove', handlePointerMove, { passive: true });
    
    // Interaction listeners
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    
    // Network listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery Status API (if supported)
    const nav: any = navigator;
    if (trackDeviceFeatures && nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        setState(p => ({ 
          ...p, 
          batteryLevel: battery.level, 
          isCharging: battery.charging 
        }));
        
        battery.addEventListener('levelchange', () => {
          setState(p => ({ ...p, batteryLevel: battery.level }));
        });
        battery.addEventListener('chargingchange', () => {
          setState(p => ({ ...p, isCharging: battery.charging }));
        });
      }).catch(() => { /* ignore */ });
    }

    // Media Query Listeners for dynamic theme changes
    const darkModeMq = window.matchMedia(QUERIES.DARK_MODE);
    const motionMq = window.matchMedia(QUERIES.REDUCED_MOTION);
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setState(p => ({ ...p, prefersDarkMode: e.matches }));
    };
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(p => ({ ...p, prefersReducedMotion: e.matches }));
    };

    if (darkModeMq.addEventListener) {
      darkModeMq.addEventListener('change', handleThemeChange);
      motionMq.addEventListener('change', handleMotionChange);
    } else if (darkModeMq.addListener) { // Legacy Safari
      darkModeMq.addListener(handleThemeChange);
      motionMq.addListener(handleMotionChange);
    }

    // Fullscreen listeners
    const handleFullscreen = () => {
      setState(p => ({ ...p, isFullscreen: !!document.fullscreenElement }));
    };
    document.addEventListener('fullscreenchange', handleFullscreen);

    // ------------------------------------------------------------------------
    // CLEANUP
    // ------------------------------------------------------------------------
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('fullscreenchange', handleFullscreen);

      if (darkModeMq.removeEventListener) {
        darkModeMq.removeEventListener('change', handleThemeChange);
        motionMq.removeEventListener('change', handleMotionChange);
      } else if (darkModeMq.removeListener) {
        darkModeMq.removeListener(handleThemeChange);
        motionMq.removeListener(handleMotionChange);
      }
    };
  }, [debounceDelay, throttleDelay, idleTimeout, trackScroll, trackPointer, trackDeviceFeatures]);

  return state;
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default useWindowSize;
