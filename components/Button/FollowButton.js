import styled from "styled-components";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "@/helpers/toast";
import updateUserinDb from "@/helpers/updateUserInDb";

export default function FollowButton({
  user,
  mutateAllUsers,
  mutateUser,
  foundUser,
  allUsers,
}) {
  function handleAddPeople(id) {
    let communityUser = allUsers.find((user) => user._id === id);
    if (!communityUser) {
      notifyError("Benutzer nicht gefunden");
      return;
    }
    if (communityUser.friends.includes(id)) {
      notifyError("Ihr seid schon Freunde");
    }
    communityUser = {
      ...communityUser,
      connectionRequests: [
        ...communityUser.connectionRequests,
        {
          senderId: user._id,
          timestamp: Date(),
          message: `${user.userName} möchte mit dir befreundet sein`,
          type: 1,
        },
      ],
    };
    updateCommunityUserInDB(communityUser, mutateAllUsers);
    notifySuccess("Freundschaftsanfrage versendet");
  }
  function handleUnfollowPeople(id) {
    const updateUser = user.friends.filter((friend) => friend !== id);
    user.friends = updateUser;
    updateUserinDb(user, mutateUser);
    const foundUser = allUsers.find((human) => human._id === id);
    const updateFoundUser = foundUser.friends.filter(
      (friend) => friend !== user._id
    );
    foundUser.friends = updateFoundUser;
    updateCommunityUserInDB(foundUser, mutateAllUsers);
  }
  const isFriend = user?.friends.includes(foundUser._id);
  const isRequested = foundUser.connectionRequests.some(
    (request) => request.senderId === user._id
  );
  return (
    <>
      {isFriend ? (
        <Button onClick={() => handleUnfollowPeople(foundUser._id)}>
          Freundschaft beenden
        </Button>
      ) : (
        <Button
          onClick={() => handleAddPeople(foundUser._id)}
          disabled={isRequested}
        >
          {isRequested ? "Freundschaft angefragt" : "Freundschaft anfragen"}
        </Button>
      )}
    </>
  );
}
const Button = styled.button`
  background-color: ${(props) =>
    props.disabled ? "var(--color-darkgrey)" : "var(--color-background)"};
  color: ${(props) =>
    props.disabled ? "var(--color-background)" : "var(--color-font)"};
  border: none;
  border-radius: var(--border-radius-small);
  height: 30px;
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
  display: flex;
  align-items: center;
`;
