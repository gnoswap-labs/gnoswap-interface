import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import FormInput from "@components/common/form-input/FormInput";
import FormTextArea from "@components/common/form-textarea/FormTextArea";
import FormProvider from "@components/common/form/FormProvider";
import IconAdd from "@components/common/icons/IconAdd";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import IconRemove from "@components/common/icons/IconRemove";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DEVICE_TYPE } from "@styles/media";
import {
  getCreateProposalChangeParameterValidation,
  getCreateProposalCommunityPoolSpendValidation,
  getCreateProposalValidation,
} from "@utils/create-proposal-validation";

import TokenChip from "../../token-chip/TokenChip";

import { makeDisplayPackagePath } from "@utils/governance-utils";
import VariableSelectBox from "../variable-select-box/VariableSelectBox";
import {
  BoxItem,
  CreateProposalModalWrapper,
  IconButton,
  ToolTipContentWrapper,
} from "./CreateProposalModal.styles";

interface BoxContentProps {
  label: string;
  children?: React.ReactNode;
}

interface FormValues {
  title: string;
  description: string;
  amount: number;
  recipientAddress: string;
  variable: {
    pkgPath: string;
    func: string;
    param: string;
  }[];
}

const ProposalOption = ["TEXT", "COMMUNITY_POOL_SPEND", "PARAMETER_CHANGE"];

const TypeTransMap: { [key: string]: string } = {
  TEXT: "Governance:proposal.type.text",
  COMMUNITY_POOL_SPEND: "Governance:proposal.type.community",
  PARAMETER_CHANGE: "Governance:proposal.type.paramChange",
};

const BoxContent: React.FC<BoxContentProps> = ({
  label,
  children,
  ...props
}) => {
  return (
    <BoxItem {...props}>
      {label && <label className="box-label">{label}</label>}
      {children}
    </BoxItem>
  );
};

export interface CreateProposalModalProps {
  breakpoint: DEVICE_TYPE;
  setIsOpenCreateModal: (opened: boolean) => void;
  myVotingWeight: number;
  proposalCreationThreshold: number;
  executableFunctions: {
    packagePath: string;
    functionName: string;
    parameterNum: number;
  }[];
  proposeTextProposal: (title: string, description: string) => void;
  proposeCommunityPoolSpendProposal: (
    title: string,
    description: string,
    tokenPath: string,
    toAddress: string,
    amount: string,
  ) => void;
  proposeParamChangeProposal: (
    title: string,
    description: string,
    variables: {
      pkgPath: string;
      func: string;
      param: string;
    }[],
  ) => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  breakpoint,
  setIsOpenCreateModal,
  myVotingWeight,
  proposalCreationThreshold,
  executableFunctions,
  proposeTextProposal,
  proposeCommunityPoolSpendProposal,
  proposeParamChangeProposal,
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState<string>(ProposalOption[0]);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationProps: any = useMemo(() => {
    if (type === ProposalOption[1]) {
      return getCreateProposalCommunityPoolSpendValidation();
    }
    if (type === ProposalOption[2]) {
      return getCreateProposalChangeParameterValidation();
    }
    return getCreateProposalValidation();
  }, [type]);

