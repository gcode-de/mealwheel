export default async function updateHouseholdInDb(household, mutateHousehold) {
  if (!household) return;
  if (!mutateHousehold) throw new Error("Household cache cannot be updated.");

  return mutateHousehold(
    async () => {
      const response = await fetch(`/api/households/${household._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(household),
      });

      if (!response.ok) throw new Error("Failed to update household data.");
      return household;
    },
    {
      optimisticData: household,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }
  );
}
