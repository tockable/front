import { useState, useContext } from "react";
import Link from "next/link";
import { useDisconnect, useAccount } from "wagmi";
import { signOut } from "next-auth/react";
import { LaunchpadContext } from "@/contexts/project-context";
import ProjectDetailsForm from "./project-details-form";
import ProjectContractForm from "./project-contract-form";
import ProjectMetadataForm from "./project-metadata-from";
import ProjectRolesForm from "./project-roles-form";
import ProjectSessionsForm from "./project-sessions-form";
import DeployedContractView from "./deployed-contract-view";
import ProjectPublish from "./project-publish";
import ProjectContractActions from "./project-contarct-actions";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NavbarLaunchpad from "../design/navbar/navvar-launchpad";
import Loading from "../loading/loading";

const pages = [
  "Details",
  "Contract",
  "Metadata",
  "Roles",
  "Sessions",
  "Publish",
  "Actions",
];

function NotDeployedYet() {
  return (
    <div className="flex justify-center align-items h-24 text-tock-orange">
      you need to deploy your contract first
    </div>
  );
}

export default function Launchpad() {
  const [activePage, setActivePage] = useState(pages[0]);
  const { project } = useContext(LaunchpadContext);
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  async function handleSignout() {
    disconnectAsync();
    signOut({ callbackUrl: "/" });
  }
  if (!isConnected)
    return <Loading isLoading={!isConnected} size={30} variant="page" />;

  return (
    <div id="banner" className="h-screen mt-20">
      {" "}
      <NavbarLaunchpad />
      <div className="flex mt-10 justify-center">
        <div className="flex flex-col md:flex-row mt-10 basis-5/6">
          <div className="flex justify-center mb-10">
            <nav className="flex flex-col gap-2 text-sm text-tock-green w-48 mx-4">
              {pages.map((page) => (
                <button
                  className={`bg-${
                    activePage === page ? "zinc-700" : "tock-black"
                  } 
             ${
               activePage === page ? "" : "hover:bg-tock-semiblack"
             } transition ease-in-out duration-300 rounded-2xl h-10 border border-zinc-700`}
                  key={page}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
          <div></div>
          <div className="w-full">
            <div className="flex justify-center items-center">
              <div className="basis-11/12">
                <div className="flex justify-center items-center">
                  <nav className="flex justify-center items-center px-2 py-1 mb-4 rounded-xl bg-tock-semiblack border border-tock-black">
                    <Link href="/dashboard">
                      <button className="mx-1 text-center transition ease-in-out hover:bg-tock-black duration-300 text-gray-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white flex-auto">
                        Dashboard
                      </button>
                    </Link>
                    <ConnectButton chainStatus={"icon"} showBalance={false} />

                    {isConnected && (
                      <button
                        onClick={() => handleSignout()}
                        className="p-8 mx-1 text-center transition ease-in-out duration-300 text-gray-500 hover:text-tock-red font-bold py-2 px-4 focus:outline-none focus:shadow-outline active:text-tock-red flex-auto"
                      >
                        sign out
                      </button>
                    )}
                  </nav>
                </div>
                <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
                  {activePage === "Details" && <ProjectDetailsForm />}
                  {activePage === "Contract" && !project.isDeployed && (
                    <ProjectContractForm />
                  )}
                  {activePage === "Contract" && project.isDeployed && (
                    <DeployedContractView />
                  )}
                  {activePage === "Metadata" &&
                    project.isDeployed &&
                    project.cids.length === 0 && <ProjectMetadataForm />}

                  {activePage === "Metadata" &&
                    project.isDeployed &&
                    project.cids.length !== 0 && (
                      <div>
                        <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
                          metadata deployed sussescully
                        </h1>
                      </div>
                    )}

                  {activePage === "Metadata" && !project.isDeployed && (
                    <NotDeployedYet />
                  )}

                  {activePage === "Roles" && project.isDeployed && (
                    <ProjectRolesForm />
                  )}
                  {activePage === "Roles" && !project.isDeployed && (
                    <NotDeployedYet />
                  )}
                  {activePage === "Sessions" && project.isDeployed && (
                    <ProjectSessionsForm />
                  )}
                  {activePage === "Sessions" && !project.isDeployed && (
                    <NotDeployedYet />
                  )}
                  {activePage === "Publish" && project.isDeployed && (
                    <ProjectPublish />
                  )}
                  {activePage === "Publish" && !project.isDeployed && (
                    <NotDeployedYet />
                  )}
                  {activePage === "Actions" && project.isDeployed && (
                    <ProjectContractActions />
                  )}
                  {activePage === "Actions" && !project.isDeployed && (
                    <NotDeployedYet />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
