// import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
// import Auth from "@/pages/auth";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

import NavBar from "./NavBar";

export default function Layout({ children }) {
  const { user } = useKindeAuth();
  const kindeUserId = user?.id;
  console.log(user);
  return (
    // <KindeProvider>
    //   <Auth>
    <>
      {children}
      {/* </Auth> */}
      <NavBar />
    </>
    // </KindeProvider>
  );
}
