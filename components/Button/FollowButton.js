import styled from "styled-components";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "@/helpers/toast";
import updateUserInDb from "@/helpers/updateUserInDb";
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
    user.friends = [...user.friends, id];
    updateUserInDb(user, mutateUser);

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
      {isRequested ? (
        <Button disabled={true}>Freundschaft angefragt</Button>
      ) : isFriend ? (
        <Button onClick={() => unfriendUser(foundUser._id, mutateUser)}>
          Freundschaft beenden
        </Button>
      ) : (
        <Button onClick={() => handleAddPeople(foundUser._id)} disabled={false}>
          Freundschaft anfragen
        </Button>
      )}
    </>
  );
}
const Button = styled.button`
  background-color: ${(props) =>
    props.disabled ? "var(--color-darkgrey)" : "var(--color-background)"};
  cursor: ${(props) => (props.disabled ? "" : "pointer")};
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
