import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import { getContractAbi } from "@/actions/contract/metadata";
import { LaunchpadContext } from "@/contexts/project-context";
import Launchpad from "./launchpad";
import NotFound from "../not-found/not-found";

export default function LaunchpadLanding({ params }) {
  const session = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();

  const [project, setProject] = useState(null);
  const [abi, setAbi] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      router.push("/auth");
    }

    fetchProjectByUUID(address, params.projectId).then((res) => {
      if (res.success === true) {
        if (res.payload.creator.toLowerCase() !== address.toLowerCase()) {
          router.push("/dashboard");
        } else {
          setProject(res.payload);
        }
      } else {
        router.push("/dashboard");
      }
    });
  }, []);

  useEffect(() => {
    if (session.status === "loading") return;
    setSessionStatus(session);
  }, [session.status]);

  useEffect(() => {
    if (!sessionStatus) return;
    if (!sessionStatus.data)
      if (
        sessionStatus.data?.user?.address?.toLowerCase() !=
        address.toLowerCase()
      ) {
        localStorage.setItem("tock", `launchpad/${params.projectId}`);
        router.push("/auth");
      }

    if (!session.data || !isConnected) {
      localStorage.setItem("tock", `launchpad/${params.projectId}`);
      router.push("/auth");
    }
  }, [sessionStatus]);

  async function callGetContractAbi() {
    if (!project) return { success: false };
    const { dropType } = project;
    const dropAbi = await getContractAbi(dropType);
    setAbi(dropAbi);
    return { success: true };
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
