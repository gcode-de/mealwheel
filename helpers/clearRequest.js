export default async function clearRequest(user, senderId, mutateUser) {
  if (!user) return;

  try {
    const response = await fetch(`/api/users/${senderId}/sendRequest`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(null),
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
