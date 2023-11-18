import { useContext, useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { setMintPaused } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Loading from "@/components/loading/loading";
import Button from "../../design/button/button";

export default function ActionMintStatus({ abi }) {
  const { project } = useContext(LaunchpadContext);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setMintIsLive",
    args: [false],
  });

  const [success, setSuccess] = useState(false);
  const [isWriting, setWriting] = useState(false);

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setWriting(true);
    setMintPaused(project.creator, project.uuid).then((res) => {
      if (res.success === true) setSuccess(true);
    });
    setWriting(false);
  }, [uwt.isSuccess]);

  return (
    <section id="set-mint-status">
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">Pause mint</h1>
      </div>
      <p className="text-zinc-400 text-xs mt-4 mb-8">
        you can unpaused mint by setting your active session again.
      </p>
      <Button className="mt-4" variant={"secondary"} onClick={() => write?.()}>
        {(isLoading || uwt.isLoading || isWriting) && (
          <Loading
            isLoading={isLoading || uwt.isLoading || isWriting}
            size={10}
          />
        )}
        {!isLoading && !uwt.isLoading && !isWriting && <p>pause mint</p>}
      </Button>
      {(isLoading || uwt.isLoading || isWriting) && (
        <p className="text-tock-orange mt-2 text-xs">
          do not close this window, or change tab...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {success && <p className="text-tock-green mt-2 text-xs">Mint paused.</p>}
    </section>
  );
}
