import { VideoGuideType, YOUTUBE_LINKS } from "@constants/video-guide.constant";

export const createYoutubeEmbedUrl = (videoId: string, options = {}) => {
  const defaultOptions = {
    autoplay: "1",
    mute: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
  };

  const params = new URLSearchParams({ ...defaultOptions, ...options });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const isValidVideoGuideType = (guide: string | null): guide is VideoGuideType => {
  return guide !== null && Object.keys(YOUTUBE_LINKS).includes(guide);
};
