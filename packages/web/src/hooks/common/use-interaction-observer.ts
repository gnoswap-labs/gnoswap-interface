import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = () => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: [0.1, 0.2, 0.7, 0.95],
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return {ref, entry};
};

export { useIntersectionObserver };
