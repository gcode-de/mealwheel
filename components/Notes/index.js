import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";
import Modal from "../Modal";

import styled from "styled-components";
import Menu from "/public/icons/svg/menu.svg";
import Button from "../Styled/StyledButton";
import Pen from "/public/icons/svg/pen-square_10435869.svg";
import Trash from "/public/icons/svg/trash-xmark_10741775.svg";

export default function Notes({ user, mutateUser, _id, foundInteractions }) {
  const [menuVisible, setMenuVisible] = useState(
    foundInteractions
      ? new Array(foundInteractions.notes.length).fill(false)
      : []
  );
  const [isEditing, setIsEditing] = useState(
    foundInteractions
      ? new Array(foundInteractions.notes.length).fill(false)
      : []
  );
  const [modal, setModal] = useState(false);

  function toggleModal() {
    setModal(!modal);
  }
  const interactionIndex = user.recipeInteractions.findIndex(
    (interaction) => interaction.recipe._id === _id
  );
  function handleAddNote(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const note = {
      comment: formData.get("comment"),
      date: new Date(),
    };
    if (interactionIndex !== -1) {
      user.recipeInteractions[interactionIndex].notes.push(note);
    } else {
      user.recipeInteractions.push({ recipe: _id, notes: [note] });
    }
    setMenuVisible([...menuVisible, false]);
    setIsEditing([...isEditing, false]);
    updateUserinDb(user, mutateUser);
    event.target.reset();
  }

  function toggleMenu(index) {
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = !prevMenuVisible[index];
      return updatedMenuVisible;
    });
  }

  function handleEditNote(index) {
    const updatedIsEditing = [...isEditing];
    updatedIsEditing[index] = true;
    setIsEditing(updatedIsEditing);

    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = false;
      return updatedMenuVisible;
    });
  }
  function handleSave(event, index) {
    event.preventDefault();
    const newComment = event.target.value;
    user.recipeInteractions[interactionIndex].notes[index].comment = newComment;
    updateUserinDb(user, mutateUser);
    const updatedIsEditing = [...isEditing];
    updatedIsEditing[index] = false;
    setIsEditing(updatedIsEditing);
  }

  function handleDeleteNote(index) {
    const updatedNotes = user.recipeInteractions[interactionIndex].notes.filter(
      (_, i) => i !== index
    );
    user.recipeInteractions[interactionIndex].notes = updatedNotes;
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = false;
      return updatedMenuVisible;
    });

    setMenuVisible(menuVisible.splice(index, 1));
    setModal(false);
    updateUserinDb(user, mutateUser);
  }
  function closeMenu(event, index) {
    event.preventDefault();
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = false;
      return updatedMenuVisible;
    });
  }

  return (
    <>
      {foundInteractions?.notes.map((note, index) => (
        <StyledComment key={index}>
          {modal && (
            <Modal
              message="Möchtest du die Notiz wirklich löschen?"
              btnCloseMessage="Abbrechen"
              btnConfirmMessage="Löschen"
              toggleModal={toggleModal}
              onConfirm={() => handleDeleteNote(index)}
            />
          )}
          <StyledMenu
            width={20}
            height={20}
            onClick={() => toggleMenu(index)}
            $rotate={menuVisible[index]}
          />
          {isEditing[index] ? (
            <StyledSmallInput
              autoFocus
              defaultValue={note.comment}
              onBlur={(event) => handleSave(event, index)}
              onKeyDown={(event) =>
                event.key === "Enter" && handleSave(event, index)
              }
            />
          ) : (
            <StyledP onClick={() => handleEditNote(index)}>
              {note.comment}
            </StyledP>
          )}

          {menuVisible[index] && (
            <MenuContainer
              autoFocus
              onBlur={(event) => closeMenu(event, index)}
            >
              <UnstyledButton onClick={() => handleEditNote(index)}>
                <Pen width={15} height={15} />
                Notiz bearbeiten
              </UnstyledButton>
              <UnstyledButton onClick={toggleModal}>
                <Trash width={15} height={15} />
                Notiz löschen
              </UnstyledButton>
            </MenuContainer>
          )}
          <StyledDate>{new Date(note.date).toLocaleDateString()}</StyledDate>
        </StyledComment>
      ))}
      <StyledCommentWrapper>
        <form onSubmit={handleAddNote}>
          <StyledInput
            name="comment"
            placeholder="ergänze deine Notizen.."
            aria-label="add comment"
            required
          />
          <Button type="submit">Notiz hinzufügen</Button>
        </form>
      </StyledCommentWrapper>
    </>
  );
}

const StyledComment = styled.article`
  padding-top: var(--gap-between);
  padding-bottom: var(--gap-between);
  padding-right: calc(2 * var(--gap-between));
  padding-left: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  position: relative;
`;

const StyledDate = styled.p`
  font-style: italic;
  margin: 0;
  margin-top: var(--gap-between);
  text-align: right;
  color: var(--color-lightgrey);
`;
const StyledCommentWrapper = styled.article`
  padding-top: calc(2 * var(--gap-between));
  padding-bottom: calc(2 * var(--gap-between));
  padding-right: calc(2 * var(--gap-between));
  padding-left: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  position: relative;
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 3rem;
  width: 100%;
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;
const StyledMenu = styled(Menu)`
  background-color: var(--color-background);
  border-radius: 100%;
  position: absolute;
  right: 16px;
  top: 16px;
  transform: ${(props) => (props.$rotate ? "rotate(90deg)" : "0")};
  cursor: pointer;
`;
const MenuContainer = styled.div`
  position: absolute;
  top: var(--gap-between);
  right: calc(3 * var(--gap-between) + 20px);
  z-index: 2;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: var(--gap-between);
  display: flex;
  flex-direction: column;
  gap: var(--gap-between);
`;
const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;
const StyledP = styled.p`
  margin: 0;
  padding: 0.7rem;
`;
const StyledSmallInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: var(--border-radius-small);
  padding: 0.7rem;
  font-size: medium;
`;
