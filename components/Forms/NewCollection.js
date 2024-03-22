import updateUserinDb from "@/helpers/updateUserInDb";
import styled from "styled-components";

import Plus from "/public/icons/svg/plus.svg";
import StyledInput from "@/components/Styled/StyledInput";
import AddButton from "@/components/Styled/AddButton";
import ModalComponent from "../Modal";
import StyledH2 from "../Styled/StyledH2";

export default function NewCollection({ user, mutateUser, setModal }) {
  function addNewCollection(event) {
    event.preventDefault();
    const collectionName = event.target.collectionName.value;
    const newCollection = { collectionName, recipes: [] };

    if (!user.collections) {
      user.collections = [];
    }
    user = {
      ...user,
      collections: [...user.collections, newCollection],
    };

    updateUserinDb(user, mutateUser);
    setModal();
  }
  return (
    <ModalComponent toggleModal={setModal}>
      <StyledH2>Wie soll dein neues Kochbuch heißen?</StyledH2>
      <StyledForm onSubmit={addNewCollection}>
        <StyledInput
          name="collectionName"
          placeholder="Kochbuch Name"
          aria-label="collection-name-input"
        />
        <AddButton type="submit">
          <Plus width={20} height={20} />
        </AddButton>
      </StyledForm>
    </ModalComponent>
  );
}
const StyledForm = styled.form`
  background-color: var(--color-component);
  width: calc(100% - (2 * var(--gap-between)));
  margin: auto;
  display: flex;
  border-radius: var(--border-radius-medium);
  justify-content: space-around;
  padding: var(--gap-between);
`;
