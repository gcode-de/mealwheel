export default async function updateUserinDb(user, mutateUser) {
  if (!user) return;
  const response = await fetch(`/api/users/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
    await mutateUser();
  }
}
