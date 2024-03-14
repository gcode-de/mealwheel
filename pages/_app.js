import GlobalStyle from "../styles";
import Layout from "@/components/Layout";
import useSWR, { SWRConfig } from "swr";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import Auth from "@/pages/auth";

import { useRouter } from "next/router";
import updateUserinDb from "@/helpers/updateUserInDb";
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

export default function App({ Component, pageProps }) {
  const router = useRouter();

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
    if (!kindeIsAuthenticated) {
      router.push("/api/auth/login");
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

    await updateUserinDb(user, mutateUser);
  }

  async function toggleHasCooked(_id) {
    if (!kindeIsAuthenticated) {
      router.push("/api/auth/login");
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

    await updateUserinDb(user, mutateUser);
  }

  // if (error) {
  //   return (
  //     <>
  //       <Layout>
  //         <GlobalStyle />
  //         <SWRConfig value={{ fetcher }}>
  //           <Component {...pageProps} error={error} />
  //         </SWRConfig>
  //       </Layout>
  //     </>
  //   );
  // }

  // if (isLoading || !user) {
  //   return (
  //     <>
  //       <Layout>
  //         <GlobalStyle />
  //         <SWRConfig value={{ fetcher }}>
  //           <Component {...pageProps} isLoading />
  //         </SWRConfig>
  //       </Layout>
  //     </>
  //   );
  // }

  return (
    <>
      <KindeProvider>
        <Auth>
          <Layout>
            <GlobalStyle />
            <SWRConfig value={{ fetcher }}>
              <Component
                {...pageProps}
                userId={userId}
                // user={user}
                getRecipeProperty={getRecipeProperty}
                toggleIsFavorite={toggleIsFavorite}
                toggleHasCooked={toggleHasCooked}
                // mutateUser={mutate}
                recipes={recipes}
                recipesError={recipesError}
                recipesIsLoading={recipesIsLoading}
              />
            </SWRConfig>
          </Layout>
        </Auth>
      </KindeProvider>
    </>
  );
}
