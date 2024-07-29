import { useTranslation } from "react-i18next";
import { wrapper } from "./Disclaimer.styles";

interface DisclaimerProps {
  dummyDisclaimer: string;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ dummyDisclaimer }) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h5 className="section-title">{t("IncentivizePool:disclaimer.title")}</h5>
      <div
        className="desc"
        dangerouslySetInnerHTML={{
          __html: dummyDisclaimer,
        }}
      />
    </div>
  );
};

export default Disclaimer;
