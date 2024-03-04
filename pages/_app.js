import GlobalStyle from "../styles";
import Layout from "@/components/Layout";
import { SWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const userId = "65e0925792f086ae06d2eadb";

  return (
    <>
      <Layout>
        <GlobalStyle />
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} userId={userId} />
        </SWRConfig>
      </Layout>
    </>
  );
}
