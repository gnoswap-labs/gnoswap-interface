import { useRouter } from "next/router";

export default function Token() {
  const router = useRouter();
  const tokenPath = router.query["token-path"];

  return (
    <div>
      <h1>Token</h1>
      <div>token-path: {tokenPath}</div>
    </div>
  );
}
