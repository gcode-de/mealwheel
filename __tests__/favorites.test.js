import { render, screen } from "@testing-library/react";
import Favorites from "@/pages/profile/favorites";

jest.mock("@/components/Cards/MealCard", () =>
  function MealCard({ recipe, onToggleIsFavorite }) {
    return (
      <li>
        {recipe.title}
        <button onClick={onToggleIsFavorite}>Favorit ändern</button>
      </li>
    );
  }
);

jest.mock("@/components/Styled/Header", () =>
  function Header({ text }) {
    return <h1>{text}</h1>;
  }
);

jest.mock("@/components/Loading", () =>
  function LoadingComponent() {
    return <div role="status">Lädt</div>;
  }
);

describe("Favorites", () => {
  it("shows one loading state before deciding whether the user is signed in", () => {
    render(<Favorites isLoading user={undefined} />);

    expect(screen.getByRole("status")).toHaveTextContent("Lädt");
    expect(screen.queryByText(/Bitte/)).not.toBeInTheDocument();
  });

  it("shows the sign-in prompt after anonymous user loading has finished", () => {
    render(<Favorites isLoading={false} user={null} />);

    expect(screen.getByText(/Bitte/)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an API error instead of an empty favorites message", () => {
    render(
      <Favorites
        error={new Error("request failed")}
        isLoading={false}
        user={{ recipeInteractions: [] }}
      />
    );

    expect(screen.getByText("Error...")).toBeInTheDocument();
    expect(screen.queryByText(/noch keine/)).not.toBeInTheDocument();
  });

  it("shows an empty state when the user has no favorites", () => {
    render(
      <Favorites isLoading={false} user={{ recipeInteractions: [] }} />
    );

    expect(screen.getByText(/noch keine Schmeckos/)).toBeInTheDocument();
  });

  it("renders only favorites and forwards the toggle action", () => {
    const toggleIsFavorite = jest.fn();
    const mutateUser = jest.fn();
    const mutateRecipes = jest.fn();
    const favoriteRecipe = { _id: "favorite", title: "Lieblingssuppe" };

    render(
      <Favorites
        isLoading={false}
        user={{
          recipeInteractions: [
            { isFavorite: true, recipe: favoriteRecipe },
            {
              isFavorite: false,
              recipe: { _id: "other", title: "Andere Suppe" },
            },
          ],
        }}
        getRecipeProperty={() => true}
        toggleIsFavorite={toggleIsFavorite}
        mutateUser={mutateUser}
        mutateRecipes={mutateRecipes}
      />
    );

    expect(screen.getByText("Lieblingssuppe")).toBeInTheDocument();
    expect(screen.queryByText("Andere Suppe")).not.toBeInTheDocument();

    screen.getByRole("button", { name: "Favorit ändern" }).click();
    expect(toggleIsFavorite).toHaveBeenCalledWith(
      "favorite",
      mutateUser,
      mutateRecipes
    );
  });
});
