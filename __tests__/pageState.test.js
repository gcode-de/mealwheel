import { fireEvent, render, screen } from "@testing-library/react";

import { PageError, PageLoading } from "@/components/PageState";

jest.mock("@/helpers/svg", () => {
  const React = require("react");
  const Icon = (props) => React.createElement("svg", props);
  return {
    Menu: Icon,
    Pen: Icon,
    PlateWheel: Icon,
    Reload: Icon,
  };
});

describe("shared page states", () => {
  it("announces a loading state with page context", () => {
    render(<PageLoading title="Favoriten" label="Favoriten werden geladen" />);

    expect(screen.getByRole("heading", { name: "Favoriten" })).toBeVisible();
    expect(
      screen.getByRole("status", { name: "Favoriten werden geladen" })
    ).toBeVisible();
  });

  it("shows an actionable error state", () => {
    const retry = jest.fn();
    render(
      <PageError
        title="Meal Wheel"
        message="Rezepte konnten nicht geladen werden."
        onRetry={retry}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Rezepte konnten nicht geladen werden."
    );
    fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
