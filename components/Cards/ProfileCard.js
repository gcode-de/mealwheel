import styled from "styled-components";
import Image from "next/image";

export default function ProfileCard({
  user,
  handleAddPeople,
  isFriend,
  isRequested,
  handleUnfollowPeople,
}) {
  return (
    <ProfileWrapper>
      <WrapperCenter>
        <StyledProfile>
          {(user?.profilePictureLink && (
            <StyledProfilePicture
              src={user?.profilePictureLink}
              alt="Profile Picture"
              width={106}
              height={106}
            />
          )) || <h1>🙋‍♀️</h1>}
        </StyledProfile>
      </WrapperCenter>
      <StyledProfiletext>
        <p>{user?.userName || user?.firstName}</p>
        {isFriend ? (
          <Button onClick={() => handleUnfollowPeople(user._id)}>
            Freundschaft beenden
          </Button>
        ) : (
          <Button
            onClick={() => handleAddPeople(user._id)}
            disabled={isRequested}
          >
            {isRequested ? "Freundschaft angefragt" : "Freundschaft anfragen"}
          </Button>
        )}
      </StyledProfiletext>
    </ProfileWrapper>
  );
}
const WrapperCenter = styled.div`
  display: flex;

  position: absolute;
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
const ProfileWrapper = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  width: calc(100% - (2 * var(--gap-out)));
  margin-top: calc(3 * var(--gap-between));
  margin-bottom: calc(3 * var(--gap-between));
`;
const StyledProfiletext = styled.div`
  padding-top: var(--gap-between);
  padding-bottom: var(--gap-between);
  padding-right: calc(2 * var(--gap-between));
  padding-left: 80px;
  width: 100%;
  margin-left: 50px;
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  height: 106px;
  position: relative;
`;
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