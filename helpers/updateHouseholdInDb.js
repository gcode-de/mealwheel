export default async function updateHouseholdInDb(household, mutateHousehold) {
  if (!household) return;
  const currentHousehold = household;
  await mutateHousehold(
    (prevHousehold) => ({ ...prevHousehold, ...household }),
    false
  );

  try {
    const response = await fetch(`/api/households/${household._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(household),
    });

    if (response.ok) {
      await mutateHousehold();
    } else {
      throw new Error("Failed to update household data.");
    }
  } catch (error) {
    console.error(error);
    await mutateHousehold(currentHousehold, false);
    throw error;
  }
}
