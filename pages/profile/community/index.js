import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import { useRouter } from "next/router";
import ProfileCard from "../../../components/Cards/ProfileCard";
import updateCommunityUserInDB from "../../../helpers/updateCommunityUserInDB";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function Community({ user, allUsers, mutateAllUsers }) {
  const router = useRouter();
  if (!user || !allUsers) {
    return;
  }

  const community = allUsers.filter((human) => human._id !== user._id);

  function handleAddPeople(id) {
    let communityUser = allUsers.find((user) => user._id === id);
    console.log(communityUser);
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
        />
      ))}
    </>
  );
}
