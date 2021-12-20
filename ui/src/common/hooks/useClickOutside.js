import { useEffect, useRef } from 'react';

const useClickOutside = (opened, setIsOpen) => {
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (opened && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [opened, setIsOpen]);

  return [ref];
};

export default useClickOutside;
