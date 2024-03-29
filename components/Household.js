import { useState, useEffect } from "react";
import ModalComponent from "./Modal";
import StyledH2 from "./Styled/StyledH2";
import StyledList from "./Styled/StyledList";
import StyledDropDown from "./Styled/StyledDropDown";
import updateUserInDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "@/helpers/toast";

export default function Household({
  allUsers,
  mutateAllUsers,
  user,
  mutateUser,
  household,
  mutateHousehold,
}) {
  const [isModal, setIsModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const friends = allUsers.filter((human) => user.friends.includes(human._id));

  const [selectedHouseholdId, setSelectedHouseholdId] = useState(
    user.activeHousehold
  );

  useEffect(() => {
    setSelectedHouseholdId(user.activeHousehold);
  }, [user.activeHousehold]);

  const handleHouseholdChange = async (event) => {
    const newHouseholdId = event.target.value;
    const newHousehold = user.households.find(
      (household) => household._id === newHouseholdId
    );
    setSelectedHouseholdId(newHousehold);
    // onChangeHousehold(newHousehold._id);
    user.activeHousehold = newHousehold._id;
    await updateUserInDb(user, mutateUser);
    notifySuccess(`"${newHousehold.name}" ausgewählt.`);
  };

  function openModal(friendId) {
    setSelectedFriend(friendId);
    setIsModal(true);
  }

  async function addMemberToHousehold(id) {
    household.members.push({ _id: user._id, role: "canWrite" });
    await updateHouseholdInDb(household, mutateHousehold);
  }

  function sendRequest() {
    let requestedFriend = friends.find(
      (friend) => friend._id === selectedFriend
    );
    requestedFriend = {
      ...requestedFriend,
      connectionRequests: [
        ...requestedFriend.connectionRequests,
        {
          senderId: household._id,
          timestamp: Date(),
          message: `${user.userName} lädt dich zum Haushalt "${household.name}" ein.`,
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
        <div>
          <span>Aktueller Haushalt: </span>
          {user.households.length > 0 ? ( //CHANGE TO 1 LATER
            <StyledDropDown
              value={selectedHouseholdId}
              onChange={handleHouseholdChange}
            >
              {user.households.map((household) => (
                <option key={household._id} value={household._id}>
                  {household.name}
                </option>
              ))}
            </StyledDropDown>
          ) : (
            <span>{user.households[0]?.name || "Nicht festgelegt"}</span>
          )}
        </div>
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
          <button
            onClick={() => {
              addMemberToHousehold(selectedFriend);
              sendRequest();
            }}
          >
            Anfrage versenden
          </button>
          <button onClick={() => setIsModal(false)}>abbrechen</button>
        </ModalComponent>
      )}
    </>
  );
}
