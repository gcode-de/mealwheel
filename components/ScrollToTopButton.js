import { useEffect, useState } from "react";
import IconButtonLarge from "./Button/IconButtonLarge";

export default function ScrollToTop({ user }) {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  function scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      {backToTopButton && (
        <IconButtonLarge
          style={"arrowUp"}
          bottom={user ? "9rem" : "5rem"}
          onClick={scrollUp}
        />
      )}
    </>
  );
}
