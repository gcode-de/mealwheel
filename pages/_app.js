import updateUserinDb from "@/helpers/updateUserInDb";
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
    mutate: mutateRecipes,
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

  // async function toggleIsFavorite(_id) {
  //   if (!user) {
  //     notifyError("Bitte zuerst einloggen.");
  //     return;
  //   }
  //   if (
  //     user.recipeInteractions.find(
  //       (interaction) => interaction.recipe._id === _id
  //     )
  //   ) {
  //     user.recipeInteractions = user.recipeInteractions.map((interaction) =>
  //       interaction.recipe._id === _id
  //         ? { ...interaction, isFavorite: !interaction.isFavorite }
  //         : interaction
  //     );
  //   } else {
  //     user.recipeInteractions.push({ isFavorite: true, recipe: _id });
  //   }
  //   updateUserinDb(user, mutate);
  // }

  async function toggleIsFavorite(_id, mutateUser, mutateRecipes) {
    if (!user) {
      notifyError("Bitte zuerst einloggen.");
      return;
    }

    let likeChange = 0; // Standardmäßig keine Veränderung der Likes

    // Durchgehe das Array und aktualisiere oder füge die Interaktion hinzu
    const updatedRecipeInteractions = user.recipeInteractions.map(
      (interaction) => {
        if (interaction.recipe._id === _id) {
          // Existierende Interaktion für das Rezept gefunden
          likeChange = interaction.isFavorite ? -1 : 1; // Bestimme, ob wir einen Like hinzufügen oder entfernen basierend auf dem aktuellen Favoritenstatus
          return { ...interaction, isFavorite: !interaction.isFavorite }; // Umschalten von isFavorite
        }
        return interaction;
      }
    );

    // Wenn keine bestehende Interaktion gefunden wurde, füge eine neue hinzu
    if (likeChange === 0) {
      updatedRecipeInteractions.push({ recipe: { _id }, isFavorite: true });
      likeChange = 1; // Ein Like hinzufügen, da es eine neue Interaktion ist
    }

    // Aktualisiere den Benutzer in der Datenbank mit den neuen recipeInteractions
    user.recipeInteractions = updatedRecipeInteractions;
    await updateUserinDb(user, mutateUser);

    try {
      // Unabhängig davon, ob es eine neue oder bestehende Interaktion ist, aktualisiere die Likes
      await updateLikes(_id, likeChange, mutateRecipes);
    } catch (error) {
      console.error(error);
      notifyError(
        "Ein Fehler ist aufgetreten beim Aktualisieren der Likes. Bitte versuche es später erneut."
      );
      return; // Beende die Funktion hier, um weitere Ausführungen zu verhindern
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
              mutateUser={mutate}
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
