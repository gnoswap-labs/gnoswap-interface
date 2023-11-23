import Button, { ButtonHierarchy } from "@components/common/button/Button";
import FormInput from "@components/common/form-input/FormInput";
import FormTextArea from "@components/common/form-textarea/FormTextArea";
import FormProvider from "@components/common/form/FormProvider";
import IconAdd from "@components/common/icons/IconAdd";
import IconClose from "@components/common/icons/IconCancel";
import IconRemove from "@components/common/icons/IconRemove";
import { yupResolver } from "@hookform/resolvers/yup";
import { DEVICE_TYPE } from "@styles/media";
import {
  getCreateProposalChangeParameterValidation,
  getCreateProposalCommunityPoolSpendValidation,
  getCreateProposalValidation,
} from "@utils/create-proposal-validation";
import { isEmptyObject } from "@utils/validation-utils";
import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  BoxItem,
  CreateProposalModalBackground,
  CreateProposalModalWrapper,
  IconButton,
} from "./CreateProposalModal.styles";

interface Props {
  breakpoint: DEVICE_TYPE;
  setIsShowCreateProposal: Dispatch<SetStateAction<boolean>>;
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
  "Text Proposal",
  "Community Pool Spend",
  "Parameter Change",
];

const TOKEN = {
  urlIcon:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  currency: "GNS",
  value: -500,
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
  setIsShowCreateProposal,
}) => {
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

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        setIsShowCreateProposal(true);
      }
    };
    window.addEventListener("click", closeModal, true);
    return () => {
      window.removeEventListener("click", closeModal, true);
    };
  }, [modalRef, setIsShowCreateProposal]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);

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
    <CreateProposalModalBackground>
      <FormProvider methods={methods} onSubmit={() => {}}>
        <CreateProposalModalWrapper ref={modalRef}>
          <div className="modal-body">
            <div className="header">
              <h6>Create Proposal</h6>
              <div
                className="close-wrap"
                onClick={() => setIsShowCreateProposal(false)}
              >
                <IconClose className="close-icon" />
              </div>
            </div>
            <BoxContent label="Type">
              <div className="type-tab">
                {ProposalOption.map((item, index) => (
                  <div
                    key={index}
                    className={
                      type === ProposalOption[index] ? "active-type-tab" : ""
                    }
                    onClick={() => setType(ProposalOption[index])}
                  >
                    {ProposalOption[index]}
                  </div>
                ))}
              </div>
            </BoxContent>
            <BoxContent label="Proposal Details">
              <FormInput
                placeholder="Enter a title"
                errorText={errors?.title ? errors.title.message : undefined}
                {...register("title")}
                name="title"
              />
              <FormTextArea
                placeholder="Enter a description"
                errorText={
                  errors?.description ? errors.description.message : undefined
                }
                rows={11}
                {...register("description")}
                name="description"
              />
            </BoxContent>
            {type === ProposalOption[1] && (
              <BoxContent label="Set Variable">
                <FormInput
                  placeholder="Enter a Recipient address"
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
                    <img src={TOKEN.urlIcon} alt="token logo" />
                    <span>{TOKEN.currency}</span>
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
                        placeholder="subspace"
                        errorText={
                          errors?.variable
                            ? (errors?.variable as any)[index]?.subspace
                                ?.message ||
                              (errors?.variable as any)[index]?.key?.message ||
                              (errors?.variable as any)[index]?.value?.message
                            : undefined
                        }
                        {...register(`variable.${index}.subspace`)}
                        name={`variable.${index}.subspace`}
                      />

                      <FormInput
                        placeholder="Key"
                        {...register(`variable.${index}.key`)}
                        name={`variable.${index}.key`}
                      />
                      <FormInput
                        placeholder="Value"
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
            <BoxContent label="Deposit">
              <div className="deposit">
                <div>
                  <div className="deposit-currency">
                    <img src={TOKEN.urlIcon} alt="token logo" />
                    <span>{TOKEN.currency}</span>
                  </div>
                </div>
                <span>{TOKEN.value}</span>
              </div>
            </BoxContent>
          </div>
          <Button
            disabled={isDisableSubmit}
            text="Submit"
            className="btn-submit"
            style={{
              fullWidth: true,
              textColor: "text09",
              fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
              hierarchy: isDisableSubmit ? undefined : ButtonHierarchy.Primary,
              bgColor: isDisableSubmit ? "background17" : undefined,
            }}
          />
        </CreateProposalModalWrapper>
      </FormProvider>
    </CreateProposalModalBackground>
  );
};

export default CreateProposalModal;
