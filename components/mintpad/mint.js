import { useState, useContext, useEffect } from "react";
import { parseEther, BaseError, ContractFunctionRevertedError } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import { BASE_FEE } from "@/tock.config";
import { EMPTY_BYTES_32 } from "@/constants/constants";
import { MintContext } from "@/contexts/mint-context";
import Button from "../design/button/button";
import Loading from "../loading/loading";

export default function Mint({
  handleRoleVisibility,
  prepareMint,
  role,
  session,
  incrementBlobState,
  show,
}) {
  function handleClick() {
    incrementBlobState();
    handleRoleVisibility(role.id);
  }
  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="flex grow border border-zinc-400 bg-tock-black rounded-2xl p-4 my-4 mx-4 hover:bg-tock-semiblack transition ease-in-out duration-200 cursor-pointer"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row">
            <div className="flex grow ">
              <p className="text-zinc-400 text-xs items-center">
                as <span className="text-tock-orange">{role.name}</span> | Max
                mint per wallet:{" "}
                <span className="text-tock-orange">{role.quota}</span>
              </p>
            </div>
            <div className="text-tock-green text-xs justify-end">
              {!show && <span>click to expand</span>}
            </div>
          </div>

          {show && (
            <MintHandler
              role={role}
              session={session}
              prepareMint={prepareMint}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MintHandler({ role, prepareMint, session }) {
  const { abi, blob } = useContext(MintContext);
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
  const price = parseEther((Number(role.price) + BASE_FEE).toString(), "wei");
  const { project } = useContext(MintContext);
  const { address } = useAccount();

  const [successMint, setSuccessMint] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [readyToMint, setReadyToMint] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [printedError, setPrintedError] = useState("");
  const [warning, setWarning] = useState("");
  const [writeArgs, setwriteArgs] = useState([
    1,
    [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
    EMPTY_BYTES_32,
    role.id,
    [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
  ]);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "mint",
    args: writeArgs,
    value: price,
    enabled: enableState,
    onSuccess(data) {
      setReadyToMint(true);
    },
    onError(error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (error) => error instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          if (errorName === "MoreThanAllowed") {
            setWarning("Mint limit exceeded on this role.");
          } else if (errorName === "MoreThanAvailable") {
            setWarning("Mint limit exceeded on this session/contract.");
          } else if (errorName === "NotElligible") {
            setWarning("Mint session changed, Please refresh the page.");
          } else if (errorName === "TokenHasBeenTakenBefore") {
            setWarning("This traits has been taken before.");
          } else if (errorName == "TokenIsTakenBefore") {
            setWarning("This traits has been taken before.");
          } else {
            setWarning("");
            setPrintedError("Unknown error occured.");
          }
        }
      } else {
        setWarning("");
        setPrintedError("Unknown error occured.");
      }
      setSuccessMint(false);
      setPreparing(false);
      setEnableState(false);
      setReadyToMint(false);
      setwriteArgs([
        1,
        [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
        EMPTY_BYTES_32,
        role.id,
        [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
      ]);
    },
  });

  const wc = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: wc.data?.hash });

  useEffect(() => {
    if (
      writeArgs[0] !== 1 ||
      writeArgs[1].length === 0 ||
      writeArgs[1][0].part1 === EMPTY_BYTES_32 ||
      writeArgs[1][0].part2 === EMPTY_BYTES_32 ||
      writeArgs[2] === EMPTY_BYTES_32 ||
      writeArgs[4].length === 0 ||
      writeArgs[4][0][0].trait_type === EMPTY_BYTES_32 ||
      writeArgs[4][0][0].value === EMPTY_BYTES_32
    ) {
      setPreparing(false);
      setSuccessMint(false);
      return;
    }
    setEnableState(true);
  }, [writeArgs]);

  useEffect(() => {
    if (!readyToMint) return;
    async function w() {
      wc.write?.();
    }
    if (wc.write) {
      w();
    }
  }, [readyToMint]);

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setSuccessMint(true);
    setReadyToMint(false);
    setEnableState(false);
    setPreparing(false);
    setPrintedError("");
    setWarning("");
    setwriteArgs([
      1,
      [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
      EMPTY_BYTES_32,
      role.id,
      [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
    ]);
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!uwt.isError) return;
    setSuccessMint(false);
    setReadyToMint(false);
    setEnableState(false);
    setPreparing(false);
    setWarning("");
    setPrintedError("Transaction failed.");
    setwriteArgs([
      1,
      [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
      EMPTY_BYTES_32,
      role.id,
      [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
    ]);
  }, [uwt.isError]);

  useEffect(() => {
    if (!wc.isError) return;
    setSuccessMint(false);
    setReadyToMint(false);
    setEnableState(false);
    setPreparing(false);
    setWarning("");
    setwriteArgs([
      1,
      [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
      EMPTY_BYTES_32,
      role.id,
      [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
    ]);

    if (
      wc.error.message.match(/^User rejected the request./g) ||
      wc.error.message.match(
        /^MetaMask Tx Signature: User denied trancsaction signature./g
      ) ||
      wc.error.code == 4001
    ) {
      setPrintedError("Rejected by user.");
    } else {
      setPrintedError("An Error occured");
    }
  }, [wc.isError]);

  async function mint() {
    if (!blob) return;
    setPreparing(true);
    setPrintedError("");
    setWarning("");
    const file = new FormData();
    file.append("file", blob.blob);
    const res = await prepareMint(address, role.id, session, file);
    if (res.success === true) {
      const { cid, signature } = res;
      const _args = [1, [cid], signature, Number(role.id), [blob.traits]];
      setApiError(false);
      setwriteArgs(_args);
    } else {
      setApiError(true);
      setPreparing(false);
    }
  }

  return (
    <div className="flex flex-col">
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

      <div className="flex justify-center">
        <Button
          variant="primary"
          disabled={wc.isLoading || uwt.isLoading || preparing}
          onClick={() => mint()}
        >
          {!wc.isLoading && !uwt.isLoading && !preparing && (
            <p className="text-sm">
              Mint THIS for {Number(role.price) + BASE_FEE} ETH
            </p>
          )}
          <div>
            {(wc.isLoading || uwt.isLoading || preparing) && (
              <Loading
                isLoading={wc.isLoading || uwt.isLoading || preparing}
                size={10}
              />
            )}
          </div>
        </Button>
      </div>

      {printedError.length > 0 && (
        <p className="text-tock-red text-xs">{printedError}</p>
      )}
      {warning.length > 0 && (
        <p className="text-tock-orange text-xs mt-2">{warning}</p>
      )}
      {apiError && (
        <p className="text-tock-red text-xs mt-2">
          something went wrong, please try again.
        </p>
      )}
      {successMint && (
        <p className="text-tock-green text-xs mt-2">Successfully minted!</p>
      )}
    </div>
  );
}
