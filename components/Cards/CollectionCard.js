import Book from "/public/icons/svg/notebook-alt_9795395.svg";
import styled from "styled-components";
import { useRouter } from "next/router";

export default function CollectionCard({
  collection,
  isEditing,
  handleSave,
  index,
}) {
  const router = useRouter();
  return (
    <StyledCollection
      key={collection._id}
      onClick={() => router.push(`/profile/collections/${collection._id}`)}
      disabled={isEditing}
    >
      <StyledBook width={40} height={40} />
      {isEditing ? (
        <StyledInput
          name="collectionName"
          defaultValue={collection.collectionName}
          aria-label="collection-name"
          onBlur={(event) => handleSave(event, index)}
        />
      ) : (
        <StyledParagraph>{collection.collectionName}</StyledParagraph>
      )}
    </StyledCollection>
  );
}
const StyledBook = styled(Book)`
  width: 100%;
`;
const StyledParagraph = styled.p`
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  margin-top: var(--gap-between);
  height: 2.5;
`;
const StyledCollection = styled.button`
  text-decoration: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: start;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  justify-content: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
  height: 93px;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: 100%;
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
  margin-top: var(--gap-between);
`;
