"use client";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function Auth({ children }) {
  const { isLoading, isAuthenticated, user, getToken } = useKindeAuth();
  return <>{isLoading ? <p>Loading...</p> : children}</>;
}
