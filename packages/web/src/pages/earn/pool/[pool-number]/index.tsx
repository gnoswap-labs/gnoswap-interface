import { useRouter } from "next/router";

export default function Pool() {
  const router = useRouter();
  const poolNumber = router.query["pool-number"];

  return (
    <div>
      <h1>Pool</h1>
      <div>pool-number: {poolNumber}</div>
    </div>
  );
}
