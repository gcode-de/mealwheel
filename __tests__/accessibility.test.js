import { fireEvent, render, screen } from "@testing-library/react";

import IconButton from "@/components/Button/IconButton";
import LikesDisplay from "@/components/Cards/LikesDisplay";
import ModalComponent from "@/components/Modal";
import NavBar from "@/components/NavBar";
import ToggleCheckbox from "@/components/ToggleCheckbox";

const mockRouter = { pathname: "/", push: jest.fn() };
jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

jest.mock("@/helpers/svg", () => {
  const React = require("react");
  const Icon = (props) => React.createElement("svg", props);

  return {
    ArrowLeft: Icon,
    ArrowSmallLeft: Icon,
    ArrowSmallRight: Icon,
    Bell: Icon,
    Book: Icon,
    Calendar: Icon,
    Edit: Icon,
    Filter: Icon,
    Heart: Icon,
    Leave: Icon,
    Menu: Icon,
    Pizza: Icon,
    Plus: Icon,
    Pot: Icon,
    Profile: Icon,
    Reload: Icon,
    Settings: Icon,
    Shopping: Icon,
    TriangleLeft: Icon,
    TriangleRight: Icon,
    XSmall: Icon,
  };
});

describe("accessible navigation and controls", () => {
  it("marks the current navigation destination", () => {
    render(<NavBar user={null} />);

    expect(
      screen.getByRole("navigation", { name: "Hauptnavigation" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entdecken/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("gives icon-only controls a meaningful name and expanded state", () => {
    render(<IconButton style="Filter" rotate={false} onClick={jest.fn()} />);

    const button = screen.getByRole("button", { name: "Filter öffnen" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("announces the favorite state and action", () => {
    const onToggle = jest.fn();
    render(
      <LikesDisplay
        likes={1}
        $isFavorite
        onToggleIsFavorite={onToggle}
      />
    );

    const button = screen.getByRole("button", {
      name: "Aus Favoriten entfernen",
    });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("keeps toggle checkboxes keyboard-accessible", () => {
    render(
      <ToggleCheckbox
        label="Dienstag"
        defaultChecked
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole("checkbox", { name: "Dienstag" })).toBeChecked();
  });
});

describe("accessible modal", () => {
  it("moves focus into the dialog, closes with Escape and restores focus", () => {
    const closeModal = jest.fn();
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <ModalComponent
        message="Wirklich löschen?"
        btnConfirmMessage="Löschen"
        btnCloseMessage="Abbrechen"
        toggleModal={closeModal}
      />
    );

    const dialog = screen.getByRole("dialog", { name: "Wirklich löschen?" });
    expect(dialog).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeModal).toHaveBeenCalledTimes(1);

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
