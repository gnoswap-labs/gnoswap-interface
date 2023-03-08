import { useRouter } from "next/router";

export default function Swap() {
  const router = useRouter();
  const { from, to } = router.query;

  return (
    <div>
      <h1>Swap</h1>
      {from && <div>from: {from}</div>}
      {to && <div>to: {to}</div>}
    </div>
  );
}
