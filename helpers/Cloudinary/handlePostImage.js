import { notifySuccess, notifyError } from "/helpers/toast";

export default async function handlePostImage(data, setImageUrl) {
  const response = await fetch("/api/cloudinary", {
    method: "POST",
    body: data,
  });
  if (response.ok) {
    const file = await response.json();
    setImageUrl(file);
    notifySuccess("Bild hinzugefügt");
  } else {
    console.error("image not added");
    notifyError("Bild konnte nicht hinzugefügt werden");
  }
}
