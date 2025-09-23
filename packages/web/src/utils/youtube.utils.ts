export const createYoutubeEmbedUrl = (videoId: string, options = {}) => {
  const defaultOptions = {
    autoplay: "0",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
  };

  const params = new URLSearchParams({ ...defaultOptions, ...options });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};
