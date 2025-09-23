import React from "react";
import { useTranslation } from "react-i18next";

import { YOUTUBE_LINKS, YoutubeVideoType } from "@constants/youtube-links";
import IconClose from "../icons/IconCancel";

import { VideoGuideModalWrapper } from "./VideoGuideModal.styles";
import withLocalModal from "@components/hoc/with-local-modal";

interface VideoGuideModalProps {
  videoType: YoutubeVideoType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoGuideModal = ({ videoType, setIsOpen }: VideoGuideModalProps) => {
  const Modal = React.useMemo(() => withLocalModal(VideoGuideModalWrapper, setIsOpen), [setIsOpen]);

  const { t } = useTranslation();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const videoId = YOUTUBE_LINKS[videoType];
  console.log(videoId);

  // const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  const handleClose = React.useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
    setIsOpen(false);
  }, [setIsOpen]);

  React.useEffect(() => {
    if (iframeRef.current) {
      setTimeout(() => {
        iframeRef.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <Modal>
      <div className="modal-body">
        <div className="header">
          <h6>Video Guide</h6>
          <div className="close-wrap" onClick={handleClose}>
            <IconClose className="close-icon" />
          </div>
        </div>

        <div className="content-wrapper">
          <div className="content">{t("videoId")}</div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoGuideModal;
