import StyledH2 from "@/components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import { useRouter } from "next/router";
import useSWR from "swr";
import ProfileCard from "../../../components/Cards/ProfileCard";
import updateCommunityUserInDB from "../../../helpers/updateCommunityUserInDB";

export default function Community({ user, fetcher }) {
  const {
    data: users,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/users`, fetcher);
  if (!user || !users) {
    return;
  }
  const router = useRouter();

  const community = users.filter((human) => human._id !== user._id);
  function handleAddPeople(id) {
    // nimm die user._id und sende sie an den user mit der übergebenen id
    let communityUser = users.find((user) => user._id === id);

    communityUser = {
      ...communityUser,
      connectionRequests: [
        {
          senderId: user._id,
          timestamp: Date(),
        },
      ],
    };
    console.log(communityUser);

    updateCommunityUserInDB(communityUser, mutate);
  }

  return (
    <>
      <Spacer />
      <StyledH2>Community</StyledH2>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      {community.map((user) => (
        <ProfileCard
          key={user._id}
          user={user}
          handleAddPeople={handleAddPeople}
        />
      ))}
    </>
  );
}
