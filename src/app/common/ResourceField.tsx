import { Autocomplete, TextField } from "@material-ui/core";
import { useField, useFormikContext } from "formik";
import { ReactElement, ReactNode, useEffect, useState } from "react";

function identity<T>(input: T): T {
  return input;
}

function toSearchQuery(input: string): string | undefined {
  return input.trim().toLocaleLowerCase() || undefined;
}

export interface ResourceFieldProps<T> {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
  helperText?: ReactNode;
  useOptions: (searchQuery: string | undefined) => undefined | T[];
}

export function ResourceField<T>({
  name,
  label,
  disabled,
  helperText,
  useOptions,
  ...props
}: ResourceFieldProps<T>): ReactElement {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState(() =>
    toSearchQuery(inputValue)
  );

  const options = useOptions(searchQuery);

  const { isSubmitting } = useFormikContext();
  const [, { value, touched, error }, { setValue, setTouched }] = useField<
    NonNullable<T>
  >({ name });

  const errorText = touched && error;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(toSearchQuery(inputValue));
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);

  return (
    <Autocomplete
      {...props}
      value={value}
      multiple={false}
      openOnFocus={false}
      autoHighlight={true}
      disableClearable={true}
      options={options || []}
      filterOptions={identity}
      loading={!!searchQuery && !options}
      disabled={isSubmitting || disabled}
      onClose={() => {
        setTouched(true, false);
      }}
      onChange={(_, nextValue) => {
        setValue(nextValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, nextInputValue) => {
        setInputValue(nextInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!errorText}
          helperText={errorText || helperText}
        />
      )}
    />
  );
}
