"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import styles from "@/app/_styles/UserReview.module.scss";
import Button from "./Button";

type UserReviewProps = {
  defaultValue: string;
  isLoading: boolean;
  onSave: (review: string) => void;
};
function UserReview({ defaultValue, isLoading, onSave }: UserReviewProps) {
  const [review, setReview] = useState(defaultValue);
  return (
    <>
      <TextareaAutosize
        className={styles.textArea}
        disabled={isLoading}
        placeholder="Leave a review!"
        minRows={4}
        maxRows={8}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className={styles.buttons}>
        <Button
          size="small"
          variation="primary"
          disabled={isLoading || review === defaultValue}
          onClick={() => onSave(review)}
        >
          Save review
        </Button>
        <Button
          size="small"
          variation="secondary"
          disabled={isLoading || review === ""}
          onClick={() => {
            setReview("");
          }}
        >
          Clear review
        </Button>
        <Button
          size="small"
          variation="danger"
          disabled={isLoading || defaultValue === ""}
          onClick={() => {
            setReview("");
            onSave("");
          }}
        >
          Delete review
        </Button>
      </div>
    </>
  );
}

export default UserReview;