  const methods = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(validationProps),
    defaultValues: {
      title: "",
      description: "",
      recipientAddress: "",
      variable: [
        {
          pkgPath: "",
          func: "",
          param: "",
        },
        {
          pkgPath: "",
          func: "",
          param: "",
        },
      ],
    },
  });
  const {
    register,
    formState: { errors, isDirty, isValid },
    control,
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variable",
  });

  const handleClickFormFieldArray = (index: number) => {
    if (index === 0) {
      append({
        pkgPath: "",
        func: "",
        param: "",
      });
    } else {
      remove(index);
    }
  };

  const executablePackagePaths: {
    displayValue: string;
    value: string;
  }[] = useMemo(() => {
    const packagePaths = [
      ...new Set(executableFunctions.map(func => func.packagePath)),
    ];
    return packagePaths.map(packagePath => ({
      displayValue: packagePath.substring(packagePath.lastIndexOf("/") + 1),
      value: packagePath,
    }));
  }, [executableFunctions]);

  const filterExecutableFunctions = useCallback(
    (packagePath: string | null) => {
      if (!packagePath) {
        return [];
      }

      const functions = [
        ...new Set(
          executableFunctions
            .filter(func => func.packagePath === packagePath)
            .map(func => func.functionName),
        ),
      ];
      return functions.map(func => ({
        displayValue: func,
        value: func,
      }));
    },
    [executableFunctions],
  );

  const isDisableSubmit = useMemo(() => {
    return !isDirty || !isValid || myVotingWeight < proposalCreationThreshold;
  }, [isDirty, isValid, proposalCreationThreshold, myVotingWeight]);

  const sendTx: SubmitHandler<FormValues> = data => {
    console.log(data);
    if (type === ProposalOption[0]) {
      proposeTextProposal(data.title, data.description);
      setIsOpenCreateModal(false);
      return;
    } else if (type === ProposalOption[1]) {
      proposeCommunityPoolSpendProposal(
        data.title,
        data.description,
        GNS_TOKEN.path,
        data.recipientAddress,
        data.amount.toString(),
      );
      setIsOpenCreateModal(false);
      return;
    }

    const variables = data.variable.filter(
      variable =>
        variable.pkgPath.trim().length > 0 && variable.func.trim().length > 0,
    );
    if (variables.length === 0) {
      return;
    }

    proposeParamChangeProposal(data.title, data.description, variables);
    setIsOpenCreateModal(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={sendTx}>
      <CreateProposalModalWrapper>
        <div className="modal-body" ref={modalBodyRef}>
          <div className="header">
            <h6>{t("Governance:createModal.title")}</h6>
            <div
              className="close-wrap"
              onClick={() => setIsOpenCreateModal(false)}
            >
              <IconClose className="close-icon" />
            </div>
          </div>
          <BoxContent label={t("Governance:createModal.type")}>
            <div className="type-tab">
              {ProposalOption.map((item, index) => (
                <div
                  key={index}
                  className={
                    type === ProposalOption[index] ? "active-type-tab" : ""
                  }
                  onClick={() => setType(ProposalOption[index])}
                >
                  {t(TypeTransMap[item])}
                </div>
              ))}
            </div>
          </BoxContent>
          <BoxContent label={t("Governance:createModal.proposalDetails.title")}>
            <FormInput
              placeholder={t(
                "Governance:createModal.proposalDetails.placeholder.title",
              )}
              errorText={errors?.title ? errors.title.message : undefined}
              {...register("title")}
              name="title"
            />
            <FormTextArea
              placeholder={t(
                "Governance:createModal.proposalDetails.placeholder.description",
              ).replaceAll("<nl/>", "\n\n")}
              errorText={
                errors?.description ? errors.description.message : undefined
              }
              rows={type === ProposalOption[0] ? 14 : 8}
              {...register("description")}
            />
          </BoxContent>
          {type === ProposalOption[1] && (
            <BoxContent label={t("Governance:createModal.setVariable.title")}>
              <FormInput
                placeholder={t(
                  "Governance:createModal.setVariable.placeholder.recipient",
                )}
                errorText={
                  errors?.recipientAddress
                    ? errors.recipientAddress.message
                    : undefined
                }
                {...register("recipientAddress")}
                name="recipientAddress"
              />
              <div className="suffix-wrapper">
                <FormInput
                  type="number"
                  min={0}
                  placeholder="0"
                  errorText={errors?.amount ? errors.amount.message : undefined}
                  {...register("amount")}
                />
                <div className="suffix-currency">
                  <TokenChip tokenInfo={GNS_TOKEN} />
                </div>
              </div>
            </BoxContent>
          )}
          {type === ProposalOption[2] && (
            <BoxContent label={t("Governance:createModal.setVariable.title")}>
              {fields.map((item, index) => (
                <div className="multiple-variable" key={item.id}>
                  <div className="variable-input-wrapper">
                    <VariableSelectBox
                      modalBodyRef={modalBodyRef}
                      currentItem={
                        item.pkgPath
                          ? {
                              displayValue: makeDisplayPackagePath(
                                item.pkgPath,
                              ),
                              value: item.pkgPath,
                            }
                          : null
                      }
                      items={executablePackagePaths}
                      onChange={value => {
                        if (item.pkgPath === value) {
                          return;
                        }

                        update(index, {
                          pkgPath: value,
                          func: "",
                          param: "",
                        });
                      }}
                      placeholder={t(
                        "Governance:createModal.setVariable.placeholder.pkgPath",
                      )}
                    />
                    <VariableSelectBox
                      modalBodyRef={modalBodyRef}
                      currentItem={
                        item.func
                          ? {
                              displayValue: item.func,
                              value: item.func,
                            }
                          : null
                      }
                      items={filterExecutableFunctions(item.pkgPath || null)}
                      onChange={value => {
                        if (item.func === value) {
                          return;
                        }

                        update(index, {
                          pkgPath: item.pkgPath,
                          func: value,
                          param: "",
                        });
                      }}
                      placeholder={t(
                        "Governance:createModal.setVariable.placeholder.func",
                      )}
                      disabled={!item.pkgPath}
                    />
                    <FormInput
                      placeholder={t(
                        "Governance:createModal.setVariable.placeholder.param",
                      )}
                      {...register(`variable.${index}.param`)}
                    />
                  </div>
                  <IconButton onClick={() => handleClickFormFieldArray(index)}>
                    {index === 0 ? <IconAdd /> : <IconRemove />}
                  </IconButton>
                </div>
              ))}
            </BoxContent>
          )}
          <BoxContent label="">
            <div className="minimum">
              <div className="title">
                {t("Governance:createModal.minimum.title")}
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>
                      {t("Governance:createModal.minimum.tooltip")}
                    </ToolTipContentWrapper>
                  }
                >
                  <IconInfo size={16} />
                </Tooltip>
              </div>
              <div className="value">
                <span>{proposalCreationThreshold.toLocaleString("en")}</span>
                <TokenChip tokenInfo={XGNS_TOKEN} />
              </div>
            </div>
          </BoxContent>
        </div>
        <Button
          disabled={isDisableSubmit}
          text={t(
            myVotingWeight < proposalCreationThreshold
              ? "Governance:createModal.submit.insuffiXGNS"
              : "Governance:createModal.submit.ok",
          )}
          className="btn-submit"
          style={{
            fullWidth: true,
            textColor: "text09",
            fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
            hierarchy: ButtonHierarchy.Primary,
          }}
        />
      </CreateProposalModalWrapper>
    </FormProvider>
  );
};

export default CreateProposalModal;
