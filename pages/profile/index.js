import updateUserInDb from "@/helpers/updateUserInDb";
import leaveHousehold from "@/helpers/leaveHousehold";
import clearRequests from "@/helpers/clearRequests";
import unfriendUser from "@/helpers/unfriendUser";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import handlePostImage from "@/helpers/Cloudinary/handlePostImage";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";
import { notifySuccess, notifyError } from "/helpers/toast";
//SVG
import {
  BookUser,
  People,
  Heart,
  Pot,
  Plus,
  Party,
  Pan,
  Pen,
  Leave,
  Settings,
} from "@/helpers/svg.js";

//Components
import { Button, H2, List } from "@/components/Styled/Styled";
import StyledProgress from "@/components/StyledProgress";
import MenuContainer from "@/components/MenuContainer";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import IconButton from "@/components/Button/IconButton";
import ModalComponent from "@/components/Modal";
import updateCommunityUserInDB from "@/helpers/updateCommunityUserInDB";
import Profile from "@/components/Profile";
import ToggleCheckbox from "@/components/ToggleCheckbox";

export default function ProfilePage({
  user,
  mutateUser,
  allUsers,
  mutateAllUsers,
  mutateHousehold,
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [editUser, setEditUser] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profilePictureLink || "");
  const [upload, setUpload] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  if (status === "unauthenticated") {
    signIn();
  }
  if (!user) return null;

  const uploadImage = async (event) => {
    setUpload(true);
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);

    if (user.publicId) {
      await handleDeleteImage(user.publicId);
      await handlePostImage(data, setImageUrl);
    } else {
      await handlePostImage(data, setImageUrl);
    }
    setUpload(false);
  };

  const updateUsername = async (event) => {
    event.preventDefault();
    const newName = event.target.elements.username.value;
    user.userName = newName;
    user = {
      ...user,
      profilePictureLink: imageUrl.imageUrl,
      publicId: imageUrl.publicId,
    };
    updateUserInDb(user, mutateUser);
    setEditUser(false);
    setIsMenuVisible(false);
  };
  function handleEditProfile() {
    setEditUser(true);
    setIsMenuVisible(false);
  }
  async function handleFeedback(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value.trim() !== "")
    );
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filteredData),
    });
    if (response.ok) {
      setFeedbackVisible(false);
      notifySuccess("danke, für deine Zeit!");
    }
  }
  async function handleSignOut() {
    await signOut({ callbackUrl: "/", redirect: true });
    notifySuccess("Du hast dich erfolgreich abgemeldet");
  }

  async function acceptFriendRequest(id, index) {
    user.friends = [...user.friends, id];
    updateUserInDb(user, mutateUser);
    const foundUser = allUsers.find((user) => user._id === id);

    await clearRequests(user._id, id, mutateUser);

    notifySuccess(`${foundUser.userName} als Freund hinzugefügt`);
  }

  async function rejectFriendRequest(id, index) {
    unfriendUser(id, user, mutateAllUsers);
    await clearRequests(user._id, id, mutateUser);

    notifyError("Anfrage abgelehnt");
  }

  async function acceptNewHousehold(senderId, householdId) {
    //add household to users households array
    if (user.households.find((household) => household._id === householdId)) {
      notifyError(`Du bist bereits Mitglied dieses Haushalts.`);
      await clearRequests(user._id, senderId, mutateUser);

      return;
    }
    user.households.push(householdId);
    user.activeHousehold = householdId;
    await updateUserInDb(user, mutateUser);

    await clearRequests(user._id, senderId, mutateUser);

    notifySuccess(`Neuer Haushalt als Standard hinzugefügt`);
    setIsNotificationVisible(false);
  }

  async function rejectNewHousehold(senderId, householdId) {
    leaveHousehold(householdId, user._id);
    await clearRequests(user._id, senderId, mutateUser);

    notifySuccess(`Anfrage abgelehnt.`);
    setIsNotificationVisible(false);
  }

  return (
    <>
      <IconButton
        style="Menu"
        top="var(--gap-out)"
        right="var(--gap-out)"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        fill="var(--color-lightgrey)"
        rotate={isMenuVisible}
      />
      <IconButton
        style="Bell"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => setIsNotificationVisible(!isNotificationVisible)}
        fill="var(--color-lightgrey)"
      ></IconButton>
      {user.connectionRequests.length >= 1 && <Notification />}
      {isNotificationVisible && (
        <MenuContainer
          top="3.5rem"
          left="var(--gap-out)"
          toggleMenu={() => setIsNotificationVisible(false)}
        >
          {user.connectionRequests.length >= 1 ? (
            user.connectionRequests.map((request, index) => {
              if (request.type === 1)
                return (
                  <div key={request.senderId}>
                    <p>{request.message}</p>
                    <div>
                      <button
                        onClick={() =>
                          acceptFriendRequest(request.senderId, index)
                        }
                      >
                        bestätigen
                      </button>
                      <button
                        onClick={() =>
                          rejectFriendRequest(request.senderId, index)
                        }
                      >
                        ablehnen
                      </button>
                    </div>
                  </div>
                );
              if (request.type === 3)
                return (
                  <div key={request.senderId}>
                    <p>{request.message}</p>
                    <div>
                      <button
                        onClick={() =>
                          acceptNewHousehold(
                            request.senderId,
                            request.householdId
                          )
                        }
                      >
                        bestätigen
                      </button>
                      <button
                        onClick={() =>
                          rejectNewHousehold(
                            request.senderId,
                            request.householdId
                          )
                        }
                      >
                        ablehnen
                      </button>
                    </div>
                  </div>
                );
            })
          ) : (
            <p>Du bist auf dem neuesten Stand!</p>
          )}
        </MenuContainer>
      )}
      {isMenuVisible && (
        <MenuContainer
          top="3.5rem"
          right="var(--gap-out)"
          toggleMenu={() => setIsMenuVisible(false)}
        >
          <UnstyledButton onClick={() => router.push("/profile/settings")}>
            <Settings width={15} height={15} />
            Einstellungen
          </UnstyledButton>
          <UnstyledButton onClick={handleEditProfile}>
            <Pen width={15} height={15} />
            Profil bearbeiten
          </UnstyledButton>
          {user.admin && (
            <UnstyledButton onClick={() => router.push("/admin")}>
              <Pen width={15} height={15} />
              Admin
            </UnstyledButton>
          )}
          <UnstyledButton onClick={handleSignOut}>
            <Leave width={15} height={15} />
            Abmelden
          </UnstyledButton>
        </MenuContainer>
      )}
      {editUser && (
        <>
          <WrapperCenter>
            <StyledProfile>
              {upload && <StyledProgress />}
              {imageUrl && (
                <StyledImageCloudinary
                  src={imageUrl.imageUrl || user.profilePictureLink || ""}
                  alt="Uploaded Image"
                  width={20}
                  height={20}
                />
              )}
              <StyledImageUploadContainer>
                <Plus width={40} height={40} />
                <StyledImageUpload type="file" onChange={uploadImage} />
              </StyledImageUploadContainer>
            </StyledProfile>
          </WrapperCenter>
          <List>
            <StyledUsernameForm onSubmit={updateUsername}>
              <input
                name="username"
                defaultValue={user?.userName}
                placeholder="Dein Benutzername"
              />
              <ToggleCheckbox />
              <StyledSaveButton type="submit" disabled={upload}>
                Speichern
              </StyledSaveButton>
            </StyledUsernameForm>
          </List>
        </>
      )}
      {!editUser && <Profile foundUser={user} />}
      <Wrapper>
        <StyledCollection onClick={() => router.push("/profile/favorites")}>
          <Heart width={40} height={40} fill="var(--color-highlight)" />
          <StyledP $color="var(--color-hightlight)">Schmeckos</StyledP>
        </StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/hasCooked")}>
          <Pot width={40} height={40} />
          <StyledP>gekocht</StyledP>
        </StyledCollection>
        <StyledCollection></StyledCollection>
        <StyledCollection></StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/community")}>
          <People width={40} height={40} />
          <StyledP>Community</StyledP>
        </StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/collections")}>
          <BookUser width={40} height={40} />
          <StyledP>Kochbücher</StyledP>
        </StyledCollection>
        <StyledCollection onClick={() => setFeedbackVisible(!feedbackVisible)}>
          <Party width={40} height={40} />
          <StyledP>Feedback</StyledP>
        </StyledCollection>
        <StyledCollection></StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/myRecipes")}>
          <Pan width={40} height={40} />
          <StyledP>Rezepte</StyledP>
        </StyledCollection>
      </Wrapper>
      {feedbackVisible && (
        <ModalComponent
          toggleModal={() => setFeedbackVisible(!feedbackVisible)}
        >
          <H2>Gib uns Feedback</H2>
          <StyledForm onSubmit={handleFeedback}>
            <StyledInput
              name="positiveFeedback"
              placeholder="Was gefällt dir besonders gut?"
            />
            <StyledInput
              name="negativeFeedback"
              placeholder="Was können wir noch verbessern?"
            />
            <StyledInput
              name="newFeatures"
              placeholder="Welche neue Funktion wünschst du dir?"
            />
            <Button type="submit">Abschicken 🚀</Button>
          </StyledForm>
        </ModalComponent>
      )}
      <StyledFooter>
        <StyledLink href="/imprint">Impressum</StyledLink>
      </StyledFooter>
    </>
  );
}
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
  position: relative;
  margin-top: calc(2 * var(--gap-between));
