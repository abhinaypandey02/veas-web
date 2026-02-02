import type { PropsWithChildren } from "react";
import React from "react";
import { type FieldValues, FormProvider } from "react-hook-form";

import type { FormProps } from "./types";

function Form<T extends FieldValues>({
  form,
  ...rest
}: PropsWithChildren<
  Omit<FormProps<T>, "onSubmit"> & { onSubmit: (values: T) => void }
>) {
  return (
    <FormProvider {...form}>
      <form
        {...rest}
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (rest.onSubmit) {
            form.handleSubmit(rest.onSubmit)();
          }
        }}
      />
    </FormProvider>
  );
}

export default Form;
