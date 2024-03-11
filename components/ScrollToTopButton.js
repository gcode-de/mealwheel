import { useEffect, useState } from "react";
import IconButtonLarge from "./Styled/IconButtonLarge";

export default function ScrollToTop() {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
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
        <IconButtonLarge style={"arrowUp"} bottom="10rem" onClick={scrollUp} />
      )}
    </>
  );
}
