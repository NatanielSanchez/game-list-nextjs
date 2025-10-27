"use client";
import styles from "@/app/_styles/Filter.module.scss";
import { useQueryParamSync } from "../_hooks/useQueryParamSync";
/*
-Adds query strings to the URL for filtering purposes.
-filterField: the name/key of the query string
-options: an array with objects for the values for the filterField, and a label for the buttons
*/
function Filter({ filterField, options }: FilterProps) {
  const { getParam, setParam } = useQueryParamSync();
  const currentFilter = getParam(filterField) || options[0].value;

  function handleClick(value: string) {
    setParam(filterField, value, "page");
  }

  return (
    <div className={styles.filter}>
      {options.map((option) => (
        <button
          className={`${styles.button} ${currentFilter === option.value ? styles.active : ""}`}
          key={option.value}
          disabled={currentFilter === option.value}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;

type FilterProps = {
  filterField: string;
  options: FilterOption[];
};

type FilterOption = {
  label: string;
  value: string;
};
