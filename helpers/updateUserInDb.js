export default async function updateUserinDb(user, mutateUser) {
  if (!user) return;
  console.log(user);
  const response = await fetch(`/api/users/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
    await mutateUser();
  } else {
    throw new Error("Failed to update user data.");
  }
}
