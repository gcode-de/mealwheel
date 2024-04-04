export default async function sendRequestToUser(
  userId,
  newRequest,
  mutateAllUsers
) {
  if (!userId) return;

  try {
    const response = await fetch(`/api/users/${userId}/sendRequest`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRequest),
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
