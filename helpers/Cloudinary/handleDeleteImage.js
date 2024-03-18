export default async function handleDeleteImage(publicId) {
  const responseDelete = await fetch(`/api/upload(${publicId}`, {
    method: "DELETE",
  });
  if (responseDelete.ok) {
    const file = await responseDelete.json();
    setImageUrl(file);
  } else {
    console.error("delete failed");
  }
}