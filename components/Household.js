import { useState } from "react";
import ModalComponent from "./Modal";
import StyledH2 from "./Styled/StyledH2";
import StyledList from "./Styled/StyledList";
import StyledDropDown from "./Styled/StyledDropDown";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "@/helpers/toast";

export default function Household({ allUsers, user, mutateAllUsers }) {
  const [isModal, setIsModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const friends = allUsers.filter((human) => user.friends.includes(human._id));

  function openModal(friendId) {
    setSelectedFriend(friendId);
    setIsModal(true);
  }
  function sendRequest() {
    console.log("sendRequest", selectedFriend);
    let requestedFriend = friends.find(
      (friend) => friend._id === selectedFriend
    );
    requestedFriend = {
      ...requestedFriend,
      connectionRequests: [
        ...requestedFriend.connectionRequests,
        {
          senderId: user._id,
          timestamp: Date(),
          message: `${user.userName} möchte sich den Haushalt mit dir teilen`,
          type: 3,
        },
      ],
    };
    updateCommunityUserInDB(requestedFriend, mutateAllUsers);
    notifySuccess("Anfrage versendet");
    setIsModal(false);
  }
  return (
    <>
      <StyledH2>Haushalt</StyledH2>
      <StyledList>
        <p>Anfrage versendet:</p>
        <p>Freunde zu deinem Haushalt hinzufügen:</p>
        {/* Dropdown Menu um alle Freunde zu rendern, wenn jemand ausgewählt wird, wird das Modal sichtbar mit der Frage, welcher Plan  */}

        <StyledDropDown onChange={(e) => openModal(e.target.value)}>
          <option value="">Wähle einen Freund aus...</option>
          {friends.map((friend) => (
            <option key={friend._id} value={friend._id}>
              {friend.userName}
            </option>
          ))}
        </StyledDropDown>
      </StyledList>
      {isModal && (
        <ModalComponent toggleModal={() => setIsModal(false)}>
          <StyledH2>
            möchtest du{" "}
            {friends.find((friend) => friend._id === selectedFriend)?.userName}{" "}
            zu deinem Haushalt hinzufügen?
          </StyledH2>
          <button onClick={sendRequest}>Anfrage versenden</button>
          <button onClick={() => setIsModal(false)}>abbrechen</button>
        </ModalComponent>
      )}
    </>
  );
}
