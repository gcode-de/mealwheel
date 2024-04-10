import { useRouter } from "next/router";

import IconButton from "@/components/Button/IconButton";
import ProfileCard from "@/components/Cards/ProfileCard";
import { Spacer, H2 } from "@/components/Styled/Styled";

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

  function isFriendOfUser(id) {
    return user.friends.some((friend) => friend === id);
  }

  return (
    <>
      <Spacer />
      <H2>Community</H2>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      {community
        .sort((a, b) => {
          return isFriendOfUser(b._id) !== isFriendOfUser(a._id)
            ? (isFriendOfUser(b._id) ? 1 : 0) - (isFriendOfUser(a._id) ? 1 : 0)
            : a.userName.localeCompare(b.userName);
        })
        .map((communityUser) => (
          <ProfileCard
            key={communityUser._id}
            foundUser={communityUser}
            user={user}
            allUsers={allUsers}
            mutateAllUsers={mutateAllUsers}
            mutateUser={mutateUser}
            followButton={true}
          />
        ))}
    </>
  );
}
