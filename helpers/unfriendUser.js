export default async function unfriendUser(userId, mutateAllUsers) {
  if (!userId) return;

  try {
    const response = await fetch(`/api/users/${userId}/unfriend`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update user data.");
    }
    mutateAllUsers();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
