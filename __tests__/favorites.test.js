import { render, screen } from "@testing-library/react";
import Favorites from "@/pages/profile/favorites";

jest.mock("@/components/Cards/MealCard", () =>
  function MealCard({ recipe }) {
    return <li>{recipe.title}</li>;
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
});
