import { useRouter } from "next/router";
import updateCommunityUserInDB from "../../../helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "/helpers/toast";
import updateUserinDb from "@/helpers/updateUserInDb";

import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import ProfileCard from "../../../components/Cards/ProfileCard";

export default function Community({
  user,
  mutateUser,
  allUsers,
  mutateAllUsers,
}) {
  const router = useRouter();
  if (!user || !allUsers) {
    return;
  }

  const community = allUsers.filter((human) => human._id !== user._id);

  function handleAddPeople(id) {
    let communityUser = allUsers.find((user) => user._id === id);

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
    const foundUser = community.find((human) => human._id === id);
    const updateFoundUser = foundUser.friends.filter(
      (friend) => friend !== user._id
    );
    foundUser.friends = updateFoundUser;
    updateCommunityUserInDB(foundUser, mutateAllUsers);
  }

  return (
    <>
      <Spacer />
      <StyledH2>Community</StyledH2>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      {community.map((communityUser) => (
        <ProfileCard
          key={communityUser._id}
          user={communityUser}
          handleAddPeople={handleAddPeople}
          isFriend={user.friends.includes(communityUser._id)}
          isRequested={communityUser.connectionRequests.some(
            (request) => request.senderId === user._id
          )}
          handleUnfollowPeople={handleUnfollowPeople}
        />
      ))}
    </>
  );
}
