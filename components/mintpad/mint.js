import { useState, useContext, useEffect } from "react";
import { MintContext } from "@/contexts/mint-context";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";
import { BASE_FEE } from "@/tock.config";
import { EMPTY_BYTES_32 } from "@/constants/constants";
import Button from "../design/button/button";
import Loading from "../loading/loading";

export default function Mint({
  role,
  mintAction,
  session,
  abi,
  blob,
  handleBlob,
  setKey,
}) {
  //   const [quantity, setQuantity] = useState(1);
  //   const debouncedQuantity = useDebounce(quantity, 1000);
  //   function onAmountIncrease(e) {
  //     if (quantity + 1 <= data.maxMint) setQuantity(quantity + 1);
  //   }
  //   function onAmountDecrease(e) {
  //     if (quantity - 1 >= 0) setQuantity(quantity - 1);
  //   }

  //   function onMaxAmount() {
  //     if (quantity == data.maxMint) {
  //       return true;
  //     }
  //     return false;
  //   }

  //   function onMinAmount() {
  //     if (quantity == 0) {
  //       return true;
  //     }
  //     return false;
  //   }

  const { address } = useAccount();
  const [state, setState] = useState("stal");
  const [apiError, setApiError] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [_blob, _setBlob] = useState(null);
  const [printedError, setPrintedError] = useState("");
  const [args, setArgs] = useState([
    1,
    [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
    EMPTY_BYTES_32,
    role.id,
    [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
  ]);

  const { project } = useContext(MintContext);

  const price = parseEther((Number(role.price) + BASE_FEE).toString(), "wei");
  const { config, isError, error } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "mint",
    args: args,
    value: price,
    enabled: enableState,
  });

  const wc = useContractWrite(config);

  const uwt = useWaitForTransaction({ hash: wc.data?.hash });

  useEffect(() => {
    if (
      args[0] !== 1 ||
      args[1].length === 0 ||
      args[1].part1 === EMPTY_BYTES_32 ||
      args[1].part2 === EMPTY_BYTES_32 ||
      args[2] === EMPTY_BYTES_32 ||
      args[4].length === 0 ||
      args[4][0].trait_type === EMPTY_BYTES_32 ||
      args[4][0].value === EMPTY_BYTES_32
    ) {
      setState("stal");
      return;
    }

    if (
      args[0] === 1 &&
      args[1].length === 1 &&
      args[1].part1 === EMPTY_BYTES_32 &&
      args[1].part2 === EMPTY_BYTES_32 &&
      args[2] === EMPTY_BYTES_32 &&
      args[4].length === 1 &&
      args[4][0].trait_type === EMPTY_BYTES_32 &&
      args[4][0].value === EMPTY_BYTES_32
    ) {
      setState("stal");
      return;
    }
    setEnableState(true);
  }, [args]);

  useEffect(() => {
    if (!enableState) return;
    async function w() {
      wc.write?.();
    }
    w();
    // wc.write?.();
  }, [enableState]);

  useEffect(() => {
    setState("stal");
    setEnableState(false);
  }, [wc.isSuccess]);

  // useState(() => {
  //   if (!wc.isError) return;
  //   if (
  //     wc.error?.message.match(/^User rejected the request./g) ||
  //     wc.error?.message.match(
  //       /^MetaMask Tx Signature: User denied trancsaction signature./g
  //     ) ||
  //     wc.error?.code == 4001
  //   ) {
  //     console.log(wc.error.message);
  //     setPrintedError("Rejected by user");
  //   }
  // }, [wc.isError]);
  useState(() => {
    if (!isError) return;
    setState("stal");
    setEnableState(false);
    if (error) console.log(error);
    if (error?.message.match(/^MoreThanAllowed()/g)) {
      setPrintedError(
        "You are exceed your mint limit per wallet in this session-role"
      );
    } else {
      if (error?.name) {
        setPrintedError(error.name);
      } else {
        setPrintedError("as error occured");
      }
    }
  }, [isError]);

  useEffect(() => {
    if (!blob) return;

    _setBlob(blob);
  }, [blob]);

  useEffect(() => {
    if (!_blob) return;
    const file = new FormData();
    file.append("file", blob.blob);
    mintAction(address, role.id, session, file).then((res) => {
      if (res.success === true) {
        const { cid, signature } = res;
        const _args = [1, [cid], signature, Number(role.id), [blob.traits]];
        setArgs(_args);
        setState("ready");
        if (apiError) setApiError(false);
      } else {
        setState("stal");
        setApiError(true);
      }
    });
  }, [_blob]);

  async function mint() {
    setKey();
    setEnableState(false);
    _setBlob(null);
    setState("preparing");
    handleBlob();
  }

  return (
    <div className="w-full">
      {/* <div className="flex justify-center select-none">
         <button
          className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
          onClick={onAmountDecrease}
          disabled={onMinAmount}
        >
          -
        </button>

        <button
          className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-300 bg-tock-semiblack text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
          onClick={onAmountIncrease}
          disabled={onMaxAmount}
        >
          +
        </button> 
      </div> */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex grow ">
          <p className="text-zinc-400 text-xs items-center">
            as <span className="text-tock-orange">{role.name}</span> | Max mint
            per wallet: <span className="text-tock-orange">{role.quota}</span>
          </p>
        </div>
        <div className="flex justify-center my-4">
          <Button
            variant="primary"
            disabled={wc.isLoading || uwt.isLoading || state === "preparing"}
            onClick={() => mint()}
          >
            {!wc.isLoading && !uwt.isLoading && state !== "preparing" && (
              <p className="text-sm">
                Mint THIS for {Number(role.price) + BASE_FEE} ETH
              </p>
            )}
            <div>
              {(wc.isLoading || uwt.isLoading || state === "preparing") && (
                <Loading
                  isLoading={
                    wc.isLoading || uwt.isLoading || state === "preparing"
                  }
                  size={10}
                />
              )}
            </div>
          </Button>
        </div>
      </div>
      {isError ||
        (wc.isError && <p className="text-tock-red text-xs">{printedError}</p>)}
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
