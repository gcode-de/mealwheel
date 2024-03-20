export default async function handleDeleteImage(publicId) {
  const responseDelete = await fetch("/api/cloudinary/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_id: publicId }),
  });

  if (!responseDelete.ok) {
    console.error("delete failed");
  }
}
