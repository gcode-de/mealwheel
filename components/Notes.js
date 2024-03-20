import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import Menu from "/public/icons/svg/menu.svg";
import Button from "./Styled/StyledButton";
import Pen from "/public/icons/svg/pen-square_10435869.svg";
import Trash from "/public/icons/svg/trash-xmark_10741775.svg";

export default function Notes({ user, mutateUser, _id }) {
  const [menuVisible, setMenuVisible] = useState(false);

  function handleAddNote(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const note = {
      comment: formData.get("comment"),
      date: new Date(),
    };
    // getRecipeProperty(_id, "notes");

    const interactionIndex = user.recipeInteractions.findIndex(
      (interaction) => interaction.recipe._id === _id
    );

    if (interactionIndex !== -1) {
      user.recipeInteractions[interactionIndex].notes.push(note);
    } else {
      user.recipeInteractions.push({ recipe: _id, notes: [note] });
    }
    updateUserinDb(user, mutateUser);
    event.target.reset();
  }
  const foundInteractions = user.recipeInteractions.find(
    (interaction) => interaction.recipe._id === _id
  );
  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  return (
    <>
      {foundInteractions?.notes.map((note, i) => (
        <>
          <StyledComment key={i}>
            {note.comment}
            <StyledMenu
              width={20}
              height={20}
              onClick={toggleMenu}
              $rotate={menuVisible}
            />
            {menuVisible && (
              <MenuContainer>
                <UnstyledButton>
                  <Pen width={15} height={15} />
                  Notiz bearbeiten
                </UnstyledButton>
                <UnstyledButton>
                  <Trash width={15} height={15} />
                  Notiz löschen
                </UnstyledButton>
              </MenuContainer>
            )}
            <StyledDate>{new Date(note.date).toLocaleDateString()}</StyledDate>
          </StyledComment>
        </>
      ))}
      <StyledCommentWrapper>
        <form onSubmit={handleAddNote}>
          <StyledInput name="comment" placeholder="ergänze deine Notizen.." />
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
  &:hover {
    background-color: var(--color-background);
  }
`;
