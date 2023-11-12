import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import { getContractAbi } from "@/actions/contract/metadata";
import { LaunchpadContext } from "@/contexts/project-context";
import Launchpad from "./launchpad";

export default function LaunchpadLanding({ params }) {
  const session = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const [project, setProject] = useState(null);
  const [abi, setAbi] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);

  useEffect(() => {
    if (!isConnected) return;
    fetchProjectByUUID(address, params.projectId).then((res) => {
      if (res.success === true) {
        if (res.payload.creator.toLowerCase() !== address.toLowerCase()) {
          router.push("/dashboard");
        }
        setProject(res.payload);
      }
    });
  }, []);

  useEffect(() => {
    if (session.status === "loading") return;
    setSessionStatus(session.status);
  }, [session.status]);

  useEffect(() => {
    if (!sessionStatus) return;
    if (!session.data || !isConnected) {
      localStorage.setItem("tock", `launchpad/${params.projectId}`);
      router.push("/auth");
    }
  }, [sessionStatus]);

  async function callGetContractAbi() {
    if (!project) return { success: false };
    const { creator, uuid, name } = project;
    const res = await getContractAbi(creator, uuid, name);
    if (res.success === true) {
      setAbi(res.abi);
      return { success: true };
    } else {
      return { success: false };
    }
  }

  if (project) {
    return (
      <main>
        <LaunchpadContext.Provider
          value={{ project, setProject, abi, setAbi, callGetContractAbi }}
        >
          <div className="mt-2">
            <Launchpad />
          </div>
        </LaunchpadContext.Provider>
      </main>
    );
  }
}
