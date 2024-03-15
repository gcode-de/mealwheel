import StyledListItem from "../Styled/StyledListItem";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import styled from "styled-components";
import StyledArticle from "../Styled/StyledArticle";
import IconButton from "../Styled/IconButton";
import StyledList from "../Styled/StyledList";
import StyledH2 from "../Styled/StyledH2";
import Button from "../Styled/StyledButton";
import StyledP from "../Styled/StyledP";
import AddButton from "../Styled/AddButton";
import Plus from "@/public/icons/Plus.svg";
import StyledIngredients from "../Styled/StyledIngredients";
import StyledInput from "../Styled/StyledInput";
import StyledDropDown from "../Styled/StyledDropDown";
import { notifySuccess, notifyError } from "/helpers/toast";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";

export default function RecipeForm({ onSubmit, onDelete, data, formName }) {
  const [difficulty, setDifficulty] = useState(
    data && data.difficulty ? data.difficulty : "easy"
  );
  const [ingredients, setIngredients] = useState(
    data
      ? data.ingredients
      : [
          {
            quantity: "",
            unit: "",
            name: "",
          },
        ]
  );
  const [preview, setPreview] = useState(data ? data.imageLink : "");
  const [imageUrl, setImageUrl] = useState(data ? data.imageLink : "");
  const router = useRouter();
  function handleInputChange(event, index, field) {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = event.target.value;
    setIngredients(newIngredients);
  }
  function addIngredient() {
    setIngredients([
      ...ingredients,
      {
        quantity: "",
        unit: "",
        name: "",
      },
    ]);
  }
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(imageUrl);
    const newData = {
      ...data,
      ingredients,
      imageLink: imageUrl.imageUrl,
      publicId: imageUrl.publicId,
    };

    onSubmit(newData);
  }

  async function uploadImage(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formName === "addRecipe" || !data.imageLink) {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const file = await response.json();

        setImageUrl(file);
        notifySuccess("Bild hinzugefügt");
      } else {
        console.error("image not added");
        notifyError("Bild konnte nicht hinzugefügt werden");
      }
    }
    if (formName === "editRecipe" && data.imageLink) {
      const deleteImage = data.publicId;
      if (data.publicId) {
        handleDeleteImage(deleteImage);
      }
      const responseUpload = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (responseUpload.ok) {
        const file = await responseUpload.json();
        setImageUrl(file);
        notifySuccess("Bild geupdatet");
      } else {
        console.error("no image update");
        notifyError("Bild konnte nicht hinzugefügt werden");
      }
    }
  }
  function handleImage(event) {
    const file = event.target.files[0];
    setPreview({ imageUrl: URL.createObjectURL(file) });
  }
  return (
    <>
      <StyledTop $height={data?.imageLink}>
        <IconButton
          right="1rem"
          top="1rem"
          style={"x"}
          onClick={() => {
            router.back();
          }}
        ></IconButton>
        {preview && (
          <StyledImageCloudinary
            src={
              preview.imageUrl || "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"
            }
            alt="Uploaded Image"
            width={100}
            height={300}
          />
        )}

        <StyledImageUploadContainer htmlFor="upload">
          <form onSubmit={uploadImage}>
            <Plus width={40} height={40} />
            <StyledImageInput
              type="file"
              name="file"
              id="upload"
              onChange={handleImage}
            />
            <button type="submit">hinzufügen</button>
          </form>
        </StyledImageUploadContainer>
      </StyledTop>
      <form onSubmit={handleSubmit}>
        <StyledArticle>
          <Spacer />
          <StyledBigInput
            type="text"
            name="title"
            placeholder="Titel"
            required
            aria-label="add titel of the recipe"
            defaultValue={data?.title}
          />
          <StyledListItem>
            <StyledInput
              type="number"
              name="duration"
              placeholder="Dauer"
              $width={"5rem"}
              required
              min="0"
              aria-label="add duration to cook for the recipe"
              defaultValue={data?.duration}
            />
            <StyledP>min</StyledP>

            <StyledDropDown
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
              name="difficulty"
              required
            >
              <option value="easy">Anfänger</option>
              <option value="medium">Fortgeschritten</option>
              <option value="hard">Profi</option>
            </StyledDropDown>
          </StyledListItem>
          <StyledH2>Zutaten</StyledH2>
          <StyledList>
            {ingredients.map((ingredient, index) => (
              <StyledIngredients key={index}>
                <StyledInput
                  value={ingredient.quantity}
                  onChange={(event) =>
                    handleInputChange(event, index, "quantity")
                  }
                  type="number"
                  $width={"3rem"}
                  required
                  min="0"
                  aria-label="add ingredient quantity for the recipe"
                />
                <StyledDropDown
                  required
                  name="unit"
                  onChange={(event) => handleInputChange(event, index, "unit")}
                  defaultValue={ingredient.unit}
                >
                  <option value="">-</option>
                  <option value="ml">ml</option>
                  <option value="piece">Stück</option>
                  <option value="gramm">g</option>
                  <option value="EL">EL</option>
                  <option value="TL">TL</option>
                  <option value="Prise">Prise</option>
                </StyledDropDown>
                <StyledInput
                  value={ingredient.name}
                  onChange={(event) => handleInputChange(event, index, "name")}
                  type="text"
                  name="name"
                  placeholder={`${index + 1}. Zutat`}
                  aria-label="add igredient name for the recipe"
                />
              </StyledIngredients>
            ))}
            <AddButton
              type="button"
              $color="var(--color-background)"
              onClick={addIngredient}
            >
              <Plus width={20} height={20} />
            </AddButton>
          </StyledList>
          <StyledH2>Anleitung</StyledH2>
          <StyledBigInput
            type="text"
            name="instructions"
            required
            aria-label="add instructions for creating the recipe"
            defaultValue={data?.instructions}
          />
          <StyledH2>Video</StyledH2>
          <StyledInput
            type="link"
            name="youtubeLink"
            defaultValue={data?.youtubeLink}
          />
          <ButtonContainer>
            <Button type="submit">speichern</Button>
            {onDelete && <Button onClick={onDelete}>Rezept löschen</Button>}
          </ButtonContainer>
        </StyledArticle>
      </form>
    </>
  );
}

const StyledImageCloudinary = styled(Image)`
  width: 100%;
  height: auto;
`;

const StyledTop = styled.div`
  height: ${(props) => (props.$height ? "none" : "300px")};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledBigInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 50px;
  width: calc(100% - (2 * var(--gap-out)));
  padding: 0.7rem;
`;
const StyledImageInput = styled.input`
  display: none;
`;
const Spacer = styled.div`
  margin-top: 2rem;
  position: relative;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - (2 * var(--gap-out)));
`;
const StyledImageUploadContainer = styled.label`
  display: inline-block;
  background-color: white;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  cursor: pointer;
  position: absolute;
`;
