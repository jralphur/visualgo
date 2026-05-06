import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { type ErrorRouteComponent, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const FetchError: ErrorRouteComponent = ({ error }) => {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      {error.message}
      <button
        type="button"
        onClick={() => {
          // Invalidate the route to reload the loader, and reset any router error boundaries
          router.invalidate();
        }}
      >
        retry
      </button>
    </div>
  );
};
