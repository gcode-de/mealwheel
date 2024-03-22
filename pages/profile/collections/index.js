import { useRouter } from "next/router";
import { useState } from "react";

import styled from "styled-components";
import IconButton from "@/components/Styled/IconButton";
import CollectionCard from "@/components/CollectionCard";
import StyledH2 from "@/components/Styled/StyledH2";
import NewCollection from "../../../components/Forms/NewCollection";

export default function Collections({ user, mutateUser }) {
  const [addCollection, setAddCollection] = useState(false);

  const router = useRouter();
  if (!user) {
    return;
  }

  function toggleAddCollection() {
    setAddCollection(!addCollection);
  }

  return (
    <>
      <Spacer />
      <StyledH2>Kochbücher</StyledH2>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <IconButton
        style="plus"
        top="var(--gap-out)"
        right="var(--gap-out)"
        onClick={toggleAddCollection}
      />
      {addCollection && (
        <NewCollection
          user={user}
          mutateUser={mutateUser}
          setModal={toggleAddCollection}
        />
      )}
      <CollectionWrapper>
        {!user.collections.length && "Du hast noch keine Kochbücher angelegt."}
        {user.collections.map((col, index) => (
          <CollectionCard key={index} collection={col} />
        ))}
      </CollectionWrapper>
    </>
  );
}
const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
`;

const Spacer = styled.div`
  height: 5rem;
`;
