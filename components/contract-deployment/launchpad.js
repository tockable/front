import { useState, useContext } from "react";
import { LaunchpadContext } from "@/contexts/project-context";
import ProjectDetailsForm from "./project-details-form";
import ProjectContractForm from "./project-contract-form";
import ProjectMetadataForm from "./project-metadata-from";
import ProjectRolesForm from "./project-roles-form";
import ProjectSessionsForm from "./project-sessions-form";
import DeployedContractView from "./deployed-contract-view";

const pages = [
  "Details",
  "Metadata",
  "Contract",
  "Roles",
  "Sessions",
  "Publish",
];

export default function Launchpad() {
  const [activePage, setActivePage] = useState(pages[0]);
  const { project } = useContext(LaunchpadContext);

  return (
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
              <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
                {activePage === "Details" && <ProjectDetailsForm />}
                {activePage === "Metadata" && <ProjectMetadataForm />}
                {activePage === "Contract" && !project.isDeployed && (
                  <ProjectContractForm />
                )}
                {activePage === "Contract" && project.isDeployed && (
                  <DeployedContractView />
                )}
                {activePage === "Roles" && <ProjectRolesForm />}
                {activePage === "Sessions" && <ProjectSessionsForm />}
                {activePage === "Publish" && <p>Publish page</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
