import GlobalStyle from "../styles";
import Layout from "@/components/Layout";
import useSWR, { SWRConfig } from "swr";

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
  const userId = "65e0925792f086ae06d2eadb";
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/users/${userId}`, fetcher);

  function getRecipeProperty(_id, property) {
    const recipeInteraction = user.recipeInteractions.find(
      (interaction) => interaction.recipe._id === _id
    );
    return recipeInteraction?.[property];
  }

  async function toggleIsFavorite(_id) {
    if (user.recipeInteractions.find((i) => i.recipe._id === _id)) {
      user.recipeInteractions = user.recipeInteractions.map((i) =>
        i.recipe._id === _id ? { ...i, isFavorite: !i.isFavorite } : i
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

  if (error) {
    return (
      <>
        <Layout>
          <GlobalStyle />
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} error={error} />
          </SWRConfig>
        </Layout>
      </>
    );
  }

  if (isLoading || !user) {
    return (
      <>
        <Layout>
          <GlobalStyle />
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} isLoading />
          </SWRConfig>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
        <GlobalStyle />
        <SWRConfig value={{ fetcher }}>
          <Component
            {...pageProps}
            userId={userId}
            user={user}
            getRecipeProperty={getRecipeProperty}
            toggleIsFavorite={toggleIsFavorite}
          />
        </SWRConfig>
      </Layout>
    </>
  );
}
