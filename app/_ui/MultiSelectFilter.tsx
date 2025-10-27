"use client";
import Select, { type MultiValue, type MultiValueGenericProps, type StylesConfig } from "react-select";
import { components, type Props as SelectProps } from "react-select";
import { useQueryParamSync } from "../_hooks/useQueryParamSync";
import useIsMounted from "../_hooks/useIsMounted";

function MultiSelectFilter({ fieldName, options, isLoading, isSearchable, placeholder }: MultiSelectFilterProps) {
  const { getAllParams, setMultiParams } = useQueryParamSync();
  const isMounted = useIsMounted();

  const pathOptions = getAllParams(fieldName);

  function onSelect(values: MultiValue<MultiSelectOption>) {
    const fixedValues = values.map((v) => v.value);
    setMultiParams(fieldName, fixedValues, "page");
  }

  if (!isMounted) return null;

  return (
    <Select
      placeholder={placeholder ? placeholder : "Select option..."}
      isMulti={true}
      options={options}
      onChange={onSelect}
      value={options?.filter((opt) => pathOptions.includes(opt.value))}
      isLoading={isLoading} // adds "spinner" when fetching options
      isSearchable={isSearchable}
      isClearable={true}
      backspaceRemovesValue={true}
      captureMenuScroll={true}
      closeMenuOnSelect={true}
      components={{ MultiValueLabel: CustomMultiValue }}
      styles={customSelectStyles}
    />
  );
}

export default MultiSelectFilter;

type MultiSelectFilterProps = Pick<SelectProps, "isLoading" | "placeholder" | "isSearchable" | "isDisabled"> & {
  fieldName: string;
  options?: MultiSelectOption[]; // optional for compatibility with fetched options
};

export type MultiSelectOption = {
  label: string;
  value: string;
  shortLabel?: string;
};

// bool is for multi-select functionality
// function CustomOption(props: OptionProps<Option, true>) {
//   return <components.Option {...props}>{props.data.label}</components.Option>;
// }

function CustomMultiValue(props: MultiValueGenericProps<MultiSelectOption>) {
  const displayLabel: string = props.data.shortLabel || props.data.label;
  const shortDisplayLabel = displayLabel.length > 8 ? displayLabel.slice(0, 5).concat("...") : displayLabel;
  return (
    <components.MultiValueLabel {...props}>
      <p title={displayLabel}>{shortDisplayLabel}</p>
    </components.MultiValueLabel>
  );
}

// extracted styles (the boolean is needed because isMulti=true)
const customSelectStyles: StylesConfig<MultiSelectOption, true> = {
  control: (baseStyles) => ({
    ...baseStyles,
    minWidth: "10dvw",
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
  option: (baseStyles, state) => ({
    ...baseStyles,
    background: state.isFocused ? "var(--color-grey-100)" : "var(--color-grey-0)",
    color: "var(--color-grey-700)",
    fontSize: "1.2rem",
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    background: "var(--color-grey-200)",
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: "var(--color-grey-700)",
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
