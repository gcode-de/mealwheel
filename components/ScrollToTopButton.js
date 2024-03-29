import { useEffect, useState } from "react";
import IconButtonLarge from "./Styled/IconButtonLarge";

export default function ScrollToTop() {
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
        <IconButtonLarge style={"arrowUp"} bottom="9rem" onClick={scrollUp} />
      )}
    </>
  );
}
