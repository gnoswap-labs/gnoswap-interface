import React from "react";
import {
  FormProvider as HookFormProvider,
  UseFormReturn,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";

interface Props<TFormValue extends FieldValues> {
  methods: UseFormReturn<TFormValue, any>;
  onSubmit: SubmitHandler<TFormValue>;
  children?: React.ReactNode;
}

const FormProvider = <TFormValue extends FieldValues>({
  methods,
  onSubmit,
  children,
}: Props<TFormValue>) => {
  return (
    <HookFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </HookFormProvider>
  );
};

export default FormProvider;
