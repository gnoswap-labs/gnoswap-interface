import { useEffect, useState } from "react";

const DELAY_LOADING = 500;

const useDelayLoading = (loadingProp = false, delay = DELAY_LOADING) => {
  const [loading, setLoading] = useState(loadingProp);

  useEffect(() => {
    // Set up the timeout to show the loading animation
    const loadingTimeout = setTimeout(() => {
      if (loadingProp) {
        setLoading(true);
      } else {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    }, delay); // Delay in ms before the loading animation shows up

    // Clean up the timeout if the component unmounts
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [loadingProp, delay]);

  return [loading, setLoading];
};

export default useDelayLoading;
