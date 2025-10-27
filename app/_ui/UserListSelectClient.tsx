"use client";
import { useState, useTransition, type ReactNode } from "react";
import { FaCheck, FaClipboardList, FaPlus, FaTrashCan, FaXmark } from "react-icons/fa6";
import Select, {
  type OptionProps,
  type PlaceholderProps,
  type SingleValue,
  type SingleValueProps,
  type StylesConfig,
} from "react-select";
import { components } from "react-select";
import styles from "@/app/_styles/UserListSelectClient.module.scss";
import { UserGameDB } from "../_lib/supabase";
import { createUserGameAction, deleteUserGameAction, updateUserGameAction } from "../_lib/actions";

const options: SingleSelectOption[] = [
  { label: "Plan to play", value: "Plan to play", icon: <FaClipboardList /> },
  { label: "Completed", value: "Completed", icon: <FaCheck /> },
  { label: "Dropped", value: "Dropped", icon: <FaTrashCan /> },
];

type UserListSelectProps = {
  userId: number;
  gameId: number;
  userGame: UserGameDB | null;
  menuPosition: "auto" | "bottom" | "top";
  fontSize: string;
};

// Performs CRUD operations on userGame table for the "state" column, except the delete which deletes everything
function UserListSelectClient({ userId, gameId, userGame, menuPosition, fontSize }: UserListSelectProps) {
  const [value, setValue] = useState(() => {
    return userGame ? options.find((opt) => opt.value === userGame.state) : null;
  });
  const [isPending, startTransition] = useTransition();
  // add a fake select value to call a delete request but ONLY if there is a value returned by the database
  const selectOptions = value ? [...options, { label: "Remove", value: "_REMOVE_", icon: <FaXmark /> }] : options;

  function onSelect(value: SingleValue<SingleSelectOption>) {
    startTransition(async () => {
      if (!value) return;
      // dont think there is a scenario where the remove option is there with no previous data, so this should be fine
      if (value.value === "_REMOVE_" && userGame) {
        await deleteUserGameAction(userGame.id);
        setValue(null);
        return;
      }

      let data;
      if (!userGame) {
        data = await createUserGameAction({ gameId, userId, state: value.value });
      } else {
        data = await updateUserGameAction({ ...userGame, state: value.value });
      }
      setValue(options.find((opt) => opt.value === data.state));
    });
  }

  return (
    <Select<SingleSelectOption, false>
      options={selectOptions}
      value={value}
      onChange={onSelect}
      isLoading={isPending}
      isDisabled={isPending}
      isSearchable={false}
      isOptionDisabled={(option) => option.value === userGame?.state}
      captureMenuScroll={true}
      closeMenuOnSelect={true}
      menuPlacement={menuPosition}
      components={{
        DropdownIndicator: null,
        Placeholder: CustomPlaceholder,
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      styles={getSelectStyle(fontSize)}
    />
  );
}

export default UserListSelectClient;

type SingleSelectOption = {
  label: string;
  value: string;
  icon: ReactNode;
};

function CustomPlaceholder(props: PlaceholderProps<SingleSelectOption, false>) {
  return (
    <components.Placeholder {...props}>
      {props.selectProps.isLoading ? (
        "Loading..."
      ) : (
        <div className={styles.value}>
          <FaPlus />
          Add to list
        </div>
      )}
    </components.Placeholder>
  );
}
function CustomOption(props: OptionProps<SingleSelectOption, false>) {
  return (
    <components.Option {...props}>
      <div className={`${styles.value} ${styles[props.data.label.replace(/\s/g, "")]}`}>
        {props.data.icon}
        {props.data.label}
      </div>
    </components.Option>
  );
}

function CustomSingleValue(props: SingleValueProps<SingleSelectOption, false>) {
  return (
    <components.SingleValue {...props}>
      <div className={`${styles.value} ${styles[props.data.label.replace(/\s/g, "")]}`}>
        {props.data.icon}
        {props.data.label}
      </div>
    </components.SingleValue>
  );
}

function getSelectStyle(size: string): StylesConfig<SingleSelectOption> {
  return {
    control: (baseStyles, state) => ({
      ...baseStyles,
      width: "fit-content",
      background: "var(--color-grey-0)",
      border: state.menuIsOpen ? "2px solid var(--color-brand-700)" : "2px solid transparent",
      borderRadius: "var(--border-radius-lg)",
      fontSize: size,
      boxShadow: "none", // REMOVES BLUE FOCUS RING
      "&:hover": {
        borderColor: "var(--color-brand-700)",
      },
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: "var(--color-grey-700)",
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: state.isDisabled ? "var(--color-grey-500)" : "var(--color-grey-700)",
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      color: state.isDisabled ? "var(--color-grey-500)" : "var(--color-grey-700)",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      background: state.isFocused ? "var(--color-grey-200)" : "var(--color-grey-0)",
      color: "var(--color-grey-700)",
      fontSize: size,
      whiteSpace: "nowrap",
      textDecoration: state.isDisabled ? "underline" : "none",
      "&:hover": {
        cursor: state.isDisabled ? "not-allowed" : "pointer",
      },
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      width: "fit-content",
      border: "none",
      borderRadius: "var(--border-radius-lg)",
      marginBottom: "5px",
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      background: "var(--color-grey-0)",
      border: "2px solid  var(--color-brand-700)",
      borderRadius: "var(--border-radius-lg)",
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
    loadingIndicator: (baseStyles) => ({
      ...baseStyles,
      color: "var(--color-brand-700)",
    }),
  };
}
