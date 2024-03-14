import styled from "styled-components";
import { notifySuccess, notifyError } from "/helpers/toast";
import { useState } from "react";

import Plus from "@/public/icons/Plus.svg";
import Image from "next/image";

export default function UploadImage({ recipe }) {
  const [preview, setPreview] = useState(recipe?.imageLink || null);
  // if (data.imageLink) {
  //   const publicId = "/recipes/" + data.imageLink.split("/recipes/")[1]
  // } else {

  async function uploadImage(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        const file = await response.json();
        // file in Datenbank speichern
        recipe.imageUrl = file;
        notifySuccess("Bild hinzugefügt");
      } else {
        console.error("was zur hölle");
      }
    } catch (error) {
      notifyError("Bild konnte nicht hinzugefügt werden");
    }
  }
  function handleImage(event) {
    const file = event.target.files[0];
    setPreview({ imageUrl: URL.createObjectURL(file) });
  }
  return (
    <>
      {preview && (
        <Image src={preview.imageUrl} alt="hier" height={300} width={300} />
      )}
      <StyledImageUploadContainer htmlFor="upload">
        <form onSubmit={uploadImage}>
          <Plus width={40} height={40} />
          <input type="file" name="file" id="upload" onChange={handleImage} />
          <button type="submit">submit</button>
        </form>
      </StyledImageUploadContainer>
    </>
  );
}

// const StyledImageUpload = styled.input`
//   display: none;
// `;
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
