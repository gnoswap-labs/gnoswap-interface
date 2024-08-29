import { yupResolver } from "@hookform/resolvers/yup";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import FormInput from "@components/common/form-input/FormInput";
import FormTextArea from "@components/common/form-textarea/FormTextArea";
import FormProvider from "@components/common/form/FormProvider";
import IconAdd from "@components/common/icons/IconAdd";
import IconClose from "@components/common/icons/IconCancel";
import IconRemove from "@components/common/icons/IconRemove";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";
import { DEVICE_TYPE } from "@styles/media";
import {
  getCreateProposalChangeParameterValidation,
  getCreateProposalCommunityPoolSpendValidation,
  getCreateProposalValidation,
} from "@utils/create-proposal-validation";
import { isEmptyObject } from "@utils/validation-utils";

import TokenChip from "../../token-chip/TokenChip";


import {
  BoxItem,
  CreateProposalModalBackground,
  CreateProposalModalWrapper,
  IconButton,
} from "./CreateProposalModal.styles";

interface Props {
  breakpoint: DEVICE_TYPE;
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>;
}

interface BoxContentProps {
  label: string;
  children?: React.ReactNode;
}

interface Variable {
  subspace: string;
  key: string;
  value: string;
}

interface FormValues {
  title: string;
  description: string;
  amount: number;
  recipientAddress: string;
  variable: Variable[];
}

const ProposalOption = [
  "TEXT",
  "COMMUNITY_POOL_SPEND",
  "PARAMETER_CHANGE",
];

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
      <label className="box-label">{label}</label>
      {children}
    </BoxItem>
  );
};

const CreateProposalModal: React.FC<Props> = ({
  breakpoint,
  setIsOpenCreateModal,
}) => {
  const {t} = useTranslation();
  const [type, setType] = useState<string>(ProposalOption[0]);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      const height = modalRef.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "translateX(-50%)";
      } else {
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };

  useLockedBody(true);
  useEscCloseModal(() => setIsOpenCreateModal(false));

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);

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
          subspace: "",
          key: "",
          value: "",
        },
        {
          subspace: "",
          key: "",
          value: "",
        },
      ],
    },
  });
  const {
    register,
    formState: { errors, isDirty, isValid },
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variable",
  });

  const handleClickFormFieldArray = (index: number) => {
    if (index === fields.length - 1) {
      append({
        subspace: "",
        key: "",
        value: "",
      });
    } else {
      remove(index);
    }
  };

  const isDisableSubmit = useMemo(() => {
    return !isEmptyObject(errors) || !isDirty || !isValid;
  }, [isDirty, isValid, errors]);

  return (
    <>
      <CreateProposalModalBackground>
        <FormProvider methods={methods} onSubmit={() => {}}>
          <CreateProposalModalWrapper ref={modalRef}>
            <div className="modal-body">
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
              <BoxContent
                label={t("Governance:createModal.proposalDetails.title")}
              >
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
                  )}
                  errorText={
                    errors?.description ? errors.description.message : undefined
                  }
                  rows={type === ProposalOption[0] ? 20 : 10}
                  {...register("description")}
                  name="description"
                />
              </BoxContent>
              {type === ProposalOption[1] && (
                <BoxContent
                  label={t("Governance:createModal.setVariable.title")}
                >
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
                      errorText={
                        errors?.amount ? errors.amount.message : undefined
                      }
                      {...register("amount")}
                      name="amount"
                    />
                    <div className="deposit-currency suffix-currency">
                      <TokenChip tokenInfo={GNS_TOKEN} />
                    </div>
                  </div>
                </BoxContent>
              )}
              {type === ProposalOption[2] && (
                <BoxContent label="Set Variable">
                  {fields.map((item, index) => (
                    <div className="multiple-variable" key={item.id}>
                      <div>
                        <FormInput
                          placeholder={t(
                            "Governance:createModal.setVariable.placeholder.subspace",
                          )}
                          errorText={
                            errors?.variable
                              ? errors?.variable[index]?.subspace?.message ||
                                errors?.variable[index]?.key?.message ||
                                errors?.variable[index]?.value?.message
                              : undefined
                          }
                          {...register(`variable.${index}.subspace`)}
                          name={`variable.${index}.subspace`}
                        />

                        <FormInput
                          placeholder={t(
                            "Governance:createModal.setVariable.placeholder.key",
                          )}
                          {...register(`variable.${index}.key`)}
                          name={`variable.${index}.key`}
                        />
                        <FormInput
                          placeholder={t(
                            "Governance:createModal.setVariable.placeholder.value",
                          )}
                          {...register(`variable.${index}.value`)}
                          name={`variable.${index}.value`}
                        />
                      </div>
                      <IconButton
                        onClick={() => handleClickFormFieldArray(index)}
                      >
                        {index === fields.length - 1 ? (
                          <IconAdd />
                        ) : (
                          <IconRemove />
                        )}
                      </IconButton>
                    </div>
                  ))}
                </BoxContent>
              )}
              {/* <BoxContent label="Deposit">
                <div className="deposit">
                  <div>
                    <div className="deposit-currency">
                      <img src={TOKEN.urlIcon} alt="token logo" />
                      <span>{TOKEN.currency}</span>
                    </div>
                  </div>
                  <span>{TOKEN.value}</span>
                </div>
              </BoxContent> */}
            </div>
            <Button
              disabled={isDisableSubmit}
              text={t("Governance:createModal.submit")}
              className="btn-submit"
              style={{
                fullWidth: true,
                textColor: "text09",
                fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
                hierarchy: isDisableSubmit
                  ? undefined
                  : ButtonHierarchy.Primary,
                bgColor: isDisableSubmit ? "background17" : undefined,
              }}
            />
          </CreateProposalModalWrapper>
        </FormProvider>
      </CreateProposalModalBackground>
      <Overlay onClick={() => setIsOpenCreateModal(false)} />
    </>
  );
};

export default CreateProposalModal;
