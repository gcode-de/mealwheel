export default async function handleDeleteImage(publicId) {
  const responseDelete = await fetch("/api/cloudinary", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_id: publicId }),
  });

  if (responseDelete.ok) {
    const file = await responseDelete.json();
    console.log(responseDelete);
  } else {
    console.error("delete failed");
  }
}
