import updateUserInDb from "./updateUserInDb";
export default async function unfriendUser(userId, user, mutateUser) {
  if (!userId) return;

  try {
    const updatedFriends = user.friends.filter((friend) => friend !== userId);
    user.friends = updatedFriends;
    updateUserInDb(user, mutateUser);

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
