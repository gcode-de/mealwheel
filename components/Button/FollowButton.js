import styled from "styled-components";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "@/helpers/toast";
import updateUserinDb from "@/helpers/updateUserInDb";
import sendRequestToUser from "@/helpers/sendRequestToUser";
import unfriendUser from "@/helpers/unfriendUser";

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
    const newRequest = {
      senderId: user._id,
      timestamp: Date(),
      message: `${user.userName} möchte mit dir befreundet sein`,
      type: 1,
    };
    sendRequestToUser(id, newRequest, mutateAllUsers);
    notifySuccess("Freundschaftsanfrage versendet");
  }

  const isFriend = user?.friends.includes(foundUser._id);
  const isRequested = foundUser.connectionRequests.some(
    (request) => request.senderId === user._id
  );
  return (
    <>
      {isFriend ? (
        <Button onClick={() => unfriendUser(foundUser._id, mutateAllUsers)}>
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
