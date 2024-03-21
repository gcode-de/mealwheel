import IconButton from "@/components/Styled/IconButton";
import StyledList from "@/components/Styled/StyledList";
import BookUser from "@/public/icons/svg/book-user_9856365.svg";
import StyledP from "@/components/Styled/StyledP";
import Heart from "@/public/icons/heart-svgrepo-com.svg";
import Pot from "@/public/icons/cooking-pot-fill-svgrepo-com.svg";
import Plus from "@/public/icons/Plus.svg";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import updateUserinDb from "@/helpers/updateUserInDb";
import StyledH2 from "@/components/Styled/StyledH2";
import Button from "@/components/Styled/StyledButton";
import { notifySuccess, notifyError } from "/helpers/toast";
import handlePostImage from "@/helpers/Cloudinary/handlePostImage";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";

export default function ProfilePage({ user, mutateUser }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [editUser, setEditUser] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("" || user?.profilePictureLink);
  const [upload, setUpload] = useState(false);

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

  return (
    <>
      <IconButton
        style="Settings"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.push("/profile/settings")}
        fill="var(--color-lightgrey)"
      />
      <IconButton
        style={"Leave"}
        top="var(--gap-out)"
        right="var(--gap-out)"
        onClick={() => {
          signOut({ callbackUrl: "/", redirect: true });
        }}
        fill="var(--color-lightgrey)"
      />
      {editUser && (
        <>
          <WrapperCenter>
            <StyledProfile>
              {upload && <StyledProgress />}
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

            <IconButton
              style="x"
              top={"-1.75rem"}
              right={"2rem"}
              onClick={() => setEditUser((previousValue) => !previousValue)}
            />
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
            <IconButton
              style="Edit"
              top={"-1.75rem"}
              right={"2rem"}
              onClick={() => setEditUser((previousValue) => !previousValue)}
            />
          </StyledList>
        </>
      )}

      <Wrapper>
        <StyledCollection href="/profile/favorites">
          <Heart width={40} height={40} />
          <StyledP>Favoriten</StyledP>
        </StyledCollection>
        <StyledCollection href="/profile/hasCooked">
          <Pot width={40} height={40} />
          <StyledP>gekocht</StyledP>
        </StyledCollection>
        <StyledCollection href="/profile/myRecipes">
          <BookUser width={40} height={40} />
          <StyledP>Rezepte</StyledP>
        </StyledCollection>
      </Wrapper>

      <StyledArticle>
        {!feedbackVisible && (
          <UnstyledButton onClick={toggleFeedbackForm}>
            <StyledH2>Gib uns Feedback 🎉</StyledH2>
          </UnstyledButton>
        )}
        {feedbackVisible && (
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
        )}
      </StyledArticle>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 var(--gap-out);
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
const UnstyledButton = styled.button`
  border: none;
  background-color: transparent;
`;
const StyledArticle = styled.article`
  padding-top: calc(2 * var(--gap-between));
  padding-bottom: calc(2 * var(--gap-between));
  padding-right: calc(2 * var(--gap-between));
  padding-left: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  position: relative;
  text-align: center;
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

const StyledCollection = styled(Link)`
  text-decoration: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-component);
  justify-content: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  height: 6rem;
  width: 6rem;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;
const StyledProgress = styled.div`
  position: absolute;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-highlight);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
