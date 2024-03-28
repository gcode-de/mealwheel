import { useRouter } from "next/router";

import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import ProfileCard from "@/components/Cards/ProfileCard";
import { Spacer } from "@/components/Styled/Styled";

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
          foundUser={communityUser}
          isFriend={user.friends.includes(communityUser._id)}
          isRequested={communityUser.connectionRequests.some(
            (request) => request.senderId === user._id
          )}
          user={user}
        />
      ))}
    </>
  );
}
