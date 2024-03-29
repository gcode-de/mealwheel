import { useState, useEffect } from "react";
import ModalComponent from "./Modal";
import Button from "./Styled/StyledButton";
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
  const [isChangeHouseholdName, setIsChangeHouseholdName] = useState(false);
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

  async function changeHouseholdName(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const newName = data.get("newName");
    household.name = newName;
    try {
      await updateHouseholdInDb(household, mutateHousehold);
      mutateUser();
      notifySuccess("Haushalt umbenannt.");
      setIsChangeHouseholdName(false);
    } catch {
      notifyError("Umbenennen fehlgeschlagen.");
    }
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
          {!isChangeHouseholdName ? (
            <>
              <p>Aktueller Haushalt: </p>
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
              <Button
                onClick={() => {
                  setIsChangeHouseholdName(true);
                }}
              >
                Haushalt umbenennen
              </Button>
            </>
          ) : (
            <>
              <form
                onSubmit={changeHouseholdName}
                onBlur={() => {
                  setIsChangeHouseholdName(false);
                }}
              >
                <input
                  type="text"
                  placeholder="neuer Haushalts-Name"
                  name="newName"
                  aria-label="neuer Name für den Haushalt"
                  required
                ></input>
                <button type="submit">speichern</button>
              </form>
            </>
          )}
        </div>
        <div>
          <p>Haushaltsmitglied hinzufügen:</p>
          {/* Dropdown Menu um alle Freunde zu rendern, die noch kein Mitglied sind. Wenn jemand ausgewählt wird, wird das Modal zur Bestätigung sichtbar. */}
          <StyledDropDown onChange={(e) => openModal(e.target.value)}>
            <option value="">Wähle einen Freund aus...</option>
            {friends
              .filter(
                (friend) =>
                  !household.members.some((member) => member._id === friend._id)
              )
              .map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.userName}
                </option>
              ))}
          </StyledDropDown>
        </div>
        <p>Anfrage versendet:</p>
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
