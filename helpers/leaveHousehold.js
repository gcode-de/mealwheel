export default async function leaveHousehold(household) {
  if (!household) return;

  try {
    const response = await fetch(`/api/households/${household._id}/leave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update household data.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
