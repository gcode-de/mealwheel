import styled from "styled-components";
import Image from "next/image";
import StyledList from "@/components/Styled/StyledList";
export default function Profile({ user, name }) {
  return (
    <>
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
      <StyledList>
        <p>
          {(name = "external - profil")
            ? user.userName
            : `Hallo,
          ${user?.userName || user?.firstName || user?.email || "Gastnutzer"}!`}
        </p>
      </StyledList>
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
