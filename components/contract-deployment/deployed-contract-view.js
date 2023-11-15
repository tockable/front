import { useState, useEffect, useContext } from "react";
import getChainData from "@/utils/chain-utils";
import { LaunchpadContext } from "@/contexts/project-context";
// import verify from "@/actions/contract/verify";
import Button from "../design/button/button";
import Loading from "../loading/loading";

export default function DeployedContractView() {
  const { project, setProject } = useContext(LaunchpadContext);

  const [chainData, setChainData] = useState();
  // const [verifying, setVerifying] = useState(false);
  // const [verificationError, setVerificationError] = useState(false);

  // async function callVerfify() {
  //   setVerifying(true);
  //   setVerificationError(false);
  //   const res = await verify(project);
  //   if (res.success === true) {
  //     setProject(res.payload);
  //   } else {
  //     setVerificationError(true);
  //   }
  //   setVerifying(false);
  // }

  useEffect(() => {
    if (!project) return;
    if (!project.isDeployed) return;
    const _chainData = getChainData(project.chainId);
    setChainData(_chainData);
  }, []);

  return (
    <div>
      <h1 className="font-bold text-xl mt-4 mb-6">
        <span className="text-tock-green ">contract info of </span>
        <span className="text-tock-orange">{project.tokenName}</span>
      </h1>

      {chainData && (
        <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">contract address</p>
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
            <p className="text-zinc-400 text-sm mt-2">{project.tokenSymbol}</p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">total supply</p>
            <p className="text-zinc-400 text-sm mt-2">
              {project.isUnlimited ? "unlimited" : project.totalSupply}
            </p>
          </section>

          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">see contract on</p>
            <a
              className="text-blue-400 hover:text-blue-200 text-sm mt-2"
              href={`${chainData?.url}/address/${project.contractAddress}`}
              rel="noopener noreferer"
            >
              {chainData.scan}
            </a>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">verification:</p>
            {project.isVerified && (
              <p className="text-tock-green text-sm mt-2"> verified</p>
            )}
            {!project.isVerified && (
              <div>
                {/* <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => callVerfify()}
                  disabled={verifying}
                >
                  {verifying && <Loading isLoading={verifying} size={10} />}
                  {!verifying && <p>verify contract</p>}
                </Button> */}
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => callVerfify()}
                  disabled={true}
                >
                  verify contract (soon)
                </Button>
                {/* {verificationError && (
                  <p className="text-tock-red text-sm mt-2">
                    an error occured during verification, please try again.
                  </p>
                )} */}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
