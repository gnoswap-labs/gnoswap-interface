import React from "react";

function useElementWidth(ref: React.RefObject<HTMLElement>, dependencies: React.DependencyList = []) {
  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        setWidth(width);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, dependencies);

  return width;
}

export default useElementWidth;
