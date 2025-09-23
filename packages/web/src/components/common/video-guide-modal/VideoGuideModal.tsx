import React from "react";
import { useTranslation } from "react-i18next";

import { YOUTUBE_LINKS, YoutubeVideoType } from "@constants/youtube-links";
import IconClose from "../icons/IconCancel";

import { VideoGuideModalWrapper } from "./VideoGuideModal.styles";
import withLocalModal from "@components/hoc/with-local-modal";
import Button, { ButtonHierarchy } from "../button/Button";
import IconLink from "../icons/IconLink";
import IconRightArrow from "../icons/IconRightArrow";
import IconLearnMoreLink from "../icons/IconLearnMoreLink";

interface VideoGuideModalProps {
  videoType: YoutubeVideoType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoGuideModal = ({ videoType, setIsOpen }: VideoGuideModalProps) => {
  const Modal = React.useMemo(() => withLocalModal(VideoGuideModalWrapper, setIsOpen), [setIsOpen]);

  const { t } = useTranslation();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
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
          <h1 className="title">What’s a Position?</h1>
          <h6 className="sub-title">
            {t("Learn about positions and how to provide liquidity to earn rewards on GnoSwap.")}
          </h6>
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
            text={"Learn More"}
            rightIcon={<IconLearnMoreLink />}
          />
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={"Create a Position"}
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
