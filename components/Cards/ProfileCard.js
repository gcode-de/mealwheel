import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../Button/FollowButton";
import { Button, P } from "../Styled/Styled";
import leaveHousehold from "@/helpers/leaveHousehold";
import { notifySuccess, notifyError } from "@/helpers/toast";
import clearRequests from "@/helpers/clearRequests";

export default function ProfileCard({
  foundUser,
  user,
  allUsers,
  mutateAllUsers,
  mutateUser,
  followButton,
  isHousehold,
  isEditingHousehold,
  member,
  household,
  changeMemberRole,
  mutateHousehold,
  setIsEditingHousehold,
}) {
  function getLabelForMemberRole(role) {
    const Labels = {
      owner: "Inhaber",
      canWrite: "Schreibzugriff",
      canRead: "Lesezugriff",
    };
    return Labels[role];
  }
  return (
    <ProfileWrapper>
      <WrapperCenter href={`/profile/community/${foundUser._id}`}>
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
      <StyledProfiletext>
        <StyledLink href={`/profile/community/${foundUser._id}`}>
          {foundUser?.userName || foundUser?.firstName}
        </StyledLink>
        {followButton && (
          <FollowButton
            foundUser={foundUser}
            user={user}
            allUsers={allUsers}
            mutateAllUsers={mutateAllUsers}
            mutateUser={mutateUser}
          />
        )}
        {isHousehold && !isEditingHousehold && (
          <P>({getLabelForMemberRole(member.role)})</P>
        )}
        {isEditingHousehold && member.role !== "owner" && (
          <Wrapper>
            {" "}
            {member.role === "canWrite" ? (
              <Button
                $height
                $top
                onClick={(event) => {
                  event.preventDefault();
                  changeMemberRole(member._id, "canRead");
                  setIsEditingHousehold(false);
                }}
              >
                Schreibzugriff entfernen
              </Button>
            ) : (
              <Button
                $height
                $top
                onClick={(event) => {
                  event.preventDefault();
                  changeMemberRole(member._id, "canWrite");
                  setIsEditingHousehold(false);
                }}
              >
                Schreibzugriff geben
              </Button>
            )}
            <Button
              $height
              $top
              onClick={async (event) => {
                event.preventDefault();
                await leaveHousehold(household._id, member._id);
                await mutateHousehold();
                await clearRequests(user._id, member._id, mutateUser);
                setIsEditingHousehold(false);
                notifySuccess("Nutzer aus Haushalt entfernt.");
              }}
            >
              aus Haushalt entfernen
            </Button>
          </Wrapper>
        )}
      </StyledProfiletext>
    </ProfileWrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;
// import styled from "styled-components";
// import Image from "next/image";
// import Link from "next/link";
// import FollowButton from "../Button/FollowButton";

// export default function ProfileCard({
//   foundUser,
//   user,
//   mutateUser,
//   allUsers,
//   mutateAllUsers,
// }) {
//   return (
//     <ProfileWrapper>
//       <WrapperCenter href={`/profile/community/${foundUser._id}`}>
//         <StyledProfile>
//           {(foundUser?.profilePictureLink && (
//             <StyledProfilePicture
//               src={foundUser?.profilePictureLink}
//               alt="Profile Picture"
//               width={106}
//               height={106}
//             />
//           )) || <h1>🙋‍♀️</h1>}
//         </StyledProfile>
//       </WrapperCenter>
//       <StyledProfiletext>
//         <StyledLink href={`/profile/community/${foundUser._id}`}>
//           {foundUser?.userName || foundUser?.firstName}
//         </StyledLink>
//         <FollowButton
//           foundUser={foundUser}
//           user={user}
//           mutateUser={mutateUser}
//           allUsers={allUsers}
//           mutateAllUsers={mutateAllUsers}
//         />
//       </StyledProfiletext>
//     </ProfileWrapper>
//   );
// }
const WrapperCenter = styled(Link)`
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
  padding-top: calc(2 * var(--gap-between));
  padding-bottom: calc(2 * var(--gap-between));
  padding-right: calc(2 * var(--gap-between));
  padding-left: 80px;
  width: 100%;
  margin-left: 50px;
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  height: 106px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
