import styled from "styled-components";
export default function FollowButton({
  isFriend,
  isRequested,
  handleAddPeople,
  handleUnfollowPeople,
  user,
}) {
  return (
    <>
      {isFriend ? (
        <Button onClick={() => handleUnfollowPeople(user._id)}>
          Freundschaft beenden
        </Button>
      ) : (
        <Button
          onClick={() => handleAddPeople(user._id)}
          disabled={isRequested}
        >
          {isRequested ? "Freundschaft angefragt" : "Freundschaft anfragen"}
        </Button>
      )}
    </>
  );
}
const Button = styled.button`
  background-color: ${(props) =>
    props.disabled ? "var(--color-darkgrey)" : "var(--color-background)"};
  color: ${(props) =>
    props.disabled ? "var(--color-background)" : "var(--color-font)"};
  border: none;
  border-radius: var(--border-radius-small);
  height: 30px;
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
  display: flex;
  align-items: center;
`;
