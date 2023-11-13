// const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
//   message:
//     "By signing this message from tockable.xyz, we make sure that no one is using your dashboard instead of you.",
//   onSuccess(data) {
//     console.log(data);
//     setVerifiedAddress(address);
//   },
// });

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { fetchAllProjectsByWallet } from "@/actions/launchpad/dashboard";
import Loading from "../loading/loading";
import NewProjectModal from "./modal-new-project";
import ProjectPreview from "./project-preview";
import NavbarLaunchpad from "../design/navbar/navvar-launchpad";
import Button from "../design/button/button";

export default function CreatorDashboard() {
  const session = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const [projects, setProjects] = useState([]);
  const [isVerified, setVerified] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [newPojectModalShow, setNewProjectModelShow] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(null);

  useEffect(() => {
    if (!sessionStatus) return;
    if (!session.data || !isConnected) {
      localStorage.setItem("tock", "/dashboard");
      router.push("/auth");
    }
  }, [sessionStatus]);

  useEffect(() => {
    if (session.status === "loading") return;
    setSessionStatus(session.status);
  }, [session.status]);

  useEffect(() => {
    if (isConnected) {
      fetchAllProjectsByWallet(address).then((res) => {
        if (res.success === true) setProjects(res.payload);
        else if (res.success === false) setProjects([]);
      });
    }
  }, []);

  function handleShowNewProjectModal() {
    setNewProjectModelShow(true);
  }

  function handleCloseNewProjectModal() {
    setNewProjectModelShow(false);
  }

  async function handleSignout() {
    disconnectAsync();
    signOut({ callbackUrl: "/" });
  }

  if (!isConnected)
    return <Loading isLoading={!isConnected} size={30} variant="page" />;

  return (
    <div className="relative top-24">
      <NavbarLaunchpad />

      <div className="flex justify-center items-center">
        <div className="basis-11/12 md:basis-3/4 lg:basis-5/6">
          <nav className="flex justify-center items-center px-2 py-8 mb-4 rounded-xl xxs:h-20 xs:h-12 bg-tock-semiblack border border-tock-black">
            <Link href={"/"}>
              <button className="p-8 mx-1 text-center transition ease-in-out hover:bg-tock-black duration-300 text-gray-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white flex-auto">
                Home
              </button>
            </Link>
            <ConnectButton chainStatus={"icon"} showBalance={false} />
            {isConnected && (
              <div>
                <button
                  onClick={() => handleSignout()}
                  className="p-8 mx-1 text-center transition ease-in-out duration-300 text-gray-500 hover:text-tock-red font-bold py-2 px-4 focus:outline-none focus:shadow-outline active:text-tock-red flex-auto"
                >
                  sign out
                </button>
              </div>
            )}
          </nav>
          {session.data && (
            <div>
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
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleShowNewProjectModal}
                  >
                    + Launch new project
                  </Button>
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
