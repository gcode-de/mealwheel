export default async function unfriendUser(userId, mutateUser) {
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
    mutateUser();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
