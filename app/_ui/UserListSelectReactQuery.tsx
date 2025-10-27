"use client";
import { useEffect, type ReactNode } from "react";
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
import useUserGame from "../_lib/useUserGame";
import useCreateUserGame from "../_lib/useCreateUserGame";
import useUpdateUserGame from "../_lib/useUpdateUserGame";
import useDeleteUserGame from "../_lib/useDeleteUserGame";
import useIsMutatingUserGame from "../_lib/useIsMutatingUserGame";
import useIsMounted from "../_hooks/useIsMounted";
import SpinnerMini from "./SpinnerMini";
import toast from "react-hot-toast";

const options: SingleSelectOption[] = [
  { label: "Plan to play", value: "Plan to play", icon: <FaClipboardList /> },
  { label: "Completed", value: "Completed", icon: <FaCheck /> },
  { label: "Dropped", value: "Dropped", icon: <FaTrashCan /> },
];

type UserListSelectProps = {
  userId: number;
  gameId: number;
  menuPosition: "auto" | "bottom" | "top";
  fontSize: string;
};

// Performs CRUD operations on userGames table
function UserListSelectReactQuery({ userId, gameId, menuPosition, fontSize }: UserListSelectProps) {
  const isMounted = useIsMounted();
  const { userGame, isFetchingGameState, error } = useUserGame(userId, gameId);
  const { createUserGame } = useCreateUserGame(userId, gameId, "/userList");
  const { updateUserGame } = useUpdateUserGame(userId, gameId, "/userList");
  const { deleteUserGameByGameId } = useDeleteUserGame(userId, gameId, "/userList");
  const isMutating = useIsMutatingUserGame(userId, gameId);

  const value = userGame ? options.find((opt) => opt.value === userGame.state) : null;
  // add a fake select value to call a delete request but ONLY if there is a value returned by the database
  const selectOptions = value ? [...options, { label: "Remove", value: "_REMOVE_", icon: <FaXmark /> }] : options;

  const isLoading = isFetchingGameState || isMutating;

  function onSelect(value: SingleValue<SingleSelectOption>) {
    if (!value) return;

    // dont think there is a scenario where the remove option is there with no previous data, so this should be fine
    if (value.value === "_REMOVE_" && userGame) {
      deleteUserGameByGameId(userGame.id, {
        onSuccess(data) {
          toast.success("User game with game id " + data.gameId + " deleted successfully!");
        },
      });
      return;
    }
    if (!userGame)
      createUserGame(
        { userId, gameId, state: value.value },
        {
          onSuccess(data) {
            toast.success("New user game registered successfully for game id " + data.gameId);
          },
        }
      );
    else
      updateUserGame(
        { ...userGame, state: value.value },
        {
          onSuccess(data) {
            toast.success("Successfuly updated user game with game id " + data.gameId);
          },
        }
      );
  }

  useEffect(() => {
    if (error) toast.error("Something went wrong while fetching user game: " + error.message);
  }, [error]);

  if (error) return null;
  if (!isMounted) return <SpinnerMini />;

  return (
    <Select<SingleSelectOption, false>
      options={selectOptions}
      value={value}
      onChange={onSelect}
      isLoading={isLoading}
      isDisabled={isLoading}
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

export default UserListSelectReactQuery;

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
