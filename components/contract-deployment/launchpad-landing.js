import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { fetchProjectByUUID } from "@/api/projects/projects";
import { LaunchpadContext } from "@/contexts/project-context";
import Launchpad from "./launchpad";
import ConnectModal from "./modals/modal-connect";

export default function LaunchpadLanding({ params }) {
  const { address, isConnected } = useAccount();
  const [project, setProject] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    fetchProjectByUUID(address, params.projectId).then((res) => {
      if (res.success === true) {
        if (res.payload.creator.toLowerCase() !== address.toLowerCase()) {
          setAccessDenied(true);
          return;
        }
        setProject(res.payload);
      }
    });
  }, []);

  if (project && !accessDenied) {
    return (
      <main>
        <LaunchpadContext.Provider value={{ project, setProject }}>
          {isConnected && <Launchpad />}
          {!isConnected && <ConnectModal />}
        </LaunchpadContext.Provider>
      </main>
    );
  }

  if (accessDenied) {
    <div>Sorry</div>;
  }
}
