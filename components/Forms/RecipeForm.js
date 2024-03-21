import StyledListItem from "../Styled/StyledListItem";
import StyledArticle from "../Styled/StyledArticle";
import IconButton from "../Styled/IconButton";
import StyledList from "../Styled/StyledList";
import StyledH2 from "../Styled/StyledH2";
import Button from "../Styled/StyledButton";
import StyledP from "../Styled/StyledP";
import AddButton from "../Styled/AddButton";
import Plus from "/public/icons/svg/plus.svg";
import StyledIngredients from "../Styled/StyledIngredients";
import StyledInput from "../Styled/StyledInput";
import StyledDropDown from "../Styled/StyledDropDown";
import StyledProgress from "../Styled/StyledProgress";

import { filterTags } from "/helpers/filterTags";
import { ingredientUnits } from "@/helpers/ingredientUnits";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";
import handlePostImage from "@/helpers/Cloudinary/handlePostImage";

import styled from "styled-components";
import { notifySuccess, notifyError } from "/helpers/toast";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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

  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState(data ? data.diet : []);
  const [imageUrl, setImageUrl] = useState(data ? data.imageLink : "");
  const [upload, setUpload] = useState(false);

  function handleTagChange(value) {
    setSelectedTags(
      selectedTags.includes(value)
        ? selectedTags.filter((item) => item !== value)
        : [value]
    );
  }

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
    const newData = {
      ...data,
      ingredients,

      imageLink: imageUrl.imageUrl,
      diet: selectedTags,
      public: event.target.public.checked,
      publicId: imageUrl.publicId,
    };

    onSubmit(newData);
  }

  async function uploadImage(event) {
    event.preventDefault();
    setUpload(true);

    const file = event.target.files[0];
    setImageUrl({ imageUrl: URL.createObjectURL(file) });

    const formData = new FormData();
    formData.append("file", file);

    if (formName === "addRecipe" || !data.imageLink) {
      handlePostImage(formData, setImageUrl);
    }
    if (formName === "editRecipe" && data.imageLink) {
      const deleteImage = data.publicId;
      if (data.publicId) {
        handleDeleteImage(deleteImage);
      }
      handlePostImage(formData, setImageUrl);
    }
    setUpload(false);
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
        {upload && <StyledProgress />}
        {imageUrl && (
          <StyledImageCloudinary
            src={
              imageUrl.imageUrl ||
              data.imageLink ||
              "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"
            }
            alt="Uploaded Image"
            width={100}
            height={300}
          />
        )}

        <StyledImageUploadContainer htmlFor="upload">
          <form>
            <Plus width={40} height={40} />
            <HiddenInput
              type="file"
              name="file"
              id="upload"
              onChange={uploadImage}
            />
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
                  {ingredientUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
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
          {filterTags
            .filter(({ type }) => type === "diet")
            .map(({ label, type, options }) => (
              <div key={type}>
                <StyledH2>{label}</StyledH2>
                <StyledCategoriesDiv>
                  {options.map((option) => (
                    <StyledCategoryButton
                      key={option.value}
                      type="button"
                      $isActive={selectedTags.includes(option.value)}
                      onClick={() => handleTagChange(option.value)}
                    >
                      {option.label}
                    </StyledCategoryButton>
                  ))}
                </StyledCategoriesDiv>
              </div>
            ))}
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
          <StyledCheckboxContainer>
            <label htmlFor="public">
              öffentlich sichtbar
              <StyledHiddenCheckbox
                type="checkbox"
                id="public"
                name="public"
                defaultChecked={data ? data.public : true}
              />
              <StyledSliderCheckbox htmlFor="public" />
            </label>
          </StyledCheckboxContainer>
          <ButtonContainer>
            <Button type="submit">speichern</Button>
            {onDelete && (
              <Button type="button" onClick={onDelete}>
                Rezept löschen
              </Button>
            )}
          </ButtonContainer>
        </StyledArticle>
      </form>
    </>
  );
}

const StyledImageCloudinary = styled(Image)`
  width: 100%;
  height: auto;
  opacity: 0.3;
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
const Spacer = styled.div`
  margin-top: 2rem;
  position: relative;
`;

const StyledCategoriesDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-top: 0.25rem;
`;

const StyledCategoryButton = styled.button`
  background-color: ${(props) =>
    props.$isActive ? "var(--color-darkgrey)" : "var(--color-component)"};
  color: ${(props) =>
    props.$isActive ? "var(--color-component)" : "var(--color-darkgrey)"};
  border: solid var(--color-darkgrey) 1px;
  border-radius: var(--border-radius-small);
  width: 6rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
`;

const StyledCheckboxContainer = styled.div`
  label {
    color: var(--color-text);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }
`;

const StyledHiddenCheckbox = styled.input`
  display: none;
`;
const StyledSliderCheckbox = styled.span`
  position: relative;
  margin-left: 1rem;
  margin-top: 0rem;
  height: 2rem;
  width: 3.5rem;
  background-color: var(--color-background);
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: inset 0 0 5px rgba(77, 74, 74, 0.1);

  &:before {
    content: "";
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--color-component);
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  input:checked + & {
    background-color: var(--color-darkgrey);
  }

  input:checked + &:before {
    transform: translateX(1.5rem);
  }
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

const HiddenInput = styled.input`
  display: none;
`;
