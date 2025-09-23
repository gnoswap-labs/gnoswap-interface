import React from "react";
import { useTranslation } from "react-i18next";

import { YOUTUBE_LINKS, VideoGuideType } from "@constants/youtube-links.constant";
import { VIDEO_GUIDE_CONFIG } from "@constants/video-guide-config.constant";

import { VideoGuideModalWrapper } from "./VideoGuideModal.styles";
import withLocalModal from "@components/hoc/with-local-modal";
import Button, { ButtonHierarchy } from "../button/Button";
import IconLink from "../icons/IconLink";
import IconRightArrow from "../icons/IconRightArrow";
import IconLearnMoreLink from "../icons/IconLearnMoreLink";
import IconClose from "../icons/IconCancel";

interface VideoGuideModalProps {
  videoType: VideoGuideType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoGuideModal = ({ videoType, setIsOpen }: VideoGuideModalProps) => {
  const Modal = React.useMemo(() => withLocalModal(VideoGuideModalWrapper, setIsOpen), [setIsOpen]);

  const { t } = useTranslation();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const config = VIDEO_GUIDE_CONFIG[videoType];
  const videoId = YOUTUBE_LINKS[videoType];

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;

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
        <div className="header-actions">
          <div className="icon-wrap">
            <button onClick={handleClose}>
              <IconLink className="header-action-icon" />
            </button>
          </div>
          <div className="icon-wrap">
            <button onClick={handleClose}>
              <IconClose className="header-action-icon" />
            </button>
          </div>
        </div>

        <div className="title-wrapper">
          <h1 className="title">{t(config.title.key)}</h1>
          <h6 className="sub-title">{t(config.subtitle.key)}</h6>
        </div>

        <div className="content-wrapper">
          <div className="video-content">
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="footer">
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={t(config.externalLink.textKey)}
            rightIcon={<IconLearnMoreLink />}
          />
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={t(config.internalAction.textKey)}
            rightIcon={<IconRightArrow />}
          />
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={"Close"}
            onClick={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VideoGuideModal;
