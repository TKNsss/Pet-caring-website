import { createContext, useContext, useState, useEffect } from "react";

// The isDesktop state only updates when the screen size changes, which is infrequent -> 'no need to memoize'.
// default value when creating context
const MediaQueryContext = createContext(false);

// {children} is a special prop that allows a component to wrap other components inside it. It represents the content passed between the opening and closing tags of the provider component.
export const MediaQueryProvider = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const listener = (event) => setIsDesktop(event.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <MediaQueryContext.Provider value={isDesktop}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export const useMediaQueryContext = () => {
  // useContext returns the context value for the calling component
  return useContext(MediaQueryContext);
};
