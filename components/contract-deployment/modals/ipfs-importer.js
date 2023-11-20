import { useState, useEffect, useContext } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import SwitchNetworkButton from "@/components/design/button-switch-network/button-switch-network";
import { createTaits } from "@/utils/crypto-utils";
import { updateProjectMetadata } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Loading from "@/components/loading/loading";
import LabeledInput from "@/components/design/labeled-input/labeled-input";
import Button from "@/components/design/button/button";

export default function IpfsImporter({ layers, handleGetBack, layerFilesNames }) {
  const { abi, project, callGetContractAbi, setProject } =
    useContext(LaunchpadContext);

  const [layerIpfsCids, setLayerIpfsCids] = useState([]);
  const [traits, setTraits] = useState([]);
  const [gettingAbi, setGettingAbi] = useState(false);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [abiNotFetched, setAbiNotFetched] = useState(false);
  const [hideRest, setHideRest] = useState(false);
  const [writing, setWriting] = useState(false);
  const [successOnIpfs, setSuccessOnIpfs] = useState(false);
  const [cannotEmpty, setCannotEmpty] = useState(false);

  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "addTraitTypes",
    args: [traits],
    enabled: readyToDeploy,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!uwt.isSuccess) return;

    setWriting(true);
    updateProjectMetadata(
      project.uuid,
      project.creator,
      layers,
      layerFilesNames,
      layerIpfsCids
    ).then((res) => {
      if (res.success === true) {
        setSuccessOnIpfs(true);
        setProject(res.payload);
      } else {
        setTraits([]);
        setErrorOnIpfs(true);
      }
    });
    setWriting(false);
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!project) return;
    if (traits.length == 0) return;
    if (abi) setReadyToDeploy(true);
    else {
      callGetContractAbi().then((res) => {
        if (res.success === false) {
          setAbiNotFetched(true);
        } else setReadyToDeploy(true);
      });
    }
  }, [traits]);

  async function getAbiAgain() {
    setGettingAbi(true);
    const res = await callGetContractAbi();
    if (res.success === true) {
      setAbiNotFetched(false);
      setReadyToDeploy(true);
    }
    setGettingAbi(false);
  }

  function handleIpfsAdd(_index, _cid) {
    const _layerIpfsCids = layerIpfsCids;
    _layerIpfsCids[_index] = _cid.trim();
    setLayerIpfsCids(_layerIpfsCids);
  }

  function importIpfs() {
    let isEmpty = false;

    for (let i = 0; i < layerIpfsCids.length; i++) {
      if (!layerIpfsCids[i]) {
        setCannotEmpty(true);
        isEmpty = true;
        break;
      }
    }

    if (isEmpty) return;

    const _traits = createTaits(layers);
    setTraits(_traits);
    setHideRest(true);
  }

  async function deploy() {
    setSuccessOnIpfs(false);
    write?.();
  }

  return (
    <div className="p-4">
      {!hideRest && (
        <div>
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            import ipfs cids
          </h1>
          <p className="text-zinc-400 text-sm mt-2 mb-4">
            copy/pase your layer cids into correlated fields.
          </p>
          <p className="text-zinc-400 text-sm mt-2 mb-4">
            please make sure that you input correct cid for each directory,
            since this action is IRREVERSIBLE after deploying.{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferer"
              className="text-blue-400 hover:text-blue-200"
            >
              learn how do this correctly
            </a>
          </p>
          <section className="mt-2 mb-4">
            {layers?.map((layer, i) => (
              <div key={"layer_ipfs_" + i}>
                <LabeledInput
                  onChange={(e) => handleIpfsAdd(i, e.target.value)}
                >
                  ipfs cid for <span className="text-tock-orange">{layer}</span>
                </LabeledInput>
              </div>
            ))}
          </section>
          <Button variant="primary" onClick={importIpfs}>
            import
          </Button>
          <button
            className="my-4 transition ease-in-out mr-4 hover:bg-zinc-700 duration-300 text-zinc-500 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline hover:text-blue-400 active:text-white"
            onClick={handleGetBack}
          >
            back
          </button>
          {cannotEmpty && (
            <p className="text-tock-red text-xs mt-2">
              ipfs field cannot be empty
            </p>
          )}
        </div>
      )}
      {hideRest && (
        <div>
          {abiNotFetched && (
            <Button
              onClick={() => getAbiAgain()}
              disabled={isLoading}
              variant="warning"
            >
              {!abi && <p>retry</p>}
              {abiNotFetched && <Loading isLoading={gettingAbi} size={10} />}
            </Button>
          )}
          {uwt.isLoading && (
            <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
              <h1 className="text-tock-green font-normal text-lg mb-2">
                wait for transaction...
              </h1>
              <p className="text-tock-orange text-xs font-normal mb-6">
                please do not close this window...
              </p>
              <div className="flex justify-center items-center">
                <div className="flex justify-center h-12 mb-8 items-center">
                  <Loading isLoading={uwt.isLoading} size={20} />
                </div>
              </div>
            </div>
          )}
          {successOnIpfs && (
            <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
              <h1 className="text-tock-green font-normal text-lg mb-6">
                Metadata deployed successully!
              </h1>
            </div>
          )}
          {readyToDeploy &&
            !uwt.isSuccess &&
            !successOnIpfs &&
            !uwt.isLoading && (
              <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                <h1 className="text-tock-green font-normal text-lg mb-12">
                  sign to deploy
                </h1>

                {chain.id != project.chainId && (
                  <SwitchNetworkButton project={project} />
                )}

                {chain.id === Number(project.chainId) && (
                  <div className="flex flex-col justify-center items-center">
                    <Button
                      onClick={() => deploy()}
                      disabled={isLoading || uwt.isLoading || writing}
                      variant="primary"
                    >
                      {!isLoading && !uwt.isLoading && !writing && (
                        <p>deploy</p>
                      )}

                      {(isLoading || uwt.isLoading || writing) && (
                        <Loading
                          isLoading={isLoading || uwt.isLoading || writing}
                          size={10}
                        />
                      )}
                    </Button>
                    {isError && (
                      <p className="text-tock-red text-xs mt-2">{error.name}</p>
                    )}
                    {uwt.isError && (
                      <p className="text-tock-red text-xs mt-2">tx failed</p>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
