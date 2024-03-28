export default async function updateCommunityUserInDB(
  allUsers,
  mutateAllUsers
) {
  if (!allUsers) return;

  try {
    const response = await fetch(`/api/users/${allUsers._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allUsers),
    });

    if (response.ok) {
      await mutateAllUsers();
    } else {
      throw new Error("Failed to update user data.");
    }
  } catch (error) {
    console.error(error);
    await mutateAllUsers(allUsers, false);
    throw error;
  }
}
