import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import Auth from "@/pages/auth";

import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <KindeProvider>
      <Auth>{children}</Auth>
      <NavBar />
    </KindeProvider>
  );
}
