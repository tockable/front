import { useState, useRef, useEffect, useContext } from "react";
import { useAccount } from "wagmi";
import { getWalletClient, getPublicClient } from "@wagmi/core";
import { createWalletClient } from "viem";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { TOCKABLE_ADDRESS } from "@/tock.config";
import { createNewSigner } from "@/actions/signature/createWallet";
import { updateDeployStatus } from "@/actions/launchpad/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import { upddateProjectSigner } from "@/actions/launchpad/projects";
import Modal from "@/components/design/modals/modal";
import Button from "@/components/design/button/button";
import Loading from "@/components/loading/loading";
import { ContractFactory, providers } from "ethers";

export default function DeployContractModal({ onClose, bytecode }) {
  const { project, setProject, abi } = useContext(LaunchpadContext);
  const { address } = useAccount();

  const [takeMoment, setTakeMoment] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [callWallet, setCallWallet] = useState(false);

  const [signer, setSigner] = useState(null);
  const txhash = useRef(null);
  const [txreciept, settxreciept] = useState(null);

  useEffect(() => {
    if (bytecode.length === 0) return;
    createNewSigner(address, project.uuid)
      .then((res) => {
        if (res.success === true) {
          setSuccess("");
          setError("");
          setSigner(res.signer);
          setTakeMoment(false);
        } else throw new Error(res.message);
      })
      .catch((err) => {
        setTakeMoment(false);
        if (err.message === "forbidden") {
          setError("Only creator can edit the project");
        } else {
          setError("Something happened in our side, please try again.");
        }
      });
  }, [bytecode]);

  function closeOnSuccess() {
    setProject(project);
    onClose();
  }

  async function deploy() {
    setCallWallet(true);
    try {
      const client = await getWalletClient({
        chainId: Number(project.chainId),
      });

      const hash = await client.deployContract({
        abi,
        bytecode,
        account: address,
        args: [TOCKABLE_ADDRESS, signer],
        gas: 10_000_000n,
      });

      // alterrnative 2
      // const { account, chain, transport } = client;
      // const network = {
      //   chainId: chain.id,
      //   name: chain.name,
      //   ensAddress: chain.contracts?.ensRegistry?.address,
      // };
      // const provider = new BrowserProvider(transport, network);
      // const ethsigner = new JsonRpcSigner(provider, account.address);
      // const contract = new ContractFactory(abi, bytecode, ethsigner);
      // await contract.deploy(TOCKABLE_ADDRESS, signer);

      if (hash) {
        txhash.current = hash;
      } else {
        setTakeMoment(false);
        setSuccess("");
        setError("deployment failed at sending tx stage, please try again.");
        return;
      }

      const publicClient = getPublicClient({
        chainId: Number(project.chainId),
      });

      const reciept = await publicClient.waitForTransactionReceipt({ hash });

      if (reciept) {
        settxreciept(reciept);

        const signerRes = await upddateProjectSigner(
          project.uuid,
          project.creator,
          signer
        );

        if (signerRes.success === true) {
          const res = await updateDeployStatus(
            project.uuid,
            project.creator,
            reciept.contractAddress
          );
          if (res.success === true) {
            setError("");
            setSuccess("contract deployed successfully!");
            setTakeMoment(false);
            setProject(res.payload);
          } else {
            setTakeMoment(false);
            setSuccess("");
            setError("deployment failed, please try again.");
            return;
          }
        }
      } else {
        setTakeMoment(false);
        setSuccess("");
        setError("deployment tx failed, please try again.");
        return;
      }
    } catch (err) {
      if (
        err.message.match(/^User rejected the request./g) ||
        err.message.match(
          /^MetaMask Tx Signature: User denied trancsaction signature./g
        ) ||
        err.code == 4001
      ) {
        setError("Rejected by user.");
      } else {
        console.log(err);
        setError("wallet error occured");
      }
      setTakeMoment(false);
      setSuccess("");
      setCallWallet(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            deploying...
          </h1>
          {takeMoment && (
            <p className="text-tock-orange text-sm mb-4">
              deploying contract may take some time... please do not close this
              window...
            </p>
          )}

          {takeMoment && error.length == 0 && (
            <div className="flex justify-center items-center">
              <Loading isLoading={takeMoment} size={20} />
            </div>
          )}

          <div className="mb-6">
            {signer && error.length == 0 && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-tock-green">
                  please sign to deploy the contract...
                </p>
                <Button
                  className="mt-8 w-40"
                  variant="primary"
                  onClick={() => deploy()}
                  disabled={callWallet}
                >
                  {!callWallet && <p>sign and deploy</p>}
                  {callWallet && !txreciept && (
                    <Loading isLoading={callWallet && !txreciept} size={10} />
                  )}
                </Button>
              </div>
            )}
            {error.length > 0 && (
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-tock-red">{error}</p>
                <Button className="mt-8" variant="warning" onClick={onClose}>
                  close
                </Button>
              </div>
            )}
            {success.length > 0 && (
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-tock-grees">{success}</p>
                <Button
                  className="mt-8"
                  variant="primary"
                  onClick={closeOnSuccess}
                >
                  close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
