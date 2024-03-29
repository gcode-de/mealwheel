import { useState, useEffect } from "react";
import ModalComponent from "./Modal";
import { Button, H2, List, Select, ListItem } from "./Styled/Styled";
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
    if (household.members.some((member) => member._id === id)) {
      notifyError("Nutzer ist bereits Mitglied in diesem Haushalt.");

      return;
    }
    household.members.push({ _id: user._id, role: "canWrite" });
    await updateHouseholdInDb(household, mutateHousehold);
  }

  async function removeMemberFromHousehold(id) {
    household.members = household.members.filter((member) => member._id !== id);
    await updateHouseholdInDb(household, mutateHousehold);
  }

  async function changeMemberRole(id, newRole) {
    const updatedMembers = household.members.map((member) =>
      member._id === id ? { ...member, role: newRole } : member
    );
    household.members = updatedMembers;
    await updateHouseholdInDb(household, mutateHousehold);
    mutateUser();
  }

  async function changeHouseholdName(event) {
    event.preventDefault();
    console.log("change");
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

  function getLabelForMemberRole(role) {
    const Labels = {
      owner: "Inhaber",
      canWrite: "Schreibzugriff",
      canRead: "Lesezugriff",
    };
    return Labels[role];
  }

  function getUserById(id) {
    return allUsers.find((user) => user._id === id);
  }

  return (
    <>
      <H2>Haushalt</H2>
      <List>
        <div>
          {!isChangeHouseholdName ? (
            <>
              <p>Aktueller Haushalt: </p>
              {user.households.length > 0 ? ( //CHANGE TO 1 LATER
                <Select
                  value={selectedHouseholdId}
                  onChange={handleHouseholdChange}
                >
                  {user.households.map((household) => (
                    <option key={household._id} value={household._id}>
                      {household.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <span>{user.households[0]?.name || "Nicht festgelegt"}</span>
              )}
              <button
                onClick={() => {
                  setIsChangeHouseholdName(true);
                }}
              >
                Haushalt umbenennen
              </button>
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
                  defaultValue={household.name}
                  name="newName"
                  aria-label="neuer Name für den Haushalt"
                  required
                ></input>
                <button type="submit" onClick={(e) => e.stopPropagation()}>
                  speichern
                </button>
              </form>
            </>
          )}
        </div>
        <div>
          <p>Haushaltsmitglieder</p>
          <List>
            {household.members.length > 1 &&
              household.members.map((member) => (
                <ListItem key={member._id}>
                  {getUserById(member._id)?.userName} (
                  {getLabelForMemberRole(member.role)})
                  {member.role !== "owner" && (
                    <>
                      {member.role === "canWrite" ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            changeMemberRole(member._id, "canRead");
                          }}
                        >
                          Schreibzugriff entfernen
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            changeMemberRole(member._id, "canWrite");
                          }}
                        >
                          Schreibzugriff geben
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeMemberFromHousehold(member._id);
                        }}
                      >
                        aus Haushalt entfernen
                      </button>
                    </>
                  )}
                </ListItem>
              ))}
          </List>
        </div>
        <div>
          <p>Haushaltsmitglied hinzufügen:</p>
          <Select onChange={(e) => openModal(e.target.value)}>
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
          </Select>
        </div>
        <p>Anfrage versendet:</p>
      </List>
      {isModal && (
        <ModalComponent toggleModal={() => setIsModal(false)}>
          <H2>
            möchtest du{" "}
            {friends.find((friend) => friend._id === selectedFriend)?.userName}{" "}
            zu deinem Haushalt hinzufügen?
          </H2>
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
