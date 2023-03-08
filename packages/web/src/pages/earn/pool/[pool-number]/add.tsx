import { useRouter } from "next/router";

export default function PoolAdd() {
  const router = useRouter();
  const poolNumber = router.query["pool-number"];

  return (
    <div>
      <h1>Pool Add</h1>
      <div>pool-number: {poolNumber}</div>
    </div>
  );
}
