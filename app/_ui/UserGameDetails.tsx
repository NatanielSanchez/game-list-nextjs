"use client";
import toast from "react-hot-toast";
import useIsMutatingUserGame from "../_lib/useIsMutatingUserGame";
import useUpdateUserGame from "../_lib/useUpdateUserGame";
import useUserGame from "../_lib/useUserGame";
import Spinner from "./Spinner";
import StarRating from "./StarRating";
import UserReview from "./UserReview";

function UserGameDetails({ userId, gameId }: { userId: number; gameId: number }) {
  const { userGame, isFetchingGameState, error } = useUserGame(userId, gameId);
  const { updateUserGame } = useUpdateUserGame(userId, gameId);
  const isMutating = useIsMutatingUserGame(userId, gameId);

  const isLoading = isFetchingGameState || isMutating;
  if (isFetchingGameState) return <Spinner />;
  if (error) return null;

  return (
    userGame && (
      <>
        <StarRating
          size={30}
          maxRating={10}
          noRatingMessage="Leave a score!"
          defaultRating={userGame.score || 0}
          color={isLoading ? "var(--color-grey-500)" : "var(--color-yellow-500)"}
          disabled={isLoading}
          onSetRating={(rating) =>
            updateUserGame(
              { ...userGame, score: rating },
              {
                onSuccess() {
                  toast.success("Successfully updated user game score.");
                },
              }
            )
          }
        />
        <UserReview
          defaultValue={userGame.review || ""}
          isLoading={isLoading}
          onSave={(review) =>
            updateUserGame(
              { ...userGame, review },
              {
                onSuccess() {
                  toast.success("Successfully updated user game review.");
                },
              }
            )
          }
        />
      </>
    )
  );
}

export default UserGameDetails;
