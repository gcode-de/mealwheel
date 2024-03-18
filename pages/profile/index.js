import IconButton from "@/components/Styled/IconButton";
import StyledList from "@/components/Styled/StyledList";
import BookUser from "@/public/icons/svg/book-user_9856365.svg";
import StyledP from "@/components/Styled/StyledP";
import Heart from "@/public/icons/heart-svgrepo-com.svg";
import Pot from "@/public/icons/cooking-pot-fill-svgrepo-com.svg";
import Plus from "@/public/icons/Plus.svg";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";
import StyledH2 from "@/components/Styled/StyledH2";

export default function ProfilePage({ user, mutateUser }) {
  const router = useRouter();
  const [editUser, setEditUser] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const uploadImage = async (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "meal_wheel");
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/mealwheel/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await uploadResponse.json();
    user = { ...user, profilePictureLink: file.secure_url };
    updateUserinDb(user, mutateUser);
    setEditUser(false);
  };

  const updateUsername = async (event) => {
    event.preventDefault();
    const newName = event.target.elements.username.value;
    user.userName = newName;
    updateUserinDb(user, mutateUser);
    setEditUser(false);
  };

  function toggleFeedbackForm() {
    setFeedbackVisible(!feedbackVisible);
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
      <WrapperCenter>
        <StyledProfile>
          {!editUser ? (
            (user?.profilePictureLink && (
              <StyledProfilePicture
                src={user?.profilePictureLink}
                alt="Profile Picture"
                width={106}
                height={106}
              />
            )) || <h1>🙋‍♀️</h1>
          ) : (
            <StyledImageUploadContainer>
              <Plus width={40} height={40} />
              <StyledImageUpload type="file" onChange={uploadImage} />
            </StyledImageUploadContainer>
          )}
        </StyledProfile>
      </WrapperCenter>
      <StyledList>
        {!editUser ? (
          <p>
            Hallo,{" "}
            {user?.userName || user?.firstName || user?.email || "Gastnutzer"}!
          </p>
        ) : (
          <StyledUsernameForm onSubmit={updateUsername}>
            <input
              name="username"
              defaultValue={user?.userName}
              placeholder="Dein Benutzername"
            />
            <button>Speichern</button>
          </StyledUsernameForm>
        )}
        <IconButton
          style={!editUser ? "Edit" : "x"}
          top={"-1.75rem"}
          right={"2rem"}
          onClick={() => setEditUser((previousValue) => !previousValue)}
        />
      </StyledList>
      <Wrapper>
        <StyledLink href="/profile/favorites">
          <Heart width={40} height={40} />
          <StyledP>Favoriten</StyledP>
        </StyledLink>
        <StyledLink href="/profile/hasCooked">
          <Pot width={40} height={40} />
          <StyledP>gekocht</StyledP>
        </StyledLink>
        <StyledLink href="/profile/myRecipes">
          <BookUser width={40} height={40} />
          <StyledP>eigene</StyledP>
        </StyledLink>
      </Wrapper>
      <button onClick={toggleFeedbackForm}>
        <StyledH2>gib uns feedback 🎉</StyledH2>
      </button>
      {feedbackVisible && (
        <form>
          <label>sag uns, was dir nicht gefällt:</label>
          <input></input>
          <label>was gefällt dir besonders gut:</label>
          <input></input>
          <label>welche Funktion fehlt dir noch?</label>
          <input></input>
          <button>schick's ab 🚀</button>
        </form>
      )}
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
const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  justify-content: center;
  cursor: pointer;
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-component);
  height: 6rem;
  width: 6rem;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;

const StyledUsernameForm = styled.form`
  display: flex;
  margin: 9px 0;
  input {
    border: none;
    margin: 1;
    flex: 1;
  }
  button {
    border: none;
    background-color: var(--color-darkgrey);
    color: var(--color-background);
    font-size: 0%.75rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    width: 7rem;
    height: 2rem;
  }
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
