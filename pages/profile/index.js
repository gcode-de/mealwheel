import StyledArticle from "@/components/Styled/DetailArticle";
import IconButton from "@/components/Styled/IconButton";
import StyledList from "@/components/Styled/StyledList";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import Heart from "@/public/icons/heart-svgrepo-com.svg";
import StyledH2 from "@/components/Styled/StyledH2";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import Pot from "@/public/icons/cooking-pot-fill-svgrepo-com.svg";
import StyledP from "@/components/Styled/StyledP";

export default function ProfilePage() {
  return (
    <>
      <IconButton style="settings" top="1rem" left="1rem" />
      <WrapperCenter>
        <StyledProfile>
          <h1>🙋‍♀️</h1>
        </StyledProfile>
      </WrapperCenter>
      <StyledList>
        <p>Hallo Mensch!</p>
      </StyledList>
      <Wrapper>
        <Link href="/favorites">
          <StyledList>
            <Heart width={40} height={40} />
          </StyledList>
          <StyledP>Favoriten</StyledP>
        </Link>
        <Link href="/profile/hasCooked">
          <StyledList>
            <Pot width={40} height={40} />
          </StyledList>
          <StyledP>gekocht</StyledP>
        </Link>
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WrapperCenter = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledProfile = styled.div`
  background-color: white;
  width: 120px;
  height: 120px;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  display: flex;
  justify-content: center;
  align-items: center;
`;
