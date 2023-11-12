import { useState, useContext, useEffect } from "react";
import { MintContext } from "@/contexts/mint-context";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import { EMPTY_BYTES_32 } from "@/constants/constants";
import Button from "../design/button/button";
import Loading from "../loading/loading";

export default function AdminMint({ mintAction, abi, blob, handleBlob }) {
  const { address } = useAccount();
  const [enableState, setEnableState] = useState(false);
  const [state, setState] = useState("stal");
  const [apiError, setApiError] = useState(false);
  const [args, setArgs] = useState([
    1,
    [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
    [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
  ]);

  const { project } = useContext(MintContext);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "ownerMint",
    args: args,
    enabled: enableState,
  });

  const { data, isLoading, isSuccess, isError, write, error } =
    useContractWrite(config);

  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (
      args[0] === 1 &&
      args[1].length === 1 &&
      args[1].part1 === EMPTY_BYTES_32 &&
      args[1].part2 === EMPTY_BYTES_32 &&
      args[2].length === 1 &&
      args[2][0].trait_type === EMPTY_BYTES_32 &&
      args[2][0].value === EMPTY_BYTES_32
    ) {
      setState("stal");
      return;
    }

    if (
      args[0] !== 1 ||
      args[1].length === 0 ||
      args[1].part1 === EMPTY_BYTES_32 ||
      args[1].part2 === EMPTY_BYTES_32 ||
      args[2].length === 0
    ) {
      setState("stal");
      return;
    }
    async function w() {
      write?.();
    }
    w();
  }, [args]);

  useEffect(() => {
    setState("stal");
    setEnableState(false);
  }, [isSuccess]);

  useState(() => {
    setState("stal");
    setEnableState(false);
  }, [isError]);

  useEffect(() => {
    if (!blob) return;
    if (!enableState) return;
    const file = new FormData();
    file.append("file", blob.blob);
    mintAction(address, 99, 99, file).then((res) => {
      if (res.success === true) {
        const { cid } = res;
        const _args = [1, [cid], [blob.traits]];
        setArgs(_args);
        setState("ready");
        if (apiError) setApiError(false);
      } else {
        setState("stal");
        setApiError(true);
      }
    });
  }, [blob]);

  async function mint() {
    setState("preparing");
    setEnableState(true);
    handleBlob();
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex grow ">
          <p className="text-zinc-400 text-xs items-center">
            as <span className="text-tock-orange">owner</span> | Free
          </p>
        </div>
        <div className="flex justify-center my-4">
          <Button
            variant="primary"
            disabled={isLoading || uwt.isLoading || state === "preparing"}
            onClick={() => mint()}
          >
            {!isLoading && !uwt.isLoading && state !== "preparing" && (
              <p className="text-sm">FREE owner mint</p>
            )}
            <div>
              {(isLoading || uwt.isLoading || state === "preparing") && (
                <Loading
                  isLoading={
                    isLoading || uwt.isLoading || state === "preparing"
                  }
                  size={10}
                />
              )}
            </div>
          </Button>
        </div>
      </div>
      {error && <p className="text-tock-red text-xs">{error.name}</p>}
      {apiError && (
        <p className="text-tock-red text-xs">
          something went wrong, please try again.
        </p>
      )}
      {uwt.isSuccess && (
        <p className="text-tock-green text-xs">Successfully minted!</p>
      )}
    </div>
  );
}
