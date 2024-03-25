import updateUserinDb from "@/helpers/updateUserInDb";
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
import StyledH2 from "@/components/Styled/StyledH2";
import Button from "@/components/Styled/StyledButton";
import StyledProgress from "@/components/Styled/StyledProgress";
import MenuContainer from "@/components/MenuContainer";
import IconButton from "@/components/Styled/IconButton";
import StyledList from "@/components/Styled/StyledList";
import ModalComponent from "../../components/Modal";

export default function ProfilePage({ user, mutateUser }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [editUser, setEditUser] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.profilePictureLink || "");
  const [upload, setUpload] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
    updateUserinDb(user, mutateUser);
    setEditUser(false);
  };

  function toggleFeedbackForm() {
    setFeedbackVisible(!feedbackVisible);
  }
  function handleEditProfile() {
    setEditUser(true);
    setIsMenuVisible(false);
  }
  async function handleFeedback(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
  function toggleMenu() {
    setIsMenuVisible(!isMenuVisible);
  }
  return (
    <>
      <IconButton
        style="Menu"
        top="var(--gap-out)"
        right="var(--gap-out)"
        onClick={toggleMenu}
        fill="var(--color-lightgrey)"
        rotate={isMenuVisible}
      />
      {isMenuVisible && (
        <MenuContainer top="5rem" right="var(--gap-out)">
          <UnstyledButton onClick={() => router.push("/profile/settings")}>
            <Settings width={15} height={15} />
            Einstellungen
          </UnstyledButton>
          <UnstyledButton onClick={handleEditProfile}>
            <Pen width={15} height={15} />
            Profil bearbeiten
          </UnstyledButton>
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
          <StyledList>
            <StyledUsernameForm onSubmit={updateUsername}>
              <input
                name="username"
                defaultValue={user?.userName}
                placeholder="Dein Benutzername"
              />
              <StyledSaveButton type="submit" disabled={upload}>
                Speichern
              </StyledSaveButton>
            </StyledUsernameForm>
          </StyledList>
        </>
      )}
      {!editUser && (
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
              Hallo,{" "}
              {user?.userName || user?.firstName || user?.email || "Gastnutzer"}
              !
            </p>
          </StyledList>
        </>
      )}
      <Wrapper>
        <StyledCollection onClick={() => router.push("/profile/favorites")}>
          <Heart width={40} height={40} fill="var(--color-highlight)" />
          <StyledP $color="var(--color-hightlight)">Favoriten</StyledP>
        </StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/hasCooked")}>
          <Pot width={40} height={40} />
          <StyledP>gekocht</StyledP>
        </StyledCollection>
        <StyledCollection></StyledCollection>
        <StyledCollection></StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/community")}>
          <People width={40} height={40} />
          <StyledP>Freunde</StyledP>
        </StyledCollection>
        <StyledCollection onClick={() => router.push("/profile/collections")}>
          <BookUser width={40} height={40} />
          <StyledP>Kochbücher</StyledP>
        </StyledCollection>
        <StyledCollection onClick={toggleFeedbackForm}>
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
        <ModalComponent toggleModal={toggleFeedbackForm}>
          <StyledH2>Gib uns Feedback</StyledH2>
          <StyledForm onSubmit={handleFeedback}>
            <StyledInput
              name="negativeFeedback"
              placeholder="Sag uns, was dir noch nicht gefällt?"
            />
            <StyledInput
              name="positiveFeedback"
              placeholder="Was gefällt dir besonders gut?"
            />
            <StyledInput
              name="newFeatures"
              placeholder="Welche Funktion wünschst du dir?"
            />
            <Button type="submit">schick&apos;s ab 🚀</Button>
          </StyledForm>
        </ModalComponent>
      )}
      <StyledFooter>
        <StyledLink href="/profile/impressum">Impressum</StyledLink>
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

const StyledProfilePicture = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--gap-between));
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 3rem;
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
