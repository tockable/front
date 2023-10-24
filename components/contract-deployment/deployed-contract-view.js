import { useState, useEffect, useContext } from "react";
import getChainScan from "@/utils/chainscan";
import { LaunchpadContext } from "@/contexts/project-context";

export default function DeployedContractView() {
  const { project } = useContext(LaunchpadContext);
  const [chainData, setChainData] = useState();

  useEffect(() => {
    if (!project) return;
    if (!project.isDeployed) return;
    const _chainData = getChainScan(project.chainId);
    console.log(_chainData);
    setChainData(_chainData);
  }, []);
  if (!project.isDeployed) {
    return <div>project is not deployed yet</div>;
  } else {
    return (
      <div>
        <h1 className="font-bold text-xl mt-4 mb-6">
          <span className="text-tock-green ">contract info of </span>
          <span className="text-tock-orange">{project.tokenName}</span>
        </h1>

        {chainData && (
          <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">
                contract address
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                {project.contractAddress}
              </p>
            </section>
            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">chain</p>
              <p className="text-zinc-400 text-sm mt-2">{project.chain}</p>
            </section>
            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">token name</p>
              <p className="text-zinc-400 text-sm mt-2">{project.tokenName}</p>
            </section>
            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">token symbol</p>
              <p className="text-zinc-400 text-sm mt-2">
                {project.tokenSymbol}
              </p>
            </section>
            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">total supply</p>
              <p className="text-zinc-400 text-sm mt-2">
                {project.isUnlimited ? "unlimited" : project.totalSupply}
              </p>
            </section>

            <section className="mt-2 mb-8">
              <p className="text-tock-blue font-bold text-sm">
                see contract on
              </p>
              <a
                className="text-blue-400 hover:text-blue-200 text-sm mt-2"
                href={`${chainData?.url}/${project.contractAddress}`}
                rel="noopener noreferer"
              >
                {chainData.name}
              </a>
            </section>
          </div>
        )}
      </div>
    );
  }
}
