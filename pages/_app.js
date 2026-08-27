import updateUserinDb from "@/helpers/updateUserInDb";
import updateLikes from "@/helpers/updateLikes";

import Layout from "../components/Layout";
import GlobalStyle from "../styles";

import { SessionProvider } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";
import { useRouter } from "next/router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyError } from "/helpers/toast";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const fetchCurrentUser = async (url) => {
  const response = await fetch(url);

  if (response.status === 403) return null;
  if (!response.ok) throw new Error("User konnte nicht geladen werden.");

  return response.json();
};

const routesWithAllUsers = new Set([
  "/admin",
  "/profile",
  "/profile/settings",
  "/profile/collections/[id]",
  "/profile/community",
  "/profile/community/active",
  "/profile/community/[id]",
  "/recipe/[id]",
]);

const routesWithHousehold = new Set([
  "/plan",
  "/shopping",
  "/profile/settings",
  "/recipe/[id]",
]);

const routesWithRecipes = new Set([
  "/admin",
  "/plan",
  "/profile/myRecipes",
  "/profile/collections/[id]",
  "/profile/community/[id]",
]);

const routesWithPopulatedUserRecipes = new Set([
  "/plan",
  "/profile/favorites",
  "/profile/hasCooked",
  "/profile/collections/[id]",
]);

function getRecipeId(interaction) {
  return interaction.recipe?._id || interaction.recipe;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { pathname } = useRouter();
  const needsAllUsers = routesWithAllUsers.has(pathname);
  const needsHousehold = routesWithHousehold.has(pathname);
  const needsRecipes = routesWithRecipes.has(pathname);
  const needsPopulatedUserRecipes =
    routesWithPopulatedUserRecipes.has(pathname);
  const allUsersKey = needsAllUsers
    ? `/api/users${
        pathname === "/profile/collections/[id]"
          ? "?include=collections"
          : ""
      }`
    : null;
  const currentUserKey = `/api/users/user${
    needsPopulatedUserRecipes ? "?include=recipes" : ""
  }`;

  const {
    data: allUsers,
    isLoading: allUsersAreLoading,
    error: allUsersError,
    mutate: mutateAllUsers,
  } = useSWR(allUsersKey, fetcher);

  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR(currentUserKey, fetchCurrentUser);

  const {
    data: household,
    isLoading: householdIsLoading,
    error: householdError,
    mutate: mutateHousehold,
  } = useSWR(
    needsHousehold && user?.activeHousehold
      ? `/api/households/${user.activeHousehold}`
      : null,
    fetcher
  );

  const userIsHouseholdAdmin = household?.members.some((member) => {
    return (
      member._id === user._id &&
      (member.role === "owner" || member.role === "canWrite")
    );
  });

  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
    mutate: mutateRecipes,
  } = useSWR(needsRecipes ? `/api/recipes` : null, fetcher);

  const appIsLoading =
    isLoading ||
    (needsAllUsers && allUsersAreLoading) ||
    (needsHousehold && Boolean(user) && householdIsLoading) ||
    (needsRecipes && recipesIsLoading);

  const appError =
    error ||
    (needsAllUsers && allUsersError) ||
    (needsHousehold && householdError) ||
    (needsRecipes && recipesError);

  function getRecipeProperty(_id, property) {
    const recipeInteraction = user?.recipeInteractions.find(
      (interaction) => String(getRecipeId(interaction)) === String(_id)
    );
    return recipeInteraction?.[property];
  }

  async function toggleIsFavorite(_id, mutateUser, mutateRecipes) {
    if (!user) {
      notifyError("Bitte zuerst einloggen.");
      return;
    }

    let likeChange = 0;

    const updatedRecipeInteractions = user.recipeInteractions.map(
      (interaction) => {
        if (String(getRecipeId(interaction)) === String(_id)) {
          likeChange = interaction.isFavorite ? -1 : 1;
          return { ...interaction, isFavorite: !interaction.isFavorite };
        }
        return interaction;
      }
    );

    if (likeChange === 0) {
      updatedRecipeInteractions.push({ recipe: { _id }, isFavorite: true });
      likeChange = 1;
    }

    try {
      await updateLikes(_id, likeChange, mutateRecipes);
    } catch (error) {
      console.error(error);
      notifyError(
        "Ein Fehler ist aufgetreten beim Aktualisieren der Likes. Bitte versuche es später erneut."
      );
      return;
    }

    user.recipeInteractions = updatedRecipeInteractions;
    await updateUserinDb(user, mutateUser);
  }

  async function toggleHasCooked(_id) {
    if (!user) {
      notifyError("Bitte zuerst einloggen.");
      return;
    }
    if (
      user.recipeInteractions.find(
        (interaction) => String(getRecipeId(interaction)) === String(_id)
      )
    ) {
      user.recipeInteractions = user.recipeInteractions.map((interaction) =>
        String(getRecipeId(interaction)) === String(_id)
          ? { ...interaction, hasCooked: !interaction.hasCooked }
          : interaction
      );
    } else {
      user.recipeInteractions.push({ hasCooked: true, recipe: _id });
    }
    updateUserinDb(user, mutate);
  }

  return (
    <>
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <SessionProvider session={session}>
          <Layout user={user}>
            <ToastContainer />
            <Component
              {...pageProps}
              error={appError}
              isLoading={appIsLoading}
              user={user}
              userIsHouseholdAdmin={userIsHouseholdAdmin}
              mutateUser={mutate}
              household={household}
              householdIsLoading={householdIsLoading}
              householdError={householdError}
              mutateHousehold={mutateHousehold}
              getRecipeProperty={getRecipeProperty}
              toggleIsFavorite={toggleIsFavorite}
              toggleHasCooked={toggleHasCooked}
              recipes={recipes}
              mutateRecipes={mutateRecipes}
              recipesError={recipesError}
              recipesIsLoading={recipesIsLoading}
              allUsers={allUsers}
              mutateAllUsers={mutateAllUsers}
            />
          </Layout>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
//trigger redeployment
