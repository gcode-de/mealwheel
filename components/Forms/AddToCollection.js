import updateUserinDb from "@/helpers/updateUserInDb";
import { notifySuccess, notifyError } from "/helpers/toast";
import { useState } from "react";
import styled from "styled-components";
import { Select } from "@/components/Styled/Styled";

export default function AddToCollection({
  user,
  id,
  mutateUser,
  setIsModalCollection,
  isModalCollection,
  toggleNewCollection,
}) {
  const [selectedCollection, setselectedCollection] = useState(
    user?.collections?.[0]?.collectionName || ""
  );
  async function handleCollection(event) {
    event.preventDefault();
    const isDuplicate = user.collections
      .find((col) => col.collectionName === selectedCollection)
      .recipes.find((recipe) => recipe._id === id);
    if (isDuplicate) {
      notifyError("Dieses Rezept ist bereits gespeichert.");
      return;
    }

    const updateCollection = user.collections.map((col) =>
      col.collectionName === selectedCollection
        ? { ...col, recipes: [...col.recipes, id] }
        : col
    );
    user.collections = updateCollection;
    try {
      updateUserinDb(user, mutateUser);
      setIsModalCollection(false);
      notifySuccess(`Das Rezept wurde gespeichert.`);
    } catch (error) {
      notifyError("Das Rezept konnte nicht gespeichert werden.");
    }
  }
  return (
    <StyledForm onSubmit={handleCollection} $isVisible={isModalCollection}>
      <h3>Dieses Rezept speichern:</h3>
      <Select
        onChange={(event) => setselectedCollection(event.target.value)}
        name="collectionName"
        required
      >
        {user?.collections.length === 0 ? (
          <option>Du hast noch keine Kochbücher angelegt</option>
        ) : (
          user?.collections.map((col, index) => (
            <option key={index} value={col.collectionName}>
              {col.collectionName}
            </option>
          ))
        )}
      </Select>
      <div>
        <button type="submit" disabled={user.collections.length === 0}>
          speichern
        </button>
        <button type="button" onClick={toggleNewCollection}>
          Kochbuch hinzufügen
        </button>
      </div>
    </StyledForm>
  );
}
const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out, margin 0.2s ease-out;
  overflow: hidden;
  h3 {
    flex-basis: 100%;
    margin: 0;
  }
  label {
  }
  div {
    display: flex;
    gap: var(--gap-between);
  }
  button {
    line-height: 1.1rem;
    padding: 0.4rem 0.5rem;
    min-height: 2rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-darkgrey);
    color: var(--color-background);
    cursor: pointer;
  }
  input {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-background);
    min-height: 2rem;
  }
`;
