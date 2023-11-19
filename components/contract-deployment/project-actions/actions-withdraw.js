import { useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Button from "../../design/button/button";
import { LaunchpadContext } from "@/contexts/project-context";
import Loading from "@/components/loading/loading";

export default function ActionWithdraw({ abi }) {
  const { project } = useContext(LaunchpadContext);
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "withdraw",
    gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section id="withdraw">
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">withdraw</h1>
      </div>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-6">
        contract owner: {project.creator}
      </p>
      <Button
        className="mt-6"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading) && (
          <Loading isLoading={isLoading || uwt.isLoading} size={10} />
        )}
        {!isLoading && !uwt.isLoading && <p>withdraw all</p>}
      </Button>
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Withdraw done.</p>
      )}
    </section>
  );
}
