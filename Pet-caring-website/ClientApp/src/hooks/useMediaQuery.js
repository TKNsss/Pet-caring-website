import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
  const media = window.matchMedia(query);
  const [matches, setMatches] = useState(media.matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export default useMediaQuery;
