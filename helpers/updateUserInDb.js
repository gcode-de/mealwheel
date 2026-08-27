export default async function updateUserInDb(user, mutateUser) {
  if (!user) return;
  if (!mutateUser) throw new Error("User cache cannot be updated.");

  return mutateUser(
    async () => {
      const response = await fetch(`/api/users/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to update user data.");
      return user;
    },
    {
      optimisticData: user,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }
  );
}
