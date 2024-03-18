import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";
import Header from "@/components/Styled/Header";
import styled from "styled-components";
import StyledInput from "@/components/Styled/StyledInput";
import Plus from "/public/icons/svg/plus.svg";
import AddButton from "@/components/Styled/AddButton";
import CollectionCard from "@/components/CollectionCard";

export default function Collections({ user, mutateUser }) {
  const [addCollection, setAddCollection] = useState(false);
  const router = useRouter();
  if (!user) {
    return;
  }

  function toggleAddCollection() {
    setAddCollection(!addCollection);
  }

  function addNewCollection(event) {
    event.preventDefault();
    const collectionName = event.target.collectionName.value;
    const newCollection = { collectionName: collectionName, recipes: [] };

    if (!user.collections) {
      user.collections = [{ collectionName: "", recipes: [] }];
    }
    user = {
      ...user,
      collections: [...user.collections, newCollection],
    };

    updateUserinDb(user, mutateUser);
  }
  return (
    <>
      <Header text="Kochbücher" />
      <Spacer />
      <IconButton
        style="ArrowLeft"
        top="calc(2*var(--gap-out))"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <IconButton
        style="plus"
        top="calc(2*var(--gap-out))"
        right="var(--gap-out)"
        onClick={toggleAddCollection}
      />
      {addCollection && (
        <StyledForm onSubmit={addNewCollection}>
          <StyledInput name="collectionName" placeholder="Kochbuch Name" />
          <AddButton type="submit">
            <Plus width={20} height={20} />
          </AddButton>
        </StyledForm>
      )}
      {!user.collections && <h2>noch keine Kochbücher</h2>}
      <CollectionWrapper>
        {user.collections.map((col) => (
          <CollectionCard collection={col} />
        ))}
      </CollectionWrapper>
    </>
  );
}
const CollectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: calc(2 * var(--gap-between));
  margin: auto;
  width: calc(100% - (2 * var(--gap-out)));
`;
const StyledForm = styled.form`
  background-color: var(--color-component);
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;

  display: flex;
  border-radius: var(--border-radius-medium);
  justify-content: space-around;
  padding: var(--gap-between);
`;
const Spacer = styled.div`
  height: 5rem;
`;
