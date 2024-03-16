import StyledCollection from "./Styled/StyledCollection";

export default function CollectionCard({ collection }) {
  return (
    <StyledCollection
      key={collection._id}
      href={`/profile/collections/${collection._id}`}
    >
      {collection.collectionName}
    </StyledCollection>
  );
}
