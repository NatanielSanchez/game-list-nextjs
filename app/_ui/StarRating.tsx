"use client";
import { useState } from "react";
import styles from "@/app/_styles/StarRating.module.scss";

type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number; // in px
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
  disabled?: boolean;
  noRatingMessage?: string;
};

// --asigning a value to a prop sets a default value if none was passed
// --you can accept functions that receive the curent state of this component (onSetRating), so it can be used outside the component!
export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
  disabled = false,
  noRatingMessage = "",
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  function handleRate(rating: number) {
    setRating(rating);
    onSetRating?.(rating);
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.starContainer}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            filled={hoverRating ? i <= hoverRating - 1 : i <= rating - 1}
            key={i}
            onRate={() => {
              if (disabled) return;
              handleRate(i + 1);
            }}
            onHoverIn={() => {
              if (disabled) return;
              setHoverRating(i + 1);
            }}
            onHoverLeave={() => {
              if (disabled) return;
              setHoverRating(0);
            }}
            color={color}
            size={size}
            disabled={disabled}
          />
        ))}
      </div>
      <p style={{ lineHeight: 1, margin: 0, color, fontSize: `${size / 1.5}px` }}>
        {messages.length === maxRating
          ? messages[hoverRating ? hoverRating - 1 : rating - 1]
          : hoverRating || rating || noRatingMessage}
      </p>
    </div>
  );
}

type StarProps = {
  onRate: () => void;
  filled: boolean;
  onHoverIn: () => void;
  onHoverLeave: () => void;
  color: string;
  size: number; // in px
  disabled: boolean;
};

function Star({ onRate, filled, onHoverIn, onHoverLeave, color, size, disabled }: StarProps) {
  return (
    <span
      style={{
        display: "block",
        width: `${size}px`,
        height: `${size}px`,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      role="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverLeave}
    >
      {filled ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ fill: color, stroke: color }}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: "none", stroke: color }}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
