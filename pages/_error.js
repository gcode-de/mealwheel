import { useRouter } from "next/router";

function Error({ statusCode }) {
  const router = useRouter();

  router.push("/");
}

export default Error;
