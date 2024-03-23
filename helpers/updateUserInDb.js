export default async function updateUserInDb(user, mutateUser) {
  if (!user) return;
  const currentUser = user;
  await mutateUser((prevUser) => ({ ...prevUser, ...user }), false);

  try {
    const response = await fetch(`/api/users/`, {
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
  } catch (error) {
    console.error(error);
    await mutateUser(currentUser, false);
    throw error;
  }
}
