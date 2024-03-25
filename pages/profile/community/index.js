import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import { useRouter } from "next/router";
import ProfileCard from "../../../components/Cards/ProfileCard";
import updateCommunityUserInDB from "../../../helpers/updateCommunityUserInDB";

export default function Community({ user, allUsers, mutateAllUsers }) {
  if (!user || !allUsers) {
    return;
  }
  const router = useRouter();

  const community = allUsers.filter((human) => human._id !== user._id);
  function handleAddPeople(id) {
    // nimm die user._id und sende sie an den user mit der übergebenen id
    let communityUser = allUsers.find((user) => user._id === id);

    communityUser = {
      ...communityUser,
      connectionRequests: [
        {
          senderId: user._id,
          timestamp: Date(),
          message: `${user.userName} möchte mit dir befreundet sein`,
        },
      ],
    };
    updateCommunityUserInDB(communityUser, mutateAllUsers);
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
      {community.map((user) => (
        <ProfileCard
          key={user._id}
          user={user}
          handleAddPeople={handleAddPeople}
        />
      ))}
    </>
  );
}
