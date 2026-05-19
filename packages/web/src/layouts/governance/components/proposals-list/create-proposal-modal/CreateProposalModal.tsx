import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useProposalDraft } from "@hooks/governance/ui/use-proposal-draft";
import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import FormInput from "@components/common/form-input/FormInput";
import FormTextArea from "@components/common/form-textarea/FormTextArea";
import FormProvider from "@components/common/form/FormProvider";
import IconAdd from "@components/common/icons/IconAdd";
import IconClose from "@components/common/icons/IconCancel";
import IconInfo from "@components/common/icons/IconInfo";
import IconRemove from "@components/common/icons/IconRemove";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DEVICE_TYPE } from "@styles/media";
import {
  getCreateProposalChangeParameterValidation,
  getCreateProposalCommunityPoolSpendValidation,
  getCreateProposalParameterValidation,
  getCreateProposalValidation,
} from "@utils/create-proposal-validation";
import { makeDisplayPackagePath } from "@utils/governance-utils";

import TokenChip from "../../token-chip/TokenChip";
import VariableSelectBox from "../variable-select-box/VariableSelectBox";

import { BoxItem, CreateProposalModalWrapper, IconButton, ToolTipContentWrapper } from "./CreateProposalModal.styles";

interface BoxContentProps {
  label: string;
  style?: React.CSSProperties;
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

const ProposalOption = {
  TEXT: "TEXT",
  COMMUNITY_POOL_SPEND: "COMMUNITY_POOL_SPEND",
  PARAMETER_CHANGE: "PARAMETER_CHANGE",
};

type ProposalOptionType = (typeof ProposalOption)[keyof typeof ProposalOption];

const ProposalOptionList: ProposalOptionType[] = [
  ProposalOption.TEXT,
  ProposalOption.COMMUNITY_POOL_SPEND,
  ProposalOption.PARAMETER_CHANGE,
];

const TypeTransMap: { [key: string]: string } = {
  TEXT: "Governance:proposal.type.text",
  COMMUNITY_POOL_SPEND: "Governance:proposal.type.community",
  PARAMETER_CHANGE: "Governance:proposal.type.paramChange",
};

const BoxContent: React.FC<BoxContentProps> = ({ label, children, ...props }) => {
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
  executablePackages: {
    pkgName: string;
    pkgPath: string;
  }[];
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
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
  executablePackages,
  executableFunctions,
  proposeTextProposal,
  proposeCommunityPoolSpendProposal,
  proposeParamChangeProposal,
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState<string>(ProposalOption.TEXT);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleDropdownToggle = useCallback((dropdownId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenDropdownId(dropdownId);
    } else {
      setOpenDropdownId(null);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationProps: any = useMemo(() => {
    if (type === ProposalOption.COMMUNITY_POOL_SPEND) {
      return getCreateProposalCommunityPoolSpendValidation(t);
    }
    if (type === ProposalOption.PARAMETER_CHANGE) {
      return getCreateProposalChangeParameterValidation(t);
    }
    return getCreateProposalValidation(t);
  }, [type]);

  const methods = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(validationProps),
    defaultValues: {
      title: "",
      description: "",
      recipientAddress: "",
      variable: Array.from({ length: 2 }).map(() => {
        return { pkgPath: "", func: "", param: "" };
      }),
    },
  });
  const {
    register,
    formState: { errors, isDirty, isValid },
    control,
    watch,
    setValue,
  } = methods;

  const { saveProposalDraft, clearProposalDraft, title, description } = useProposalDraft({
    setValue,
    watch,
    isDirty,
  });

  const handleCloseModal = () => {
    saveProposalDraft(title, description);
    setIsOpenCreateModal(false);
  };

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

  const { data: paramErrors = {}, refetch: validateParams } = useQuery({
    queryKey: ["validate/fields", JSON.stringify(control._formValues)],
    queryFn: () => {
      return getCreateProposalParameterValidation(t, executableFunctions)
        .validate(control?._formValues?.variable || [], { abortEarly: false })
        .then<{
          variable?: {
            [x: string]: string;
          };
        }>(() => ({}))
        .catch(err => {
          const errors: {
            message: string;
            path: string;
          }[] = err?.inner || [];
          return {
            variable: errors.reduce<{ [key in string]: string }>((acc, current) => {
              const errorPaths = JSON.parse(current.path) as number[];
              if (errorPaths?.length > 0 && !acc[errorPaths[0]]) {
                acc[errorPaths[0]] = current.message;
              }
              return acc;
            }, {}),
          };
        });
    },
    keepPreviousData: true,
  });

  const executablePackagePaths: {
    displayValue: string;
    value: string;
  }[] = useMemo(() => {
    return executablePackages.map(pkg => ({
      displayValue: makeDisplayPackagePath(pkg.pkgPath),
      value: pkg.pkgPath,
    }));
  }, [executableFunctions, executablePackages]);

  const filterExecutableFunctions = useCallback(
    (packagePath: string | null) => {
      if (!packagePath) {
        return [];
      }

      const functions = [
        ...new Set(executableFunctions.filter(func => func.pkgPath === packagePath).map(func => func.funcName)),
      ];
      return functions.map(func => ({
        displayValue: func,
        value: func,
      }));
    },
    [executableFunctions],
  );

  const isDisableSubmit = useMemo(() => {
    if (!isDirty || !isValid || myVotingWeight < proposalCreationThreshold) {
      return true;
    }

    if (type === ProposalOption.PARAMETER_CHANGE) {
      const isValidParameter = Object.keys(paramErrors.variable || {}).length === 0;

      const hasValidVariable = control._formValues.variable?.some(
        (v: { pkgPath: string; func: string; param: string }) =>
          v.pkgPath.trim().length > 0 && v.func.trim().length > 0 && v.param.trim().length > 0,
      );

      return !isValidParameter || !hasValidVariable;
    }

    return false;
  }, [isDirty, isValid, paramErrors, proposalCreationThreshold, myVotingWeight, type, control._formValues.variable]);

  const getParameterPlaceholder = useCallback(
    (item: { pkgPath: string; func: string }): string => {
      const defaultPlaceholder = t("Governance:createModal.setVariable.placeholder.param");

      const currentFunction = executableFunctions.find(
        func => func.pkgPath === item.pkgPath && func.funcName === item.func,
      );
      if (!currentFunction || currentFunction.paramNum > 3) {
        return defaultPlaceholder;
      }

      const placeholders = defaultPlaceholder
        .replace("...", "")
        .split(",")
        .map((placeholder, index) => {
          return placeholder.trim() || `arg${index + 1}`;
        });

      return placeholders.slice(0, currentFunction.paramNum).join(", ");
    },
    [executableFunctions, t],
  );

  const getFieldName = (index: number, field: "pkgPath" | "func" | "param") => {
    return `variable.${index}.${field}` as const;
  };

  const shouldShowErrorText = (index: number, forMobile: boolean) => {
    const fieldName = getFieldName(index, "param");
    const hasError = paramErrors?.variable?.[index];
    const isTouched = touchedFields.has(fieldName);
    const isCorrectDevice = forMobile === (breakpoint === DEVICE_TYPE.MOBILE);

    return isTouched && hasError && isCorrectDevice;
  };

  const sendTx: SubmitHandler<FormValues> = data => {
    if (type === ProposalOption.TEXT) {
      proposeTextProposal(data.title, data.description);
      clearProposalDraft();
      setIsOpenCreateModal(false);
      return;
    } else if (type === ProposalOption.COMMUNITY_POOL_SPEND) {
      proposeCommunityPoolSpendProposal(
        data.title,
        data.description,
        GNS_TOKEN.path,
        data.recipientAddress,
        data.amount.toString(),
      );
      clearProposalDraft();
      setIsOpenCreateModal(false);
      return;
    }

    const variables = data.variable.filter(
      variable => variable.pkgPath.trim().length > 0 && variable.func.trim().length > 0,
    );
    if (variables.length === 0) {
      return;
    }

    proposeParamChangeProposal(data.title, data.description, variables);
    clearProposalDraft();
    setIsOpenCreateModal(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || value === ".") {
      return;
    }

    if (isNaN(Number(value))) {
      return;
    }

    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1) {
      const decimals = value.slice(decimalIndex + 1);
      if (decimals.length > GNS_TOKEN.decimals) {
        e.target.value = value.slice(0, decimalIndex + GNS_TOKEN.decimals + 1);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={sendTx}>
      <CreateProposalModalWrapper>
        <div className={"modal-body"} ref={modalBodyRef}>
          <div className="header">
            <h6>{t("Governance:createModal.title")}</h6>
            <div className="close-wrap" onClick={handleCloseModal}>
              <IconClose className="close-icon" />
            </div>
          </div>
          <BoxContent label={t("Governance:createModal.type")}>
            <div className="type-tab">
              {ProposalOptionList.map((item, index) => (
                <div
                  key={index}
                  className={type === ProposalOptionList[index] ? "active-type-tab" : ""}
                  onClick={() => setType(ProposalOptionList[index])}
                >
                  {t(TypeTransMap[item])}
                </div>
              ))}
            </div>
          </BoxContent>
          <BoxContent label={t("Governance:createModal.proposalDetails.title")}>
            <FormInput
              placeholder={t("Governance:createModal.proposalDetails.placeholder.title")}
              errorText={errors?.title ? errors.title.message : undefined}
              {...register("title")}
              name="title"
            />
            <FormTextArea
              placeholder={t("Governance:createModal.proposalDetails.placeholder.description").replaceAll(
                "<nl/>",
                "\n\n",
              )}
              errorText={errors?.description ? errors.description.message : undefined}
              rows={type === ProposalOption.TEXT ? 14 : 8}
              {...register("description")}
            />
          </BoxContent>
          {type === ProposalOption.COMMUNITY_POOL_SPEND && (
            <BoxContent label={t("Governance:createModal.setVariable.title")}>
              <FormInput
                placeholder={t("Governance:createModal.setVariable.placeholder.recipient")}
                errorText={errors?.recipientAddress ? errors.recipientAddress.message : undefined}
                {...register("recipientAddress")}
                name="recipientAddress"
              />
              <div className="suffix-wrapper">
                <FormInput
                  type="number"
                  min={0}
                  placeholder="0"
                  errorText={errors?.amount ? errors.amount.message : undefined}
                  {...register("amount", {
                    onChange: handleAmountChange,
                  })}
                />
                <div className="suffix-currency">
                  <TokenChip tokenInfo={GNS_TOKEN} />
                </div>
              </div>
            </BoxContent>
          )}
          {type === ProposalOption.PARAMETER_CHANGE && (
            <BoxContent label={t("Governance:createModal.setVariable.title")}>
              {fields.map((item, index) => (
                <div className="multiple-variable" key={item.id}>
                  <div className="variable-input-wrapper">
                    <VariableSelectBox
                      modalBodyRef={modalBodyRef}
                      currentItem={
                        item.pkgPath
                          ? {
                              displayValue: makeDisplayPackagePath(item.pkgPath),
                              value: item.pkgPath,
                            }
                          : null
                      }
                      errorText={
                        shouldShowErrorText(index, false) ? paramErrors?.variable?.[index] || undefined : undefined
                      }
                      items={executablePackagePaths}
                      {...register(`variable.${index}.pkgPath`)}
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
                      placeholder={t("Governance:createModal.setVariable.placeholder.pkgPath")}
                      dropdownId={`parameter-${index}`}
                      isOpen={openDropdownId === `parameter-${index}`}
                      onToggle={handleDropdownToggle}
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
                      {...register(`variable.${index}.func`)}
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
                      placeholder={t("Governance:createModal.setVariable.placeholder.func")}
                      disabled={!item.pkgPath}
                      dropdownId={`parameter2-${index}`}
                      isOpen={openDropdownId === `parameter2-${index}`}
                      onToggle={handleDropdownToggle}
                    />
                    <FormInput
                      placeholder={getParameterPlaceholder(item)}
                      {...register(`variable.${index}.param`)}
                      onBlur={() => {
                        setTouchedFields(prev => new Set(prev).add(getFieldName(index, "param")));
                        if (item.pkgPath && item.func) {
                          validateParams();
                        }
                      }}
                      errorText={
                        shouldShowErrorText(index, true) ? paramErrors?.variable?.[index] || undefined : undefined
                      }
                    />
                  </div>
                  <IconButton onClick={() => handleClickFormFieldArray(index)}>
                    {index === 0 ? <IconAdd /> : <IconRemove />}
                  </IconButton>
                </div>
              ))}
            </BoxContent>
          )}
          <BoxContent style={{ padding: "10.5px 16px" }} label="">
            <div className="minimum">
              <div className="title">
                {t("Governance:createModal.minimum.title")}
                <Tooltip
                  placement="top"
                  FloatingContent={
                    <ToolTipContentWrapper>{t("Governance:createModal.minimum.tooltip")}</ToolTipContentWrapper>
                  }
                >
                  <IconInfo size={16} />
                </Tooltip>
              </div>
              <div className="value">
                <span>{proposalCreationThreshold.toLocaleString("en")}</span>
                {breakpoint !== DEVICE_TYPE.MOBILE ? (
                  <TokenChip tokenInfo={XGNS_TOKEN} />
                ) : (
                  <MissingLogo className="" symbol={XGNS_TOKEN.symbol} width={24} url={XGNS_TOKEN.logoURI} />
                )}
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
            fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "p1",
            hierarchy: ButtonHierarchy.Primary,
          }}
        />
      </CreateProposalModalWrapper>
    </FormProvider>
  );
};

export default CreateProposalModal;
