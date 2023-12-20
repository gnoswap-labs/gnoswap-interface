import { useEffect, useState } from "react";

const DELAY_LOADING = 500;

const useDelayLoading = (loadingProp = false, delay = DELAY_LOADING) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout | null = null;
    // Set up the timeout to show the loading animation
    loadingTimeout = setTimeout(() => {
      if (loadingProp) {
        setLoading(true);
      } else {
        setLoading(false);
        loadingTimeout && clearTimeout(loadingTimeout);
      }
    }, delay); // Delay in ms before the loading animation shows up

    // Clean up the timeout if the component unmounts
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingProp, delay]);

  return [loading, setLoading];
};

export default useDelayLoading;
