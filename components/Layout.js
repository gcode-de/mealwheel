import NavBar from "./NavBar";
export default function Layout({ children, user }) {
  return (
    <>
      {children}
      <NavBar user={user} />
    </>
  );
}
