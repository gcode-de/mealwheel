import updateUserinDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import updateLikes from "@/helpers/updateLikes";

import Layout from "../components/Layout";
import GlobalStyle from "../styles";

import { SessionProvider } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifySuccess, notifyError } from "/helpers/toast";

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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const {
    data: allUsers,
    isLoading: allUsersAreLoading,
    error: allUsersError,
    mutate: mutateAllUsers,
  } = useSWR(`/api/users`, fetcher);

  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/users/user`, fetcher);

  const {
    data: household,
    isLoading: householdIsLoading,
    error: householdError,
    mutate: mutateHousehold,
  } = useSWR(user ? `/api/households/${user.activeHousehold}` : null, fetcher);

  const userIsHouseholdAdmin = household?.members.some(
    (member) =>
      member._id === user._id && member.role === ("owner" || "canWrite")
  );

  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
    mutate: mutateRecipes,
  } = useSWR(`/api/recipes`, fetcher);

  function getRecipeProperty(_id, property) {
    const recipeInteraction = user?.recipeInteractions.find(
      (interaction) => interaction.recipe._id === _id
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
        if (interaction.recipe._id === _id) {
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

    user.recipeInteractions = updatedRecipeInteractions;
    await updateUserinDb(user, mutateUser);

    try {
      await updateLikes(_id, likeChange, mutateRecipes);
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
    if (
      user.recipeInteractions.find(
        (interaction) => interaction.recipe._id === _id
      )
    ) {
      user.recipeInteractions = user.recipeInteractions.map((interaction) =>
        interaction.recipe._id === _id
          ? { ...interaction, hasCooked: !interaction.hasCooked }
          : interaction
      );
    } else {
      user.recipeInteractions.push({ hasCooked: true, recipe: _id });
    }
    updateUserinDb(user, mutate);
  }

  if (isLoading || householdIsLoading || recipesIsLoading) {
    return (
      <>
        <GlobalStyle />
        <SessionProvider session={session}>
          <Layout>
            <SWRConfig value={{ fetcher }}>
              <Component {...pageProps} isLoading />
            </SWRConfig>
          </Layout>
        </SessionProvider>
      </>
    );
  }

  if (recipesError) {
    return (
      <>
        <GlobalStyle />
        <SessionProvider session={session}>
          <Layout>
            <SWRConfig value={{ fetcher }}>
              <Component {...pageProps} recipesError />
            </SWRConfig>
          </Layout>
        </SessionProvider>
      </>
    );
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
