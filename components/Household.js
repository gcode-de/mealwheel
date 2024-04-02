import { useState, useEffect } from "react";
import ModalComponent from "./Modal";
import { Button, H2, List, Select, ListItem } from "./Styled/Styled";
import updateUserInDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import sendRequestToUser from "@/helpers/sendRequestToUser";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import leaveHousehold from "@/helpers/leaveHousehold";
import { notifySuccess, notifyError } from "@/helpers/toast";

export default function Household({
  allUsers,
  mutateAllUsers,
  user,
  mutateUser,
  userIsHouseholdAdmin,
  household,
  mutateHousehold,
}) {
  const [isModal, setIsModal] = useState(false);
  const [isChangeHouseholdName, setIsChangeHouseholdName] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const friends = allUsers?.filter((person) =>
    user.friends.includes(person._id)
  );

  const [selectedHouseholdId, setSelectedHouseholdId] = useState(
    user?.activeHousehold
  );

  useEffect(() => {
    setSelectedHouseholdId(user?.activeHousehold);
  }, [user?.activeHousehold]);

  const handleHouseholdChange = async (event) => {
    const newHouseholdId = event.target.value;
    const newHousehold = user.households.find(
      (household) => household._id === newHouseholdId
    );
    setSelectedHouseholdId(newHousehold);
    user.activeHousehold = newHousehold._id;
    await updateUserInDb(user, mutateUser);
    notifySuccess(`"${newHousehold.name}" ausgewählt.`);
  };

  function openModal(friendId) {
    setSelectedFriend(friendId);
    setIsModal(true);
  }

  async function addMemberToHousehold(id) {
    //add user as member to household object
    if (household.members.some((member) => member._id === id)) {
      notifyError("Nutzer ist bereits Mitglied in diesem Haushalt.");

      return;
    }
    household.members.push({ _id: id, role: "canWrite" });
    await updateHouseholdInDb(household, mutateHousehold);

    //send request to user
    const newRequest = {
      senderId: user._id,
      timestamp: Date(),
      message: `${user.userName} lädt dich zum Haushalt "${household.name}" ein.`,
      type: 3,
      householdId: household._id,
    };
    sendRequestToUser(selectedFriend, newRequest, mutateAllUsers);

    notifySuccess("Anfrage versendet");
    setIsModal(false);
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
              {user?.households.length > 1 ? ( //CHANGE TO 1 LATER
                <Select
                  value={selectedHouseholdId}
                  onChange={handleHouseholdChange}
                >
                  {user?.households.map((household) => (
                    <option key={household._id} value={household._id}>
                      {household.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <span>{user?.households[0]?.name || "Nicht festgelegt"}</span>
              )}
              {userIsHouseholdAdmin && (
                <button
                  onClick={() => {
                    setIsChangeHouseholdName(true);
                  }}
                >
                  Haushalt umbenennen
                </button>
              )}
              {household?.members.find((member) => member._id === user._id)
                .role !== "owner" && (
                <button
                  onClick={async () => {
                    await leaveHousehold(selectedHouseholdId, user._id);
                    await mutateUser();
                    notifySuccess("Haushalt verlassen.");
                  }}
                >
                  Haushalt verlassen
                </button>
              )}
            </>
          ) : (
            <>
              <form onSubmit={changeHouseholdName}>
                <input
                  type="text"
                  placeholder="neuer Haushalts-Name"
                  defaultValue={household.name}
                  name="newName"
                  aria-label="neuer Name für den Haushalt"
                  required
                ></input>
                <button type="submit">speichern</button>
              </form>
            </>
          )}
        </div>
        {household?.members.length > 1 && (
          <div>
            <p>Haushaltsmitglieder</p>
            <List>
              {household.members.map((member) => (
                <ListItem key={member._id}>
                  {member._id === user._id
                    ? "Du"
                    : getUserById(member._id)?.userName}{" "}
                  ({getLabelForMemberRole(member.role)})
                  {userIsHouseholdAdmin && member.role !== "owner" && (
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
                        onClick={async (e) => {
                          e.preventDefault();
                          await leaveHousehold(household._id, member._id);
                          await mutateHousehold();
                          notifySuccess("Nutzer aus Haushalt entfernt.");
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
        )}
        {userIsHouseholdAdmin && (
          <div>
            <p>Haushaltsmitglied hinzufügen:</p>
            <Select onChange={(e) => openModal(e.target.value)}>
              <option value="">Wähle einen Freund aus...</option>
              {friends
                .filter(
                  (friend) =>
                    !household.members.some(
                      (member) => member._id === friend._id
                    )
                )
                .map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.userName}
                  </option>
                ))}
            </Select>
          </div>
        )}
        {userIsHouseholdAdmin && <p>Anfrage versendet:</p>}
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
