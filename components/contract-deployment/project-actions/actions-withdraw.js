import { useContext } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Button from "../../design/button/button";
import { LaunchpadContext } from "@/contexts/project-context";
import Loading from "@/components/loading/loading";

export default function ActionWithdraw({ abi }) {
  const { project } = useContext(LaunchpadContext);
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "withdraw",
  });

  const { isLoading, isError, write, error } = useContractWrite(config);
  return (
    <section id="withdraw">
      <p className="text-tock-blue text-sm m-2">Withdraw all ETH to:</p>
      <p className="text-zinc-400 font-normal text-xs m-2">
        contract owner: {project.creator}
      </p>
      <Button className="mt-4" variant={"secondary"} onClick={() => write?.()}>
        {isLoading && <Loading isLoading={isLoading} size={10} />}
        {!isLoading && <p>withdraw all</p>}
      </Button>
      {isError && <p className="text-tock-red mt-2 text-sx">{error.name}</p>}
    </section>
  );
}
