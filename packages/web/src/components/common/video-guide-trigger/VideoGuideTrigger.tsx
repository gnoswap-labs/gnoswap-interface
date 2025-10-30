import { VideoGuideTriggerWrapper } from "./VideoGuideTrigger.styles";

interface VideoGuideTriggerProps {
  text: string;
  style?: React.CSSProperties;
  onClick: () => void;
}

const VideoGuideTrigger = ({ text, onClick, style }: VideoGuideTriggerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <VideoGuideTriggerWrapper
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label="Open video guide"
      role="button"
      tabIndex={0}
      style={style}
    >
      {text}
    </VideoGuideTriggerWrapper>
  );
};

export default VideoGuideTrigger;
