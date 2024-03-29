import { useRouter } from "next/router";

import IconButton from "@/components/Button/IconButton";
import ProfileCard from "@/components/Cards/ProfileCard";
import { Spacer, H2 } from "@/components/Styled/Styled";

export default function Community({ user, allUsers, mutateAllUsers }) {
  const router = useRouter();
  if (!user || !allUsers) {
    return;
  }

  const community = allUsers.filter((human) => human._id !== user._id);

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
      {community.map((communityUser) => (
        <ProfileCard
          key={communityUser._id}
          foundUser={communityUser}
          user={user}
          allUsers={allUsers}
          mutateAllUsers={mutateAllUsers}
          mutateUser={mutateUser}
        />
      ))}
    </>
  );
}
