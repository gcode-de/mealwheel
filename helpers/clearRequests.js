import sendRequestToUser from "./sendRequestToUser";

export default async function clearRequests(id1, id2, mutateUser) {
  if (!id1 || !id2) return;

  await sendRequestToUser(
    id1,
    {
      senderId: id2,
      type: null,
    },
    mutateUser
  );

  await sendRequestToUser(
    id2,
    {
      senderId: id1,
      type: null,
    },
    mutateUser
  );

  return;
}
