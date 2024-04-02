import { useState, useEffect } from "react";

import ModalComponent from "./Modal";
import { H2, List, Select, UnstyledButton, Button } from "./Styled/Styled";
import updateUserInDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import sendRequestToUser from "@/helpers/sendRequestToUser";
import leaveHousehold from "@/helpers/leaveHousehold";

import { notifySuccess, notifyError } from "@/helpers/toast";
import styled from "styled-components";
import { Menu, Pen, Plus, Reload } from "@/helpers/svg";
import MenuContainer from "./MenuContainer";
import ProfileCard from "@/components/Cards/ProfileCard";

export default function Household({
  allUsers,
  mutateAllUsers,
  user,
  mutateUser,
  userIsHouseholdAdmin,
  household,
  mutateHousehold,
}) {
  const [isAddToHousehold, setIsAddToHousehold] = useState(false);
  const [isChangeHouseholdName, setIsChangeHouseholdName] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditingHousehold, setIsEditingHousehold] = useState(false);
  const [isChangeHousehold, setIsChangeHousehold] = useState(false);
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
    setIsChangeHousehold(false);
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

  function getUserById(id) {
    return allUsers.find((user) => user._id === id);
  }

  return (
    <>
      <H2>{household?.name || "-unbekannter Haushalt-"}</H2>
      <List>
        <StyledMenu
          width={20}
          height={20}
          onClick={() => setMenuVisible(!menuVisible)}
          $rotate={menuVisible}
        />

        {menuVisible && (
          <MenuContainer
            toggleMenu={() => setMenuVisible(!menuVisible)}
            right="1rem"
            top="3rem"
          >
            {userIsHouseholdAdmin && (
              <>
                <UnstyledButton
                  onClick={() => {
                    setIsChangeHouseholdName(true);
                    setIsEditingHousehold(true);
                    setMenuVisible(!menuVisible);
                  }}
                >
                  <Pen width={15} height={15} />
                  Haushalt bearbeiten
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => {
                    setIsAddToHousehold(true);
                    setMenuVisible(false);
                  }}
                >
                  <Plus width={15} height={15} />
                  Mitglied hinzufügen
                </UnstyledButton>
              </>
            )}
            <UnstyledButton
              onClick={() => {
                setIsChangeHousehold(!isChangeHousehold);
                setMenuVisible(false);
              }}
            >
              <Reload width={15} height={15} />
              Haushalt wechseln
            </UnstyledButton>
          </MenuContainer>
        )}
        {!isChangeHouseholdName ? (
          <>
            {isChangeHousehold && (
              <ModalComponent toggleModal={() => setIsChangeHousehold(false)}>
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
              </ModalComponent>
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
          <form onSubmit={changeHouseholdName}>
            <input
              type="text"
              placeholder="neuer Haushalts-Name"
              defaultValue={household.name}
              name="newName"
              aria-label="neuer Name für den Haushalt"
              required
            ></input>
            <Button type="submit" onClick={() => setIsEditingHousehold(false)}>
              speichern
            </Button>
          </form>
        )}
        <p>Mitglieder: </p>
        {household?.members.map((member) => (
          <ProfileCard
            key={member._id}
            foundUser={getUserById(member._id)}
            user={user}
            mutateUser={mutateUser}
            followButton={false}
            isHousehold={true}
            isEditingHousehold={isEditingHousehold}
            member={member}
            household={household}
            changeMemberRole={changeMemberRole}
            mutateHousehold={mutateHousehold}
            setIsEditingHousehold={setIsEditingHousehold}
          />
        ))}
      </List>
      {isAddToHousehold && (
        <ModalComponent toggleModal={() => setIsAddToHousehold(false)}>
          <p>Haushaltsmitglied hinzufügen:</p>
          <Select onChange={(event) => setSelectedFriend(event.target.value)}>
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
          <div>
            <Button
              onClick={() => {
                addMemberToHousehold(selectedFriend);
              }}
            >
              Anfrage versenden
            </Button>
            <Button onClick={() => setIsAddToHousehold(false)}>
              abbrechen
            </Button>
          </div>
        </ModalComponent>
      )}
    </>
  );
}
const StyledMenu = styled(Menu)`
  background-color: var(--color-background);
  border-radius: 100%;
  position: absolute;
  right: 16px;
  top: 16px;
  transform: ${(props) => (props.$rotate ? "rotate(90deg)" : "0")};
  cursor: pointer;
`;
