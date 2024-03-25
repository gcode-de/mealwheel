import GlobalStyle from "../styles";
import Layout from "../components/Layout";

import { SessionProvider } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import updateUserinDb from "@/helpers/updateUserInDb";
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
  //fetcher
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/users/user`, fetcher);

  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes`, fetcher);

  const {
    data: allUsers,
    isLoading: allUsersAreLoading,
    error: allUsersError,
    mutate: mutateAllUsers,
  } = useSWR(`/api/users`, fetcher);

  //recipe Interaction
  function getRecipeProperty(_id, property) {
    const recipeInteraction = user?.recipeInteractions.find(
      (interaction) => interaction.recipe._id === _id
    );
    return recipeInteraction?.[property];
  }

  async function toggleIsFavorite(_id) {
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
          ? { ...interaction, isFavorite: !interaction.isFavorite }
          : interaction
      );
    } else {
      user.recipeInteractions.push({ isFavorite: true, recipe: _id });
    }
    updateUserinDb(user, mutate);
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

  if (isLoading) {
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
              getRecipeProperty={getRecipeProperty}
              toggleIsFavorite={toggleIsFavorite}
              toggleHasCooked={toggleHasCooked}
              mutateUser={mutate}
              recipes={recipes}
              recipesError={recipesError}
              recipesIsLoading={recipesIsLoading}
              allUsers={allUsers}
            />
          </Layout>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
