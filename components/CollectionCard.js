import StyledCollection from "./Styled/StyledCollection";
import Book from "/public/icons/svg/notebook-alt_9795395.svg";
import styled from "styled-components";

export default function CollectionCard({ collection }) {
  return (
    <StyledCollection
      key={collection._id}
      href={`/profile/collections/${collection._id}`}
    >
      <StyledBook width={60} height={60} />
      <StyledParagraph>{collection.collectionName}</StyledParagraph>
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
