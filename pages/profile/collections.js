import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";

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

    if (!user.collection) {
      user.collection = [];
    }
    user = {
      ...user,
      collection: [...user.collection, newCollection],
    };
    console.log(user);
    updateUserinDb(user, mutateUser);
  }
  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <StyledH2>Kochbuch No1</StyledH2>
      <IconButton
        style="plus"
        top="var(--gap-out)"
        right="var(--gap-out)"
        onClick={toggleAddCollection}
      />
      {addCollection && (
        <form onSubmit={addNewCollection}>
          <label>Kochbuch Name:</label>
          <input name="collectionName"></input>
          <button type="submit">hinzufügen</button>
        </form>
      )}
      {!user.collection && <h2>noch keine Kochbücher</h2>}
    </>
  );
}
