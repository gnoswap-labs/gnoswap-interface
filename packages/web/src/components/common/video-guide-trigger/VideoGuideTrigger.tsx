import { VideoGuideTriggerWrapper } from "./VideoGuideTrigger.styles";

interface VideoGuideTriggerProps {
  text: string;
  onClick: () => void;
}

const VideoGuideTrigger = ({ text, onClick }: VideoGuideTriggerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <VideoGuideTriggerWrapper onClick={onClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      {text}
    </VideoGuideTriggerWrapper>
  );
};

export default VideoGuideTrigger;
