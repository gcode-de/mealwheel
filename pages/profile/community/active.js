import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import IconButton from "@/components/Button/IconButton";
import ProfileCard from "@/components/Cards/ProfileCard";
import { Spacer, H2, Button } from "@/components/Styled/Styled";

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

  const fourteenDaysAgo = new Date(); //used to calculate the number of active users
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const community = allUsers.filter(
    (user) => new Date(user.lastLogin) > fourteenDaysAgo
  );

  function isFriendOfUser(id) {
    return user.friends.some((friend) => friend === id);
  }

  return (
    <>
      <Spacer />
      <H2>Community (aktiv)</H2>
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

const SearchWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  margin: 0 var(--gap-out);
  gap: var(--gap-out);
`;

const Input = styled.input`
  background-color: var(--color-background);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
  width: 10rem;
  flex-grow: 1;
  padding: 0.7rem;
`;
