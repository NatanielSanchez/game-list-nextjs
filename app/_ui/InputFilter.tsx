"use client";
import { HiOutlineBackspace } from "react-icons/hi2";
import { useRef, useState } from "react";
import styles from "@/app/_styles/InputFilter.module.scss";
import { useQueryParamSync } from "../_hooks/useQueryParamSync";

type InputFilterProps = {
  fieldName: string;
};

/*
-An input that adds a query param for filtering
*/
function InputFilter({ fieldName }: InputFilterProps) {
  const { getParam, setParam, deleteParam } = useQueryParamSync();
  const [inputValue, setInputValue] = useState(() => {
    const value = getParam(fieldName);
    return value || "";
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleParamChange(value: string) {
    setInputValue(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setParam(fieldName, value, "page");
    }, 1200);
  }

  return (
    <div className={styles.inputFilter}>
      <input
        ref={inputRef}
        placeholder={`Search by ${fieldName}`}
        value={inputValue}
        onChange={(e) => handleParamChange(e.target.value)}
      />
      <div
        className={styles.clear}
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          deleteParam(fieldName, undefined, "page");
          setInputValue("");
          inputRef.current?.focus();
        }}
      >
        <HiOutlineBackspace />
      </div>
    </div>
  );
}

export default InputFilter;
