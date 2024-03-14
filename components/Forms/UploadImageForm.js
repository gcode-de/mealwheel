import styled from "styled-components";
import { notifySuccess, notifyError } from "/helpers/toast";
import { useState } from "react";
import Plus from "@/public/icons/Plus.svg";

export default function UploadImage({ recipe }) {
  const [imageUrl, setImageUrl] = useState(recipe ? recipe.imageLink : "");
  async function uploadImage(event) {
    // if (data.imageLink) {
    //   const publicId = "/recipes/" + data.imageLink.split("/recipes/")[1]
    // } else {
    event.preventDefault();
    const file = event.target.files;
    const data = new FormData();
    data.append("image", file[0]);

    console.log(data, file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: file,
      });
      // const file = await response.json();
      // setImageUrl(file.secure_url);
      if (response.ok) {
        notifySuccess("Bild hinzugefügt");
      }
    } catch (error) {
      notifyError("Bild konnte nicht hinzugefügt werden");
    }
  }
  return (
    <StyledImageUploadContainer htmlFor="upload">
      <form method="post" encType="multipart/form-data" onSubmit={uploadImage}>
        <Plus width={40} height={40} />
        <StyledImageUpload type="file" name="file" id="upload" />
        <button type="submit">submit</button>
      </form>
    </StyledImageUploadContainer>
  );
}

const StyledImageUpload = styled.input`
  display: none;
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
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  cursor: pointer;
  position: absolute;
`;
