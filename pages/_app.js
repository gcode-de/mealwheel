import GlobalStyle from "../styles";
import Layout from "@/components/Layout";

import { SessionProvider } from "next-auth/react";
import useSWR, { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const userId = "65e0925792f086ae06d2eadb";
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/users/${userId}`, fetcher);
  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes`, fetcher);

  function getRecipeProperty(_id, property) {
    const recipeInteraction = user?.recipeInteractions.find(
      (interaction) => interaction.recipe._id === _id
    );
    return recipeInteraction?.[property];
  }

  async function toggleIsFavorite(_id) {
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

    const response = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      mutate();
    }
  }

  async function toggleHasCooked(_id) {
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

    const response = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      mutate();
    }
  }

  if (error) {
    return (
      <>
        <GlobalStyle />
        <SessionProvider session={session}>
          <Layout>
            <SWRConfig value={{ fetcher }}>
              <Component {...pageProps} error={error} />
            </SWRConfig>
          </Layout>
        </SessionProvider>
      </>
    );
  }

  if (isLoading || !user) {
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
      <SessionProvider session={session}>
        <SWRConfig value={{ fetcher }}>
          <Layout>
            <ToastContainer />
            <Component
              {...pageProps}
              userId={userId}
              user={user}
              getRecipeProperty={getRecipeProperty}
              toggleIsFavorite={toggleIsFavorite}
              toggleHasCooked={toggleHasCooked}
              mutateUser={mutate}
              recipes={recipes}
              recipesError={recipesError}
              recipesIsLoading={recipesIsLoading}
            />
          </Layout>
        </SWRConfig>
      </SessionProvider>
    </>
  );
}
