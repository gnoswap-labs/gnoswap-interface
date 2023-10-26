import { useState, useEffect, useRef } from "react";
import { Dispatch, SetStateAction } from "react";

function useClickOutside(): [
  React.RefObject<HTMLDivElement>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [isClickOutside, setIsClickOutside] = useState(true);
  const [isInside, setIsInside] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isInside) {
        setIsClickOutside(false);
        setIsInside(false);
      } else if (
        componentRef.current &&
        componentRef.current.contains(event.target as Node)
      ) {
        setIsClickOutside(false);
      } else {
        setIsClickOutside(true);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isInside]);

  return [componentRef, isClickOutside, setIsInside];
}

export default useClickOutside;
