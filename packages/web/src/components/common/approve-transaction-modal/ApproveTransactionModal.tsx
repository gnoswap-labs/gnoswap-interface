import React from "react";
import { cx } from "@emotion/css";

import {
  ApproveTransactionButtonWrapper,
  ApproveTransactionDetails,
  ApproveTransactionModalBody,
  ApproveTransactionModalContents,
  ApproveTransactionModalHeader,
  ApproveTransactionModalWrapper,
  ApproveTransactionSummary,
  InfoCard,
} from "./ApproveTransactionModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconAdenaLogo from "../icons/defaultIcon/IconAdenaLogo";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

const ApproveTransactionModal = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <ApproveTransactionModalWrapper>
      <ApproveTransactionModalBody>
        <ApproveTransactionModalHeader>
          <div className="title">Approve Transaction</div>
          <div className="close-wrapper">
            <button className="close-button">
              <IconClose className="close-icon" />
            </button>
          </div>
        </ApproveTransactionModalHeader>

        <ApproveTransactionModalContents>
          <ApproveTransactionSummary>
            <InfoCard justify="center" gap={8}>
              <IconAdenaLogo />
              <span className="value">{location.origin}</span>
            </InfoCard>
            <InfoCard>
              <div className="label">Account</div>
              <div className="value">g1as...aw1</div>
            </InfoCard>
            <InfoCard flexDirection="column" gap={16}>
              <div className="flex-box">
                <div className="label">Contract</div>
                <div className="value">/vm.m_call</div>
              </div>
              <div className="flex-box">
                <div className="label">Function</div>
                <div className="value">Approve</div>
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">Memo</div>
              <div className="value">
                <input placeholder="(Optional)" />
              </div>
            </InfoCard>
            <InfoCard>
              <div className="label">Network Fee</div>
              <div className="value">{"0.000001 GNOT (<$0.01)"}</div>
            </InfoCard>
          </ApproveTransactionSummary>
          <ApproveTransactionDetails>
            <button onClick={() => setIsExpanded(prev => !prev)} aria-expanded={isExpanded}>
              View Transaction Data {isExpanded ? "▼" : "▲"}
            </button>

            <div
              className={cx("transaction-messages", { expanded: isExpanded })}
              style={{ maxHeight: isExpanded ? 194 : 0 }}
            >
              <pre className="json-viewer">
                {JSON.stringify(
                  {
                    msgs: [
                      {
                        type: "/vm.m_call",
                        value: {
                          caller: "g1ukcrrrr4er2us84h2732sru76c9zl2nvkanc91",
                          send: "",
                          pkg_path: "gno.land/r/onbloc/usdc",
                          func: "Approve",
                        },
                      },
                    ],
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </ApproveTransactionDetails>
        </ApproveTransactionModalContents>

        <ApproveTransactionButtonWrapper>
          <Button
            text={"Approve"}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Primary }}
          />
          <Button
            text={"Cancel"}
            style={{ fullWidth: true, height: 57, fontType: "body7", hierarchy: ButtonHierarchy.Dark }}
          />
        </ApproveTransactionButtonWrapper>
      </ApproveTransactionModalBody>
    </ApproveTransactionModalWrapper>
  );
};

export default ApproveTransactionModal;
