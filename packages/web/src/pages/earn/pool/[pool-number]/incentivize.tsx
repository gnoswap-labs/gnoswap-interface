import { useRouter } from "next/router";

export default function PoolIncentivize() {
  const router = useRouter();
  const poolNumber = router.query["pool-number"];

  return (
    <div>
      <h1>Pool Incentivize</h1>
      <div>pool-number: {poolNumber}</div>
    </div>
  );
}
