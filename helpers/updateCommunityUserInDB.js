export default async function updateCommunityUserInDB(
  communityUser,
  mutateCommunityUser
) {
  if (!communityUser) return;

  const currentUser = communityUser;
  await mutateCommunityUser(
    (prevUser) => ({ ...prevUser, ...communityUser }),
    false
  );

  try {
    const response = await fetch(`/api/users/${communityUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(communityUser),
    });

    if (response.ok) {
      await mutateCommunityUser();
    } else {
      throw new Error("Failed to update user data.");
    }
  } catch (error) {
    console.error(error);
    await mutateCommunityUser(currentUser, false);
    throw error;
  }
}
