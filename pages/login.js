import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  //   const { data: session } = useSession();

  return (
    <>
      {/* Signed in as {session.user.email} <br /> */}
      <button type="button" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
