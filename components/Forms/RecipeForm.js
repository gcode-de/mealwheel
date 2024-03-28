import IconButton from "../Button/IconButton";
import AddButton from "../Button/AddButton";
import SetNumberOfPeople from "../Cards/SetNumberOfPeople";
import { Plus, Minus } from "@/helpers/svg";
import ToggleCheckbox from "../ToggleCheckbox";
import { Input, Select, H2, Button, P, Article, List } from "../Styled/Styled";
import StyledIngredients from "../Styled/StyledIngredients";
import StyledProgress from "../StyledProgress";

import { filterTags } from "/helpers/filterTags";
import { ingredientUnits } from "@/helpers/ingredientUnits";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";
import handlePostImage from "@/helpers/Cloudinary/handlePostImage";

import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function RecipeForm({ onSubmit, onDelete, data, formName }) {
  const [difficulty, setDifficulty] = useState(
    data && data.difficulty ? data.difficulty : "easy"
  );
  const [ingredients, setIngredients] = useState(
    data
      ? data.ingredients.map((ingredient) => {
          return {
            ...ingredient,
            quantity: ingredient.quantity * data?.defaultNumberOfServings,
          };
        })
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
  const [selectedMealtype, setSelectedMealtype] = useState(
    data?.mealtype ? data.mealtype : []
  );
  const [imageUrl, setImageUrl] = useState(data ? data.imageLink : "");
  const [servings, setServings] = useState(
    data?.servings ? data?.defaultNumberOfServings : 2
  );

  const [upload, setUpload] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  function handleSetNumberOfPeople(change) {
    setServings((prevServings) => prevServings + change);
  }

  function handleTagChange(value) {
    setSelectedTags(
      selectedTags.includes(value)
        ? selectedTags.filter((item) => item !== value)
        : [value]
    );
  }

  function handleMealtypeChange(value) {
    setSelectedMealtype(
      selectedMealtype.includes(value)
        ? selectedMealtype.filter((item) => item !== value)
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
  function deleteIngredient() {
    setIngredients((prevIngredients) =>
      prevIngredients.slice(0, prevIngredients.length - 1)
    );
  }
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const newData = {
      ...data,
      ingredients: ingredients.map((ingredient) => {
        return {
          ...ingredient,
          quantity: ingredient.quantity / Number(servings),
        };
      }),

      imageLink: imageUrl?.imageUrl,
      diet: selectedTags,
      mealtype: selectedMealtype,
      public: event.target.public.checked,
      publicId: imageUrl?.publicId,
      defaultNumberOfServings: servings,
    };
    onSubmit(newData);
  }

  async function uploadImage(event) {
    event.preventDefault();
    setUpload(true);

    const file = event.target.files[0];

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
          {upload && <StyledProgress />}
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
        <Article>
          <Spacer />
          <StyledBigInput
            type="text"
            name="title"
            placeholder="Titel"
            required
            aria-label="add titel of the recipe"
            defaultValue={data?.title}
          />
          <StyledSmallArticle>
            <Input
              type="number"
              name="duration"
              placeholder="Dauer"
              $width={"5.5rem"}
              required
              min="0"
              aria-label="add duration to cook for the recipe"
              defaultValue={data?.duration}
            />
            <P>min</P>

            <Select
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
              name="difficulty"
              required
            >
              <option value="easy">Anfänger</option>
              <option value="medium">Fortgeschritten</option>
              <option value="hard">Profi</option>
            </Select>
          </StyledSmallArticle>
          <H2>
            Zutaten
            <SetNumberOfPeople
              numberOfPeople={servings}
              handleChange={handleSetNumberOfPeople}
            />
          </H2>
          <List>
            {ingredients.map((ingredient, index) => (
              <StyledIngredients key={index}>
                <Input
                  value={ingredient.quantity}
                  onChange={(event) =>
                    handleInputChange(event, index, "quantity")
                  }
                  type="number"
                  $width="2rem"
                  required
                  min="0"
                  aria-label="add ingredient quantity for the recipe"
                  placeholder="Menge"
                />
                <Select
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
                </Select>
                <Input
                  value={ingredient.name}
                  onChange={(event) => handleInputChange(event, index, "name")}
                  type="text"
                  name="name"
                  placeholder={`${index + 1}. Zutat`}
                  aria-label="add igredient name for the recipe"
                />
              </StyledIngredients>
            ))}
            <Wrapper>
              <AddButton
                type="button"
                $color="var(--color-background)"
                onClick={addIngredient}
              >
                <Plus width={20} height={20} />
              </AddButton>
              <AddButton
                type="button"
                $color="var(--color-background)"
                onClick={deleteIngredient}
              >
                <Minus width={20} height={20} />
              </AddButton>
            </Wrapper>
          </List>
          {filterTags
            .filter(({ type }) => type === "diet")
            .map(({ label, type, options }) => (
              <div key={type}>
                <H2>{label}</H2>
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
          {filterTags
            .filter(({ type }) => type === "mealtype")
            .map(({ label, type, options }) => (
              <div key={type}>
                <H2>{label}</H2>
                <StyledCategoriesDiv>
                  {options.map((option) => (
                    <StyledCategoryButton
                      key={option.value}
                      type="button"
                      $isActive={selectedMealtype.includes(option.value)}
                      onClick={() => handleMealtypeChange(option.value)}
                    >
                      {option.label}
                    </StyledCategoryButton>
                  ))}
                </StyledCategoriesDiv>
              </div>
            ))}
          <H2>Anleitung</H2>
          <StyledTextarea
            name="instructions"
            required
            placeholder="Anleitung"
            aria-label="add instructions for creating the recipe"
            defaultValue={data?.instructions}
            rows="6"
          />
          <ToggleCheckbox
            label="Öffentlich sichtbar"
            name="public"
            defaultChecked={data ? data.public : true}
            $sliderSize="2rem"
            $marginTop="1rem"
            $marginLeft="1rem"
          />
          <ButtonContainer>
            <Button type="submit">speichern</Button>
            {onDelete && (
              <Button type="button" onClick={onDelete}>
                Rezept löschen
              </Button>
            )}
          </ButtonContainer>
        </Article>
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

const StyledTextarea = styled.textarea`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  resize: vertical;
  width: calc(100% - (2 * var(--gap-out)));
  padding: 0.7rem;
  font-family: unset;
  font-size: 0.9rem;
  line-height: 1.15rem;
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

const StyledSmallArticle = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  width: calc(100% - (2 * var(--gap-out)));
  margin-bottom: var(--gap-between);
  margin-top: var(--gap-between);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
