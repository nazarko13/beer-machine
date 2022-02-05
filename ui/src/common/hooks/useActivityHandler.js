import { useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

const EVENTS = [
  'click',
  'dblclick',
  'mousewheel',
  'contextmenu',
  'touchstart',
  'touchmove',
  'keypress',
  'scroll',
  'resize',
  'hashchange',
  'load',
];

// seconds count * milliseconds
const INACTIVITY_HANDLER_DELAY = 30 * 1000;

const useActivityHandler = (
  ref,
  inactivityHandler = () => null,
  delay = INACTIVITY_HANDLER_DELAY
) => {
  const elementRef = useRef(null);
  const previousTimerId = useRef(null);

  const eventHandler = useCallback(() => {
    if (previousTimerId.current) {
      clearTimeout(previousTimerId.current);
    }

    previousTimerId.current = setTimeout(() => {
      inactivityHandler();
    }, delay);
  }, [delay, inactivityHandler]);

  const debouncedEventHandler = debounce(eventHandler, 300);

  const initListeners = useCallback(() => {
    if (!elementRef.current) {
      return () => null;
    }

    EVENTS.forEach((eventName) => {
      elementRef.current.addEventListener(eventName, debouncedEventHandler);
    });

    return () => {
      EVENTS.forEach((eventName) => {
        elementRef.current.removeEventListener(
          eventName,
          debouncedEventHandler
        );
      });
    };
  }, [elementRef, debouncedEventHandler]);

  useEffect(() => {
    if (!ref) return null;

    elementRef.current = ref;
    eventHandler();

    return initListeners();
  }, [ref, initListeners, eventHandler]);

  return [elementRef];
};

export default useActivityHandler;
