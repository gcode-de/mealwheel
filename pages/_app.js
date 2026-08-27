import updateUserinDb from "@/helpers/updateUserInDb";
import updateLikes from "@/helpers/updateLikes";
import {
  getPageDataRequirements,
  getRecipeId,
} from "@/helpers/pageDataRequirements";

import Layout from "../components/Layout";
import PwaRegistration from "@/components/PwaRegistration";
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { pathname } = useRouter();
  const {
    needsAllUsers,
    needsHousehold,
    needsRecipes,
    allUsersKey,
    currentUserKey,
  } = getPageDataRequirements(pathname);

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

    const updatedUser = {
      ...user,
      recipeInteractions: updatedRecipeInteractions,
    };

    try {
      await Promise.all([
        updateLikes(_id, likeChange, mutateRecipes),
        updateUserinDb(updatedUser, mutateUser),
      ]);
    } catch (error) {
      console.error(error);
      notifyError(
        "Ein Fehler ist aufgetreten beim Aktualisieren der Likes. Bitte versuche es später erneut."
      );
      return;
    }

  }

  async function toggleHasCooked(_id) {
    if (!user) {
      notifyError("Bitte zuerst einloggen.");
      return;
    }
    let updatedRecipeInteractions;
    if (
      user.recipeInteractions.find(
        (interaction) => String(getRecipeId(interaction)) === String(_id)
      )
    ) {
      updatedRecipeInteractions = user.recipeInteractions.map((interaction) =>
        String(getRecipeId(interaction)) === String(_id)
          ? { ...interaction, hasCooked: !interaction.hasCooked }
          : interaction
      );
    } else {
      updatedRecipeInteractions = [
        ...user.recipeInteractions,
        { hasCooked: true, recipe: _id },
      ];
    }
    updateUserinDb(
      { ...user, recipeInteractions: updatedRecipeInteractions },
      mutate
    ).catch(() => notifyError("Änderung konnte nicht gespeichert werden."));
  }

  return (
    <>
      <GlobalStyle />
      <PwaRegistration />
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
