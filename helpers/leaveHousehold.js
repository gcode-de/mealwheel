export default async function leaveHousehold(householdId, userId) {
  if (!householdId || !userId) return;

  try {
    const response = await fetch(`/api/households/${householdId}/leave`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to update household or user data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
