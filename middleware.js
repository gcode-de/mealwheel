import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
export default function middleware(req) {
  return withAuth(req, {
    isReturnToCurrentPage: true,
  });
}
export const config = {
  matcher: [
    "/favorites",
    "/profile/settings",
    "/profile/hasCooked",
    "/profile/myRecipes",
    "/profile",
  ],
};
