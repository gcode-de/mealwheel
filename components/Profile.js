import styled from "styled-components";
import Image from "next/image";
import FollowButton from "./Button/FollowButton";

export default function Profile({
  foundUser,
  name,
  user,
  allUsers,
  mutateAllUsers,
}) {
  return (
    <>
      <WrapperCenter>
        <StyledProfile>
          {(foundUser?.profilePictureLink && (
            <StyledProfilePicture
              src={foundUser?.profilePictureLink}
              alt="Profile Picture"
              width={106}
              height={106}
            />
          )) || <h1>🙋‍♀️</h1>}
        </StyledProfile>
      </WrapperCenter>
      <Wrapper>
        <p>
          {name === "external-profil"
            ? foundUser.userName
            : `Hallo,
          ${foundUser?.userName || foundUser?.firstName || "Gastnutzer"}!`}
        </p>
        {name === "external-profil" && user._id !== foundUser._id && (
          <FollowButton
            foundUser={foundUser}
            user={user}
            mutateAllUsers={mutateAllUsers}
            allUsers={allUsers}
          />
        )}
      </Wrapper>
    </>
  );
}
const WrapperCenter = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  bottom: -30px;
`;
const StyledProfile = styled.div`
  background-color: white;
  width: 120px;
  height: 120px;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
`;
const StyledProfilePicture = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;
const Wrapper = styled.div`
  padding: var(--gap-between) calc(2 * var(--gap-between));
  padding-top: 1.5rem;
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
