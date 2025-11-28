"use client";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { type Props as SelectProps } from "react-select";
import { useQueryParamSync } from "../_hooks/useQueryParamSync";
import useIsMounted from "../_hooks/useIsMounted";

function SingleSelectFilter({
  fieldName,
  options,
  isLoading,
  isSearchable,
  placeholder,
  isClearable,
}: SingleSelectFilterProps) {
  const { getParam, setParam, deleteParam } = useQueryParamSync();
  const isMounted = useIsMounted();

  const pathOption = getParam(fieldName);
  let value;

  // if no options (they could be getting fetched), default value is null
  if (!options) value = null;
  // else value is based on the path param, or the first option is taken as default
  else value = pathOption ? options.find((opt) => opt.value === pathOption) : isClearable ? null : options[0];

  function onSelect(value: SingleValue<SingleSelectOption>) {
    if (!value) deleteParam(fieldName, undefined, "page");
    else setParam(fieldName, value.value, "page");
  }

  if (!isMounted) return null;

  return (
    <Select<SingleSelectOption, false>
      placeholder={placeholder ? placeholder : "Select option..."}
      options={options}
      value={value}
      onChange={onSelect}
      isLoading={isLoading} // adds "spinner" when fetching options
      isSearchable={isSearchable}
      isClearable={isClearable}
      captureMenuScroll={true}
      closeMenuOnSelect={true}
      styles={customSelectStyles}
    />
  );
}

export default SingleSelectFilter;

type SingleSelectFilterProps = Pick<
  SelectProps,
  "isLoading" | "placeholder" | "isSearchable" | "isDisabled" | "isClearable"
> & {
  fieldName: string;
  options?: SingleSelectOption[]; // optional for compatibility with fetched options
};

export type SingleSelectOption = {
  label: string;
  value: string;
};

const customSelectStyles: StylesConfig<SingleSelectOption> = {
  control: (baseStyles) => ({
    ...baseStyles,
    minWidth: "fit-content",
    background: "var(--color-grey-0)",
    border: "1px solid var(--color-grey-100)",
    fontSize: "1.4rem",
    boxShadow: "var(--shadow-sm)",
    padding: "0.3rem", // this is to make it line up with the other filters beside it, otherwise its misaligned
    "&:hover": {
      borderColor: "var(--color-grey-100)",
    },
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-700)",
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-400)",
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-700)",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    background: state.isFocused ? "var(--color-grey-100)" : "var(--color-grey-0)",
    color: "var(--color-grey-700)",
    fontSize: "1.2rem",
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    margin: "0.5rem 0",
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    background: "var(--color-grey-0)",
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-400)",
    "&:hover": {
      color: "var(--color-brand-600)",
    },
  }),
  clearIndicator: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-400)",
    "&:hover": {
      color: "var(--color-brand-600)",
    },
  }),
};
