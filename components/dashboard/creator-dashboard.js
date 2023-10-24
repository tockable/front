import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";
import { useAccount } from "wagmi";
import { fetchAllProjectsByWallet } from "@/api/projects/projects";
import NewProjectModal from "./modal-new-project";
import ProjectPreview from "./project-preview";
import Button from "../design/button/button";

export default function CreatorDashboard() {
  const { address, isConnected } = useAccount();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message:
      "By signing this message from tockable.xyz, we make sure that no one is using your dashboard instead of you.",
    onSuccess(data) {
      console.log(data);
      setVerifiedAddress(address);
    },
  });

  const [projects, setProjects] = useState([]);
  const [isVerified, setVerified] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [newPojectModalShow, setNewProjectModelShow] = useState(false);

  useEffect(() => {
    if (!verifiedAddress) return;
    setVerified(true);
  }, [verifiedAddress]);

  useEffect(() => {
    if (!isVerified) return;
    fetchAllProjectsByWallet(address).then((res) => {
      if (res.success === true) {
        setProjects(res.payload);
      } else if (res.success === false) {
        setProjects([]);
      }
    });
  }, [isVerified]);

  useEffect(() => {
    if (!isConnected) {
      setVerified(false);
      setVerifiedAddress(null);
    }
  }, [isConnected]);

  function handleCloseNewProjectModal() {
    setNewProjectModelShow(false);
  }

  return (
    <div className="relative top-24">
      <div className="flex justify-center items-center">
        <div className="basis-11/12 md:basis-3/4 lg:basis-5/6">
          {!isVerified && (
            <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
              <h1 className="mb-10 border-b border-tock-green text-xl font-bold text-tock-green">
                Login to dashboard
              </h1>
              {!isConnected && (
                <div>
                  <p className="text-zinc-200 text-sm">
                    Please Login with your wallet.
                  </p>
                  <div className="flex justify-center mt-8 mb-16">
                    <ConnectButton showBalance={false} chainStatus="none" />
                  </div>
                </div>
              )}
              {isConnected && !verifiedAddress && (
                <div>
                  <p className="text-zinc-200 text-sm">
                    please sign to continue
                  </p>

                  <div className="flex justify-center mt-8">
                    <Button
                      variant="primary"
                      disabled={isLoading || !isConnected}
                      onClick={() => signMessage()}
                    >
                      Sign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isVerified && (
            <div>
              <div>
                <ConnectButton showBalance={false} chainStatus="none" />
              </div>
              <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
                <h1 className="mb-2 text-xl font-bold text-tock-green">
                  New project
                </h1>
                <p className="text-zinc-200 text-sm">
                  {projects.length === 0
                    ? "Launch your first project!"
                    : "Time to launch another project?"}
                </p>
                <div className="flex justify-center mt-12">
                  <button
                    className="transition ease-in-out mr-4 hover:bg-tock-darkgreen duration-300 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
                    type="button"
                    // disabled={submitting}
                    onClick={() => setNewProjectModelShow(true)}
                  >
                    + Launch new project
                  </button>
                  <div>
                    <NewProjectModal
                      isOpen={newPojectModalShow}
                      verifiedAddress={verifiedAddress}
                      onClose={handleCloseNewProjectModal}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h1 className="border-b border-tock-green pb-2 mb-2 mt-6 text-xl font-bold text-tock-green">
                  Projects
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-6">
                  {projects.map((project, i) => (
                    <div key={"project_" + i}>
                      <ProjectPreview project={project} />
                    </div>
                  ))}
                </div>
                {!projects.length && (
                  <div className="text-center text-zinc-500 text-xs">
                    You don't have any projects yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
