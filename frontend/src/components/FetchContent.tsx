import { Suspense } from "react";
import { Spinner } from "./Spinner";

interface FetchContentProps {
  children: React.ReactNode;
}

export const FetchContent = ({ children }: FetchContentProps) => {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
};
