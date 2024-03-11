import styled from "styled-components";
import StyledArticle from "./Styled/StyledArticle";
import IconButton from "./Styled/IconButton";
import StyledList from "./Styled/StyledList";
import { Fragment, useState } from "react";
import StyledListItem from "./Styled/StyledListItem";
import StyledH2 from "./Styled/StyledH2";
import Plus from "@/public/icons/Plus.svg";
import StyledP from "./Styled/StyledP";
import { useRouter } from "next/router";
import Button from "./Styled/StyledButton";
import Image from "next/image";

export default function RecipeForm({ onSubmit, data }) {
  const [imageUrl, setImageUrl] = useState(data ? data.imageLink : "");
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
  const router = useRouter();

  const uploadImage = async (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "meal_wheel");
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/mealwheel/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await uploadResponse.json();
    setImageUrl(file.secure_url);
  };

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
    const newData = { ...data, ingredients, imageLink: imageUrl };
    onSubmit(newData);
  }
  return (
    <>
      <StyledTop $height={imageUrl}>
        <IconButton
          right="1rem"
          top="1rem"
          style={"x"}
          onClick={() => {
            router.back();
          }}
        ></IconButton>
        {imageUrl && (
          <StyledImageCloudinary
            src={imageUrl}
            alt="Uploaded Image"
            width={100}
            height={300}
          />
        )}
        <StyledImageUploadContainer>
          <Plus width={40} height={40} />
          <StyledImageUpload type="file" onChange={uploadImage} />
        </StyledImageUploadContainer>
      </StyledTop>
      <form onSubmit={handleSubmit}>
        <StyledArticle>
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
              <StyledListItem key={index}>
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
              </StyledListItem>
            ))}
            <AddIngredientButton type="button" onClick={addIngredient}>
              <Plus width={20} height={20} />
            </AddIngredientButton>
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
          <Button type="submit">speichern</Button>
        </StyledArticle>
      </form>
    </>
  );
}

const StyledImageUpload = styled.input`
  display: none;
`;

const StyledImageCloudinary = styled(Image)`
  width: 100%;
  height: auto;
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
  width: 100%;
  padding: 0.7rem;
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: ${(props) => (props.$width ? props.$width : "100%")};
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;

const StyledDropDown = styled.select`
  background-color: transparent;
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  display: flex;
  height: 30px;
  align-items: center;
`;
const AddIngredientButton = styled.button`
  width: 3rem;
  border: none;
  background-color: var(--color-background);
  border-radius: 10px;
  height: 30px;
`;