`;
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

const StyledImageCloudinary = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 7px solid white;
  opacity: 0.3;
  object-fit: cover;
`;

const StyledUsernameForm = styled.form`
  display: flex;
  margin: 9px 0;
  input {
    border: none;
    margin: 1;
    flex: 1;
  }
`;

const StyledSaveButton = styled.button`
  border: none;
  background-color: ${(props) =>
    props.disabled ? "var(--color-lightgrey)" : "var(--color-darkgrey)"};
  color: var(--color-background);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border-radius: 10px;
  width: 7rem;
  height: 2rem;
`;
const StyledImageUploadContainer = styled.label`
  display: inline-block;
  background-color: white;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  cursor: pointer;
  position: absolute;
`;
const StyledImageUpload = styled.input`
  display: none;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--gap-between));
`;
const StyledInput = styled.textarea`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 6rem;
  width: 100%;
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;

const StyledCollection = styled.button`
  text-decoration: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  justify-content: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  height: 93px;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;

const StyledP = styled.p`
  margin-top: var(--gap-between);
  margin-bottom: 0;
  color: ${(props) => props.$color};
`;
const StyledFooter = styled.div`
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-lightgrey);
`;
const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;
const Notification = styled.div`
  height: 0.6rem;
  width: 0.6rem;
  background-color: var(--color-highlight);
  border-radius: 100%;
  position: absolute;
  z-index: 4000;
  left: 2.7rem;
  top: 0.8rem;
`;
