import { useEffect, useContext, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { LaunchpadContext } from "@/contexts/project-context";
import ActionAdminMint from "./project-actions/actions-admin-mint";
import ActionSetActiveSession from "./project-actions/acitons-set-active-session";
import ActionWithdraw from "./project-actions/actions-withdraw";
import ActionMintStatus from "./project-actions/actions-mint-status";
import Loading from "../loading/loading";
import Button from "../design/button/button";

export default function ProjectContractActions() {
  const actions = [
    "Set Active Session",
    "Admin Mint",
    "Withdraw",
    "Set Mint Status",
  ];
  const { project, abi, callGetContractAbi } = useContext(LaunchpadContext);
  const [activeAction, setActiveAction] = useState(actions[0]);
  const [abiError, setAbiError] = useState(false);
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {
    if (!project) return;
    if (!abi) {
      callGetContractAbi().then((res) => {
        if (res.success === false) {
          setAbiError(true);
        }
      });
    }
  }, [project]);
  return (
    <>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        contract actions
      </h1>
      <p className="text-zinc-400 text-sm mb-4">
        you can write contract with availabe functions
      </p>
      {abiError && (
        <p className="text-tock-red text-sm">
          something wrong, please refresh the page and navigate to Actions
          again.
        </p>
      )}
      {!abiError && (
        <section>
          {chain.id != project.chainId && (
            <Button
              className="xs:mt-2"
              variant="warning"
              type="button"
              onClick={() => switchNetwork?.(Number(project.chainId))}
              disabled={isLoading}
            >
              <div>
                {isLoading && pendingChainId === Number(project.chainId) && (
                  <Loading
                    isLoading={
                      isLoading && pendingChainId === Number(project.chainId)
                    }
                    size={10}
                  />
                )}
                {!isLoading && <div> switch network to {project.chain}</div>}
              </div>
            </Button>
          )}
          {error && (
            <p className="text-tock-red text-xs mt-2">
              Switch network failed. please try again, or changing manually
              using one of the following:
              <ul className="mt-2">
                <li>
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="https://chainlist.org"
                  >
                    chainlist.org
                  </a>
                </li>
                <li>
                  <a
                    className="text-blue-400 hover:text-blue-300"
                    href="https://chainlist.wtf"
                  >
                    chainlist.wtf
                  </a>
                </li>
              </ul>
            </p>
          )}

          {chain.id === Number(project.chainId) && (
            <div>
              <nav className="flex flex-row gap-2 text-sm text-tock-green  mb-2">
                {actions.map((action) => (
                  <button
                    className={`bg-${
                      activeAction === action ? "zinc-700" : "tock-black"
                    } 
             ${
               activeAction === action ? "" : "hover:bg-tock-semiblack"
             } px-2 transition ease-in-out duration-300 rounded-2xl h-14 text-xs px-2 lg:h-10 border border-zinc-700`}
                    key={action}
                    onClick={() => setActiveAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </nav>
              <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
                {activeAction == "Set Active Session" && (
                  <ActionSetActiveSession abi={abi} />
                )}
                {activeAction == "Admin Mint" && <ActionAdminMint />}
                {activeAction == "Withdraw" && <ActionWithdraw abi={abi} />}
                {activeAction == "Set Mint Status" && (
                  <ActionMintStatus abi={abi} />
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
